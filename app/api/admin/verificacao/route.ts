import { NextResponse } from "next/server"

import prisma from "../../../lib/prisma"
import { exigirAdmin } from "../../../lib/auth"

const statusValidos = ["pendente", "aprovado", "rejeitado", "nao_solicitada"]

export async function GET() {
  try {
    const bloqueado = await exigirAdmin()
    if (bloqueado instanceof NextResponse) return bloqueado

    const empreendedores = await prisma.usuario.findMany({
      where: { tipo: "empreendedor" },
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        telefone: true,
        cnpj: true,
        status_verificacao: true,
        data_cadastro: true,
        negocios: { select: { id_negocio: true, nome: true } },
      },
      orderBy: [{ status_verificacao: "asc" }, { data_cadastro: "desc" }],
    })

    const [totalUsuarios, totalNegocios, totalAvaliacoes] = await Promise.all([
      prisma.usuario.count(),
      prisma.negocio.count(),
      prisma.avaliacao.count(),
    ])

    return NextResponse.json({
      empreendedores,
      resumo: {
        usuarios: totalUsuarios,
        negocios: totalNegocios,
        avaliacoes: totalAvaliacoes,
        pendentes: empreendedores.filter((e) => e.status_verificacao === "pendente").length,
      },
    })
  } catch (error) {
    console.log("ERRO ADMIN VERIFICACAO:", error)

    return NextResponse.json(
      { error: "Erro ao carregar a fila de verificação" },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const bloqueado = await exigirAdmin()
    if (bloqueado instanceof NextResponse) return bloqueado

    const body = await req.json()
    const { id_usuario, status } = body

    if (!id_usuario || !statusValidos.includes(status)) {
      return NextResponse.json(
        { error: "Envie id_usuario e um status válido." },
        { status: 400 }
      )
    }

    const atualizado = await prisma.usuario.update({
      where: { id_usuario },
      data: { status_verificacao: status },
      select: { id_usuario: true, nome: true, status_verificacao: true },
    })

    return NextResponse.json({ message: "Verificação atualizada", usuario: atualizado })
  } catch (error) {
    console.log("ERRO ADMIN APROVAR:", error)

    return NextResponse.json(
      { error: "Erro ao atualizar a verificação" },
      { status: 500 }
    )
  }
}
