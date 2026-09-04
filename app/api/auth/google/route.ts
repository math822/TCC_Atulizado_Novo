import { NextResponse } from "next/server"
import crypto from "crypto"

export async function GET(req: Request) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID

    if (!clientId) {
      return NextResponse.json(
        {
          error: "GOOGLE_CLIENT_ID não configurado no .env"
        },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(req.url)

    const origem =
      searchParams.get("origem") === "cadastro"
        ? "cadastro"
        : "login"

    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:3000/api/auth/google/callback"

    const state = crypto.randomBytes(32).toString("hex")

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      access_type: "offline",
      prompt: "select_account",
    })

    const googleUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

    const resposta = NextResponse.redirect(googleUrl)

    resposta.cookies.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    })

    resposta.cookies.set("google_oauth_origem", origem, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    })

    return resposta
  } catch (error) {
    console.error("ERRO AO INICIAR GOOGLE:", error)

    return NextResponse.json(
      {
        error: "Não foi possível iniciar o login com Google."
      },
      { status: 500 }
    )
  }
}