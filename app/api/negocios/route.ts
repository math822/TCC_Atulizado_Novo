import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"
import { exigirEmpreendedor } from "../../lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const busca = searchParams.get("busca") || ""
    const categoria = searchParams.get("categoria") || ""
    const cidade = searchParams.get("cidade") || ""
    const ordenar = searchParams.get("ordenar") || "recentes"
    const destaques = searchParams.get("destaques") === "true"

    const where: any = {}

    if (busca) {
      where.OR = [
        { nome: { contains: busca, mode: "insensitive" } },
        { descricao: { contains: busca, mode: "insensitive" } }
      ]
    }

    if (categoria) {
      where.categoria = { nome: categoria }
    }

    if (cidade) {
      where.endereco = {
        cidade: { contains: cidade, mode: "insensitive" }
      }
    }

    const negocios = await prisma.negocio.findMany({
      where,
      include: {
        usuario: true,
        categoria: true,
        endereco: true,
        fotos: true
      },
      orderBy:
        ordenar === "avaliacao"
          ? [{ media_avaliacao: "desc" }, { data_criacao: "desc" }]
          : { data_criacao: "desc" }
    })

    if (destaques) {
      const categoriasIncluidas = new Set<string>()
      const melhoresPorCategoria = negocios.filter((negocio) => {
        if (!negocio.id_categoria || categoriasIncluidas.has(negocio.id_categoria)) {
          return false
        }
        categoriasIncluidas.add(negocio.id_categoria)
        return true
      })

      return NextResponse.json(melhoresPorCategoria)
    }

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

    const bloqueado = await exigirEmpreendedor(id_usuario)

    if (bloqueado) {
      return bloqueado
    }

    const negocio = await prisma.negocio.create({
      data: {
        nome: body.nome,
        descricao: body.descricao || null,
        telefone: body.telefone || null,
        horario_funcionamento: body.horario_funcionamento || null,
        status: body.status || "ativo",
        id_usuario: id_usuario,
        id_categoria: body.id_categoria || null
      },
      include: {
        usuario: true,
        categoria: true
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