import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"
import { exigirEmpreendedor, sessaoObrigatoria } from "../../lib/auth"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const busca = searchParams.get("busca") || ""
    const categoria = searchParams.get("categoria") || ""
    const cidade = searchParams.get("cidade") || ""
    const ordenar = searchParams.get("ordenar") || "recentes"
    const destaques = searchParams.get("destaques") === "true"

    // Paginação só entra quando a tela pede; as telas que montam destaques
    // precisam da lista inteira para escolher um por categoria.
    const limite = Number(searchParams.get("limite")) || 0
    const pagina = Number(searchParams.get("pagina")) || 1

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
        usuario: { select: { id_usuario: true, nome: true, foto_perfil: true } },
        categoria: true,
        endereco: true,
        fotos: true
      },
      orderBy:
        ordenar === "avaliacao"
          ? [{ media_avaliacao: "desc" }, { data_criacao: "desc" }]
          : { data_criacao: "desc" },
      ...(limite && !destaques
        ? { take: limite, skip: (pagina - 1) * limite }
        : {})
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

    // A identidade de quem cria o negócio vem do cookie de sessão, não do corpo.
    const sessao = await sessaoObrigatoria(body.id_usuario || body.usuarioId)

    if (sessao instanceof NextResponse) {
      return sessao
    }

    const id_usuario = sessao.id_usuario

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
        id_categoria: body.id_categoria || null,
        endereco: {
          create: {
            cep: body.cep || null,
            rua: body.rua || null,
            numero: body.numero || null,
            bairro: body.bairro || null,
            cidade: body.cidade || null,
            estado: body.estado || null
          }
        },
        ...(body.imagem ? { fotos: { create: { url: body.imagem } } } : {})
      },
      include: {
        usuario: { select: { id_usuario: true, nome: true, foto_perfil: true } },
        categoria: true,
        endereco: true,
        fotos: true
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