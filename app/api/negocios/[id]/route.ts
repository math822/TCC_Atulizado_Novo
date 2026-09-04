import { NextResponse } from "next/server"

import prisma from "../../../lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const negocio = await prisma.negocio.findUnique({
      where: {
        id_negocio: id,
      },
      include: {
        endereco: true,
        fotos: true,
        produtos: true,
        avaliacoes: true,
        usuario: true,
      },
    })

    if (!negocio) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(negocio)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar negócio" },
      { status: 500 }
    )
  }
}