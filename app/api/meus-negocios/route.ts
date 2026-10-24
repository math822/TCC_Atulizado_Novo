import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"
import { sessaoObrigatoria } from "../../lib/auth"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const sessao = await sessaoObrigatoria(body.id_usuario)
    if (sessao instanceof NextResponse) return sessao

    const negocios = await prisma.negocio.findMany({

      where: {
        id_usuario: sessao.id_usuario
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