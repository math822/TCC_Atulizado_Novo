import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"
import { sessaoObrigatoria } from "../../lib/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const sessao = await sessaoObrigatoria(body.id_usuario)
    if (sessao instanceof NextResponse) return sessao

    if (!body.id_negocio) {
      return NextResponse.json(
        { error: "Negócio não informado" },
        { status: 400 }
      )
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        nota: Number(body.nota),
        comentario: body.comentario,
        id_usuario: sessao.id_usuario,
        id_negocio: body.id_negocio
      }
    })

    const avaliacoes = await prisma.avaliacao.findMany({
      where: {
        id_negocio: body.id_negocio
      }
    })

    const media =
      avaliacoes.reduce((soma, item) => soma + item.nota, 0) / avaliacoes.length

    await prisma.negocio.update({
      where: {
        id_negocio: body.id_negocio
      },
      data: {
        media_avaliacao: Number(media.toFixed(1))
      }
    })

    return NextResponse.json({
      message: "Avaliação cadastrada com sucesso",
      avaliacao
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao cadastrar avaliação" },
      { status: 500 }
    )
  }
}