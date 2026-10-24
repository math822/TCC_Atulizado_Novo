import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import { lerSessao, validarCNPJ } from "../../../lib/auth"

export async function POST(req: Request) {
  try {
    const sessao = await lerSessao()

    if (!sessao?.id_usuario) {
      return NextResponse.json(
        { error: "Faça login para concluir o cadastro." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const cnpj = String(body.cnpj || "").replace(/\D/g, "")

    if (!cnpj) {
      return NextResponse.json(
        { error: "Informe o CNPJ da sua empresa." },
        { status: 400 }
      )
    }

    if (!validarCNPJ(cnpj)) {
      return NextResponse.json(
        { error: "CNPJ inválido." },
        { status: 400 }
      )
    }

    const usuarioAtual = await prisma.usuario.findUnique({
      where: { id_usuario: sessao.id_usuario }
    })

    if (!usuarioAtual) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      )
    }

    const cnpjExiste = await prisma.usuario.findUnique({
      where: { cnpj }
    })

    if (cnpjExiste && cnpjExiste.id_usuario !== usuarioAtual.id_usuario) {
      return NextResponse.json(
        { error: "Este CNPJ já está cadastrado." },
        { status: 400 }
      )
    }

    const usuario = await prisma.usuario.update({
      where: { id_usuario: sessao.id_usuario },
      data: {
        tipo: "empreendedor",
        cnpj,
        status_verificacao: "pendente"
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
      message: "Cadastro de empreendedor concluído! CNPJ enviado para verificação.",
      usuario: usuarioSeguro
    })

    resposta.cookies.set("usuario", JSON.stringify(usuarioSeguro), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    })

    return resposta
  } catch (error) {
    console.error("ERRO AO CONCLUIR CADASTRO:", error)

    return NextResponse.json(
      { error: "Erro ao concluir o cadastro." },
      { status: 500 }
    )
  }
}
