import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import { exigirDonoNegocio } from "../../../lib/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const produto = await prisma.produto.findUnique({
      where: {
        id_produto: id
      }
    })

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(produto)

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const produto = await prisma.produto.findUnique({
      where: { id_produto: id }
    })

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    const bloqueado = await exigirDonoNegocio(produto.id_negocio)

    if (bloqueado) {
      return bloqueado
    }

    const body = await req.json()

    const atualizado = await prisma.produto.update({
      where: {
        id_produto: id
      },

      data: {
        nome: body.nome,
        descricao: body.descricao,
        preco: Number(body.preco),
        status: body.status
      }
    })

    return NextResponse.json({
      message: "Produto atualizado com sucesso",
      produto: atualizado
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const produto = await prisma.produto.findUnique({
      where: { id_produto: id }
    })

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    const bloqueado = await exigirDonoNegocio(produto.id_negocio)

    if (bloqueado) {
      return bloqueado
    }

    await prisma.produto.delete({
      where: {
        id_produto: id
      }
    })

    return NextResponse.json({
      message: "Produto apagado com sucesso"
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao apagar produto" },
      { status: 500 }
    )
  }
}
