import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import prisma from "./prisma"

export interface Sessao {
  id_usuario: string
  nome?: string
  email?: string
  tipo?: string
  cnpj?: string | null
  status_verificacao?: string
  foto_perfil?: string | null
}

export function validarCNPJ(cnpj: string): boolean {
  const numeros = cnpj.replace(/\D/g, "")

  if (numeros.length !== 14) return false
  if (/^(\d)\1{13}$/.test(numeros)) return false

  const calcularDigito = (base: string): number => {
    const pesos =
      base.length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    let soma = 0
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * pesos[i]
    }
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  if (calcularDigito(numeros.substring(0, 12)) !== Number(numeros[12])) return false
  if (calcularDigito(numeros.substring(0, 13)) !== Number(numeros[13])) return false

  return true
}

export async function lerSessao(): Promise<Sessao | null> {
  const store = await cookies()
  const raw = store.get("usuario")?.value

  if (!raw) return null

  try {
    const dados = JSON.parse(raw)
    if (dados?.id_usuario) return dados as Sessao
    return null
  } catch {
    return null
  }
}

async function carregarUsuario(): Promise<{ sessao: Sessao; usuario: any } | null> {
  const sessao = await lerSessao()
  if (!sessao) return null

  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: sessao.id_usuario }
  })

  if (!usuario) return null
  return { sessao, usuario }
}

// Retorna null quando a ação é permitida, ou uma NextResponse de erro (401/403/404) quando bloqueada.
// Garante que quem executa a ação é um empreendedor (ou admin) autenticado no banco.
export async function exigirEmpreendedor(idAlvo?: string): Promise<NextResponse | null> {
  const dados = await carregarUsuario()

  if (!dados) {
    return NextResponse.json(
      { error: "Faça login para continuar." },
      { status: 401 }
    )
  }

  const { usuario } = dados

  if (usuario.tipo !== "empreendedor" && usuario.tipo !== "admin") {
    return NextResponse.json(
      { error: "Apenas contas de empreendedor podem realizar esta ação." },
      { status: 403 }
    )
  }

  if (idAlvo && idAlvo !== usuario.id_usuario && usuario.tipo !== "admin") {
    return NextResponse.json(
      { error: "Você não pode gerenciar dados de outro usuário." },
      { status: 403 }
    )
  }

  return null
}

// Retorna null quando o usuário é dono do negócio (ou admin), ou uma NextResponse de erro quando não.
export async function exigirDonoNegocio(id_negocio: string): Promise<NextResponse | null> {
  const dados = await carregarUsuario()

  if (!dados) {
    return NextResponse.json(
      { error: "Faça login para continuar." },
      { status: 401 }
    )
  }

  const { usuario } = dados

  if (usuario.tipo !== "empreendedor" && usuario.tipo !== "admin") {
    return NextResponse.json(
      { error: "Apenas contas de empreendedor podem realizar esta ação." },
      { status: 403 }
    )
  }

  const negocio = await prisma.negocio.findUnique({
    where: { id_negocio }
  })

  if (!negocio) {
    return NextResponse.json(
      { error: "Negócio não encontrado." },
      { status: 404 }
    )
  }

  if (negocio.id_usuario !== usuario.id_usuario && usuario.tipo !== "admin") {
    return NextResponse.json(
      { error: "Você não tem permissão sobre este negócio." },
      { status: 403 }
    )
  }

  return null
}
