import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const usuario = await prisma.usuario.findUnique({
      where: {
        email: body.email
      }
    })

    if (!usuario) {
      return NextResponse.json(
        { error: "Email não encontrado" },
        { status: 401 }
      )
    }

    const senhaCorreta = await bcrypt.compare(body.senha, usuario.senha)

    if (!senhaCorreta) {
      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      )
    }

    const usuarioSeguro = {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    }

    const resposta = NextResponse.json({
      message: "Login realizado com sucesso",
      usuario: usuarioSeguro
    })

    resposta.cookies.set("usuario", JSON.stringify(usuarioSeguro), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    })

    return resposta

  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no login" },
      { status: 500 }
    )
  }
}