import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"

export async function GET() {

  try {

    const usuarios =
      await prisma.usuario.count()

    const negocios =
      await prisma.negocio.count()

    const produtos =
      await prisma.produto.count()

    const favoritos =
      await prisma.favorito.count()

    return NextResponse.json({

      usuarios,
      negocios,
      produtos,
      favoritos

    })

  } catch (error) {

    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    )

  }

}