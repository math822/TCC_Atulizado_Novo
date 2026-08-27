import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const negocios = await prisma.negocio.findMany({

      where: {
        id_usuario: body.id_usuario
      },

      include: {
        endereco: true,
        fotos: true,
        produtos: true,
        avaliacoes: true
      },

      orderBy: {
        data_criacao: "desc"
      }

    })

    return NextResponse.json(negocios)

  } catch (error) {

    return NextResponse.json(
      { error: "Erro ao buscar negócios" },
      { status: 500 }
    )

  }

}