import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id_usuario = searchParams.get("id_usuario")

    if (!id_usuario) {
      return NextResponse.json(
        { error: "Usuário não informado" },
        { status: 400 }
      )
    }

    const favoritos = await prisma.favorito.findMany({
      where: {
        id_usuario
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

    const existente = await prisma.favorito.findUnique({
      where: {
        id_usuario_id_negocio: {
          id_usuario: body.id_usuario,
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
        id_usuario: body.id_usuario,
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