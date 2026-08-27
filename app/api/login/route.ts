import { NextResponse } from "next/server"
import prisma from "../../lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const usuario =
      await prisma.usuario.findUnique({

        where: {
          email: body.email
        }

      })

    if (!usuario) {

      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )

    }

    const senhaCorreta =
      await bcrypt.compare(
        body.senha,
        usuario.senha
      )

    if (!senhaCorreta) {

      return NextResponse.json(
        { error: "Senha incorreta" },
        { status: 401 }
      )

    }

    const resposta = NextResponse.json({

      message: "Login realizado com sucesso",

      usuario: {

        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo

      }

    })

    resposta.cookies.set(
      "usuario",
      JSON.stringify({

        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo

      }),

      {
        httpOnly: false,
        path: "/"
      }
    )

    return resposta

  } catch (error) {

    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    )

  }

}