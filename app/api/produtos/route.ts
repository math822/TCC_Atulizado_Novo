import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"
import { exigirDonoNegocio } from "../../lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id_usuario = searchParams.get("id_usuario")

    const where: any = {}

    if (id_usuario) {
      where.negocio = { id_usuario }
    }

    const produtos = await prisma.produto.findMany({
      where,
      include: {
        negocio: true
      },
      orderBy: {
        data_criacao: "desc"
      }
    })

    return NextResponse.json(produtos)

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.id_negocio) {
      return NextResponse.json(
        { error: "Selecione um negócio válido." },
        { status: 400 }
      )
    }

    const bloqueado = await exigirDonoNegocio(body.id_negocio)

    if (bloqueado) {
      return bloqueado
    }

    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
        preco: Number(body.preco),
        status: body.status || "disponivel",
        imagem: body.imagem || null,
        id_negocio: body.id_negocio
      }
    })

    return NextResponse.json({
      message: "Produto cadastrado com sucesso",
      produto
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao cadastrar produto" },
      { status: 500 }
    )
  }
}
