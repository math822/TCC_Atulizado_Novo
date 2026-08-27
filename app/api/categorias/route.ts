import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"

export async function GET() {

  try {

    const categorias = await prisma.categoria.findMany({

      orderBy: {
        nome: "asc"
      }

    })

    return NextResponse.json(categorias)

  } catch (error) {

    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    )

  }

}

export async function POST() {

  try {

    const categoriasExistentes =
      await prisma.categoria.count()

    if (categoriasExistentes > 0) {

      return NextResponse.json({
        message: "Categorias já cadastradas"
      })

    }

    const categorias = [

      {
        nome: "Alimentação",
        descricao: "Restaurantes, lanches e comidas"
      },

      {
        nome: "Beleza",
        descricao: "Salões, barbearias e estética"
      },

      {
        nome: "Informática",
        descricao: "Assistência técnica e tecnologia"
      },

      {
        nome: "Moda",
        descricao: "Roupas, calçados e acessórios"
      },

      {
        nome: "Serviços",
        descricao: "Prestadores de serviço"
      },

      {
        nome: "Artesanato",
        descricao: "Produtos artesanais"
      }

    ]

    await prisma.categoria.createMany({
      data: categorias
    })

    return NextResponse.json({
      message: "Categorias cadastradas com sucesso"
    })

  } catch (error) {

    return NextResponse.json(
      { error: "Erro ao cadastrar categorias" },
      { status: 500 }
    )

  }

}