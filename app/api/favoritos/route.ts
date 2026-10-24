import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"
import { sessaoObrigatoria } from "../../lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const sessao = await sessaoObrigatoria(searchParams.get("id_usuario"))
    if (sessao instanceof NextResponse) return sessao

    const favoritos = await prisma.favorito.findMany({
      where: {
        id_usuario: sessao.id_usuario
      },
      include: {
        negocio: {
          include: {
            fotos: true,
            endereco: true
          }
        }
      }
    })

    return NextResponse.json(favoritos)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar favoritos" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const sessao = await sessaoObrigatoria(body.id_usuario)
    if (sessao instanceof NextResponse) return sessao

    const existente = await prisma.favorito.findUnique({
      where: {
        id_usuario_id_negocio: {
          id_usuario: sessao.id_usuario,
          id_negocio: body.id_negocio
        }
      }
    })

    if (existente) {
      await prisma.favorito.delete({
        where: {
          id_favorito: existente.id_favorito
        }
      })

      return NextResponse.json({
        favoritado: false,
        message: "Removido dos favoritos"
      })
    }

    await prisma.favorito.create({
      data: {
        id_usuario: sessao.id_usuario,
        id_negocio: body.id_negocio
      }
    })

    return NextResponse.json({
      favoritado: true,
      message: "Adicionado aos favoritos"
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar favorito" },
      { status: 500 }
    )
  }
}