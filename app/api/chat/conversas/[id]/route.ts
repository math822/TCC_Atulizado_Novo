import { NextResponse } from "next/server"
import prisma from "../../../../lib/prisma"
import { sessaoObrigatoria } from "../../../../lib/auth"

async function carregarConversa(id_conversa: string, id_usuario: string) {
  const conversa = await prisma.conversa.findUnique({
    where: { id_conversa },
    include: {
      cliente: { select: { id_usuario: true, nome: true, foto_perfil: true } },
      empreendedor: { select: { id_usuario: true, nome: true, foto_perfil: true } },
      negocio: { select: { id_negocio: true, nome: true } }
    }
  })

  if (!conversa) return null
  const participante =
    conversa.id_cliente === id_usuario || conversa.id_empreendedor === id_usuario
  if (!participante) return "nao_participante"

  return conversa
}

// Busca os detalhes + mensagens de uma conversa
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(req.url)

    const sessao = await sessaoObrigatoria(searchParams.get("id_usuario"))
    if (sessao instanceof NextResponse) return sessao
    const id_usuario = sessao.id_usuario

    const conversa = await carregarConversa(id, id_usuario)
    if (!conversa) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 })
    if (conversa === "nao_participante")
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })

    const mensagens = await prisma.mensagem.findMany({
      where: { id_conversa: id },
      orderBy: { data: "asc" },
      select: {
        id_mensagem: true,
        texto: true,
        data: true,
        lida: true,
        id_remetente: true
      }
    })

    // Marca como lidas as mensagens recebidas
    await prisma.mensagem.updateMany({
      where: { id_conversa: id, id_remetente: { not: id_usuario }, lida: false },
      data: { lida: true }
    })

    const outro =
      conversa.id_cliente === id_usuario ? conversa.empreendedor : conversa.cliente

    return NextResponse.json({
      id_conversa: conversa.id_conversa,
      assunto: conversa.assunto,
      negocio: conversa.negocio,
      outro,
      mensagens
    })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar conversa" }, { status: 500 })
  }
}

// Envia uma mensagem dentro da conversa
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    const sessao = await sessaoObrigatoria(body.id_usuario)
    if (sessao instanceof NextResponse) return sessao
    const id_usuario = sessao.id_usuario

    const texto = (body.texto || "").toString().trim()

    if (!texto) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 })
    }

    if (texto.length > 2000) {
      return NextResponse.json({ error: "Mensagem longa demais" }, { status: 400 })
    }

    const conversa = await carregarConversa(id, id_usuario)
    if (!conversa) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 })
    if (conversa === "nao_participante")
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })

    const mensagem = await prisma.mensagem.create({
      data: {
        id_conversa: id,
        id_remetente: id_usuario,
        texto
      },
      select: { id_mensagem: true, texto: true, data: true, id_remetente: true }
    })

    // Toca a conversa para atualizar a ordenação da inbox
    await prisma.conversa.update({
      where: { id_conversa: id },
      data: { atualizado_em: new Date() }
    })

    return NextResponse.json(mensagem)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 })
  }
}
