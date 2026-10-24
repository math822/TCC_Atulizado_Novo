import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import { sessaoObrigatoria } from "../../../lib/auth"

// Lista as conversas do usuário logado (inbox)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const sessao = await sessaoObrigatoria(searchParams.get("id_usuario"))
    if (sessao instanceof NextResponse) return sessao
    const id_usuario = sessao.id_usuario

    const conversas = await prisma.conversa.findMany({
      where: {
        OR: [{ id_cliente: id_usuario }, { id_empreendedor: id_usuario }]
      },
      include: {
        cliente: { select: { id_usuario: true, nome: true, foto_perfil: true } },
        empreendedor: { select: { id_usuario: true, nome: true, foto_perfil: true } },
        negocio: { select: { id_negocio: true, nome: true } },
        mensagens: {
          orderBy: { data: "desc" },
          take: 1,
          select: { texto: true, data: true, id_remetente: true }
        },
        _count: {
          select: {
            mensagens: {
              where: { lida: false, id_remetente: { not: id_usuario } }
            }
          }
        }
      },
      orderBy: { atualizado_em: "desc" }
    })

    const formatadas = conversas.map((c) => {
      const outro =
        c.id_cliente === id_usuario ? c.empreendedor : c.cliente
      return {
        id_conversa: c.id_conversa,
        assunto: c.assunto,
        negocio: c.negocio,
        outro,
        ultima_mensagem: c.mensagens[0] ?? null,
        nao_lidas: c._count.mensagens,
        atualizado_em: c.atualizado_em
      }
    })

    return NextResponse.json(formatadas)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar conversas" }, { status: 500 })
  }
}

// Abre (ou cria) uma conversa com o dono de um negócio
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const sessao = await sessaoObrigatoria(body.id_usuario)
    if (sessao instanceof NextResponse) return sessao
    const id_usuario = sessao.id_usuario

    const id_negocio = body.id_negocio

    if (!id_negocio) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const negocio = await prisma.negocio.findUnique({
      where: { id_negocio },
      select: { id_negocio: true, nome: true, id_usuario: true }
    })

    if (!negocio) {
      return NextResponse.json({ error: "Negócio não encontrado" }, { status: 404 })
    }

    if (negocio.id_usuario === id_usuario) {
      return NextResponse.json(
        { error: "Você é o dono deste negócio" },
        { status: 400 }
      )
    }

    const id_empreendedor = negocio.id_usuario

    let conversa = await prisma.conversa.findFirst({
      where: {
        id_cliente: id_usuario,
        id_empreendedor,
        id_negocio
      }
    })

    if (!conversa) {
      conversa = await prisma.conversa.create({
        data: {
          id_cliente: id_usuario,
          id_empreendedor,
          id_negocio,
          assunto: negocio.nome
        }
      })
    }

    return NextResponse.json({ id_conversa: conversa.id_conversa })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao abrir conversa" }, { status: 500 })
  }
}
