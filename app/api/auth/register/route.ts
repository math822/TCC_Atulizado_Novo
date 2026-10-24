import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import { validarCNPJ } from "../../../lib/auth"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const nome = String(body.nome || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const senha = String(body.senha || "")
    const telefone = body.telefone
      ? String(body.telefone).trim()
      : null
    const tipo = body.tipo || "cliente"

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios" },
        { status: 400 }
      )
    }

    if (!["cliente", "empreendedor", "admin"].includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo de usuário inválido" },
        { status: 400 }
      )
    }

    if (tipo === "admin") {
      if (body.adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json(
          { error: "Credencial de administrador inválida" },
          { status: 403 }
        )
      }
    }

    let cnpj: string | null = null

    if (tipo === "empreendedor") {
      if (!body.cnpj) {
        return NextResponse.json(
          { error: "O CNPJ é obrigatório para empreendedores" },
          { status: 400 }
        )
      }

      cnpj = String(body.cnpj).replace(/\D/g, "")

      if (!validarCNPJ(cnpj)) {
        return NextResponse.json(
          { error: "CNPJ inválido" },
          { status: 400 }
        )
      }

      const cnpjExiste = await prisma.usuario.findUnique({
        where: {
          cnpj
        }
      })

      if (cnpjExiste) {
        return NextResponse.json(
          { error: "Este CNPJ já está cadastrado" },
          { status: 400 }
        )
      }
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: {
        email
      }
    })

    if (usuarioExiste) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      )
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone,
        tipo,
        cnpj,
        status_verificacao:
          tipo === "empreendedor"
            ? "pendente"
            : "nao_solicitada"
      }
    })

    const usuarioSeguro = {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      tipo: usuario.tipo,
      cnpj: usuario.cnpj,
      status_verificacao: usuario.status_verificacao,
      foto_perfil: usuario.foto_perfil
    }

    const resposta = NextResponse.json({
      message:
        tipo === "empreendedor"
          ? "Cadastro realizado. Seu CNPJ está pendente de verificação."
          : "Usuário cadastrado com sucesso",
      usuario: usuarioSeguro
    })

    resposta.cookies.set("usuario", JSON.stringify(usuarioSeguro), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    })

    return resposta
  } catch (error) {
    console.error("ERRO AO CADASTRAR USUÁRIO:", error)

    return NextResponse.json(
      { error: "Erro ao cadastrar usuário" },
      { status: 500 }
    )
  }
}