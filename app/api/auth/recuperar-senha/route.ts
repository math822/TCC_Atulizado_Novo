import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import prisma from "../../../lib/prisma"

// Recuperação sem e-mail: a conta é reaberta provando dois dados que só o dono sabe
// (email + telefone cadastrado). Não há serviço de SMTP configurado no projeto.
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const email = String(body.email || "").trim().toLowerCase()
    const telefone = String(body.telefone || "").replace(/\D/g, "")
    const novaSenha = String(body.novaSenha || "")

    if (!email || !telefone || !novaSenha) {
      return NextResponse.json(
        { error: "Preencha email, telefone e a nova senha." },
        { status: 400 }
      )
    }

    if (novaSenha.length < 6) {
      return NextResponse.json(
        { error: "A nova senha precisa ter pelo menos 6 caracteres." },
        { status: 400 }
      )
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    })

    const telefoneCadastrado = usuario?.telefone ? usuario.telefone.replace(/\D/g, "") : ""

    // Mesma resposta nos dois casos para não revelar quais e-mails existem na base.
    if (!usuario || !telefoneCadastrado || telefoneCadastrado !== telefone) {
      return NextResponse.json(
        { error: "Email e telefone não conferem com uma conta cadastrada." },
        { status: 401 }
      )
    }

    await prisma.usuario.update({
      where: { id_usuario: usuario.id_usuario },
      data: { senha: await bcrypt.hash(novaSenha, 10) }
    })

    return NextResponse.json({
      message: "Senha redefinida. Faça login com a nova senha."
    })
  } catch (error) {
    console.log("ERRO RECUPERAR SENHA:", error)

    return NextResponse.json(
      { error: "Erro ao redefinir a senha" },
      { status: 500 }
    )
  }
}
