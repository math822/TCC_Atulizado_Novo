import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const busca = searchParams.get("busca") || ""

    const negocios = await prisma.negocio.findMany({
      where: busca
        ? {
            OR: [
              { nome: { contains: busca } },
              { descricao: { contains: busca } }
            ]
          }
        : {},
      include: {
        usuario: true
      },
      orderBy: {
        id_negocio: "desc"
      }
    })

    return NextResponse.json(negocios)
  } catch (error) {
    console.log("ERRO API NEGOCIOS:", error)

    return NextResponse.json(
      { error: "Erro ao buscar negócios" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const id_usuario = body.id_usuario || body.usuarioId

    if (!id_usuario) {
      return NextResponse.json(
        { error: "Usuário não identificado" },
        { status: 401 }
      )
    }

    const negocio = await prisma.negocio.create({
      data: {
        nome: body.nome,
        descricao: body.descricao || null,
        telefone: body.telefone || null,
        horario_funcionamento: body.horario_funcionamento || null,
        status: body.status || "ativo",
        id_usuario: id_usuario
      },
      include: {
        usuario: true
      }
    })

    return NextResponse.json(
      {
        message: "Negócio cadastrado",
        negocio
      },
      { status: 201 }
    )
  } catch (error) {
    console.log("ERRO CADASTRAR NEGOCIO:", error)

    return NextResponse.json(
      { error: "Erro ao cadastrar negócio" },
      { status: 500 }
    )
  }
}