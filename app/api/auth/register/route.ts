import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (body.tipo === "admin") {
      if (body.adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json(
          { error: "Credencial de administrador inválida" },
          { status: 403 }
        )
      }
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: {
        email: body.email
      }
    })

    if (usuarioExiste) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      )
    }

    const senhaHash = await bcrypt.hash(body.senha, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nome: body.nome,
        email: body.email,
        senha: senhaHash,
        telefone: body.telefone || null,
        tipo: body.tipo || "cliente"
      }
    })

    return NextResponse.json({
      message: "Usuário cadastrado com sucesso",
      usuario
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao cadastrar usuário" },
      { status: 500 }
    )
  }
}