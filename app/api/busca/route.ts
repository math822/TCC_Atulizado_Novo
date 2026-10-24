import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get("q") || "").trim()

    if (!q) {
      return NextResponse.json({ negocios: [], categorias: [] })
    }

    const [negocios, categorias] = await Promise.all([
      prisma.negocio.findMany({
        where: {
          OR: [
            { nome: { contains: q, mode: "insensitive" } },
            { descricao: { contains: q, mode: "insensitive" } }
          ]
        },
        select: {
          id_negocio: true,
          nome: true,
          endereco: { select: { cidade: true, bairro: true } },
          categoria: { select: { nome: true } }
        },
        orderBy: { media_avaliacao: "desc" },
        take: 6
      }),
      prisma.categoria.findMany({
        where: { nome: { contains: q, mode: "insensitive" } },
        select: { id_categoria: true, nome: true },
        take: 5
      })
    ])

    return NextResponse.json({ negocios, categorias })
  } catch (error) {
    console.log("ERRO API BUSCA:", error)
    return NextResponse.json(
      { error: "Erro ao buscar sugestões" },
      { status: 500 }
    )
  }
}
