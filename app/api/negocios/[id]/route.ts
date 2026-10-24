import { NextResponse } from "next/server"

import prisma from "../../../lib/prisma"
import { exigirDonoNegocio } from "../../../lib/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const negocio = await prisma.negocio.findUnique({
      where: {
        id_negocio: id,
      },
      include: {
        endereco: true,
        fotos: true,
        produtos: true,
        avaliacoes: {
          orderBy: { data: "desc" },
          // Só nome e foto: a conta inteira (inclusive o hash de senha) não vai para o cliente.
          include: { usuario: { select: { nome: true, foto_perfil: true } } },
        },
        usuario: { select: { id_usuario: true, nome: true, foto_perfil: true } },
        categoria: true,
      },
    })

    if (!negocio) {
      return NextResponse.json(
        { error: "Negócio não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(negocio)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar negócio" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const bloqueado = await exigirDonoNegocio(id)

    if (bloqueado) {
      return bloqueado
    }

    if (!String(body.nome || "").trim()) {
      return NextResponse.json(
        { error: "O nome do negócio é obrigatório" },
        { status: 400 }
      )
    }

    const enderecoDados = {
      cep: body.cep || null,
      rua: body.rua || null,
      numero: body.numero || null,
      bairro: body.bairro || null,
      cidade: body.cidade || null,
      estado: body.estado || null,
    }

    // A tela de edição tem um único campo de foto, que é a capa usada em todos os cards.
    const temImagem = typeof body.imagem === "string" && body.imagem.length > 0

    const negocio = await prisma.negocio.update({
      where: {
        id_negocio: id,
      },
      data: {
        nome: String(body.nome).trim(),
        descricao: body.descricao || null,
        telefone: body.telefone || null,
        horario_funcionamento: body.horario_funcionamento || null,
        endereco: {
          upsert: {
            create: enderecoDados,
            update: enderecoDados,
          },
        },
        ...(temImagem
          ? { fotos: { deleteMany: {}, create: { url: body.imagem } } }
          : {}),
      },
      include: {
        endereco: true,
        fotos: true,
        categoria: true,
      },
    })

    return NextResponse.json({
      message: "Negócio atualizado com sucesso",
      negocio,
    })
  } catch (error) {
    console.log("ERRO EDITAR NEGOCIO:", error)

    return NextResponse.json(
      { error: "Erro ao atualizar negócio" },
      { status: 500 }
    )
  }
}