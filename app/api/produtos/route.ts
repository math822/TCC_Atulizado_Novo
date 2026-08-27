import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        negocio: true
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

    const produto = await prisma.produto.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
        preco: Number(body.preco),
        status: body.status || "disponivel",
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