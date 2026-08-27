import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        data_cadastro: "desc"
      }
    })

    return NextResponse.json(usuarios)

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    )
  }
}