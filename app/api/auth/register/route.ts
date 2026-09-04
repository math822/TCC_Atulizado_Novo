import { NextResponse } from "next/server"
import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs"

function validarCNPJ(cnpj: string): boolean {
  const numeros = cnpj.replace(/\D/g, "")

  if (numeros.length !== 14) {
    return false
  }

  if (/^(\d)\1{13}$/.test(numeros)) {
    return false
  }

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

  const base12 = numeros.substring(0, 12)
  const primeiroDigito = calcularDigito(base12)

  if (primeiroDigito !== Number(numeros[12])) {
    return false
  }

  const base13 = numeros.substring(0, 13)
  const segundoDigito = calcularDigito(base13)

  if (segundoDigito !== Number(numeros[13])) {
    return false
  }

  return true
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const nome = String(body.nome || "").trim()
    const email = String(body.email || "").trim().toLowerCase()
    const senha = String(body.senha || "")
    const telefone = body.telefone
      ? String(body.telefone).trim()
      : null
    const tipo = body.tipo || "cliente"

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { error: "Preencha todos os campos obrigatórios" },
        { status: 400 }
      )
    }

    if (!["cliente", "empreendedor", "admin"].includes(tipo)) {
      return NextResponse.json(
        { error: "Tipo de usuário inválido" },
        { status: 400 }
      )
    }

    if (tipo === "admin") {
      if (body.adminSecret !== process.env.ADMIN_SECRET) {
        return NextResponse.json(
          { error: "Credencial de administrador inválida" },
          { status: 403 }
        )
      }
    }

    let cnpj: string | null = null

    if (tipo === "empreendedor") {
      if (!body.cnpj) {
        return NextResponse.json(
          { error: "O CNPJ é obrigatório para empreendedores" },
          { status: 400 }
        )
      }

      cnpj = String(body.cnpj).replace(/\D/g, "")

      if (!validarCNPJ(cnpj)) {
        return NextResponse.json(
          { error: "CNPJ inválido" },
          { status: 400 }
        )
      }

      const cnpjExiste = await prisma.usuario.findUnique({
        where: {
          cnpj
        }
      })

      if (cnpjExiste) {
        return NextResponse.json(
          { error: "Este CNPJ já está cadastrado" },
          { status: 400 }
        )
      }
    }

    const usuarioExiste = await prisma.usuario.findUnique({
      where: {
        email
      }
    })

    if (usuarioExiste) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      )
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        telefone,
        tipo,
        cnpj,
        status_verificacao:
          tipo === "empreendedor"
            ? "pendente"
            : "nao_solicitada"
      }
    })

    const usuarioSeguro = {
      id_usuario: usuario.id_usuario,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      tipo: usuario.tipo,
      cnpj: usuario.cnpj,
      status_verificacao: usuario.status_verificacao,
      foto_perfil: usuario.foto_perfil
    }

    return NextResponse.json({
      message:
        tipo === "empreendedor"
          ? "Cadastro realizado. Seu CNPJ está pendente de verificação."
          : "Usuário cadastrado com sucesso",
      usuario: usuarioSeguro
    })
  } catch (error) {
    console.error("ERRO AO CADASTRAR USUÁRIO:", error)

    return NextResponse.json(
      { error: "Erro ao cadastrar usuário" },
      { status: 500 }
    )
  }
}