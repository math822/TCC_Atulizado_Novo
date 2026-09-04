import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()

    const cookie = cookieStore.get("google_login_user")

    if (!cookie?.value) {
      console.error("COOKIE GOOGLE NÃO ENCONTRADO")

      return NextResponse.json(
        {
          error: "Sessão do Google não encontrada"
        },
        {
          status: 401
        }
      )
    }

    let usuario

    try {
      usuario = JSON.parse(cookie.value)
    } catch (error) {
      console.error(
        "ERRO AO LER COOKIE GOOGLE:",
        error
      )

      return NextResponse.json(
        {
          error: "Dados da sessão Google inválidos"
        },
        {
          status: 500
        }
      )
    }

    if (!usuario?.id_usuario || !usuario?.email) {
      console.error(
        "USUÁRIO GOOGLE INVÁLIDO:",
        usuario
      )

      return NextResponse.json(
        {
          error: "Usuário Google inválido"
        },
        {
          status: 500
        }
      )
    }

    const resposta = NextResponse.json({
      usuario
    })

    // O cookie é temporário.
    // Depois de recuperar o usuário, apagamos.
    resposta.cookies.set(
      "google_login_user",
      "",
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/"
      }
    )

    return resposta

  } catch (error) {
    console.error(
      "ERRO API GOOGLE SESSION:",
      error
    )

    return NextResponse.json(
      {
        error: "Erro interno ao finalizar login com Google"
      },
      {
        status: 500
      }
    )
  }
}