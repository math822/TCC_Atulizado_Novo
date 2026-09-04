import { NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import prisma from "../../../../lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    const cookieHeader = req.headers.get("cookie") || ""

    const stateMatch = cookieHeader.match(
      /(?:^|;\s*)google_oauth_state=([^;]+)/
    )

    const origemMatch = cookieHeader.match(
      /(?:^|;\s*)google_oauth_origem=([^;]+)/
    )

    const cookieState = stateMatch
      ? decodeURIComponent(stateMatch[1])
      : null

    const origem =
      origemMatch &&
      decodeURIComponent(origemMatch[1]) === "cadastro"
        ? "cadastro"
        : "login"

    // =====================================================
    // GOOGLE RETORNOU ERRO
    // =====================================================

    if (error) {
      console.error(
        "GOOGLE RETORNOU ERRO:",
        error
      )

      return NextResponse.redirect(
        new URL(
          `/auth/google-success?erro=google`,
          req.url
        )
      )
    }

    // =====================================================
    // CODE NÃO EXISTE
    // =====================================================

    if (!code) {
      console.error(
        "GOOGLE NÃO RETORNOU O CODE"
      )

      return NextResponse.redirect(
        new URL(
          `/auth/google-success?erro=code`,
          req.url
        )
      )
    }

    // =====================================================
    // VALIDAR STATE
    // =====================================================

    if (
      !state ||
      !cookieState ||
      state !== cookieState
    ) {
      console.error(
        "STATE DO GOOGLE INVÁLIDO"
      )

      return NextResponse.redirect(
        new URL(
          `/auth/google-success?erro=state`,
          req.url
        )
      )
    }

    // =====================================================
    // CREDENCIAIS
    // =====================================================

    const clientId =
      process.env.GOOGLE_CLIENT_ID

    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET

    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ||
      "http://localhost:3000/api/auth/google/callback"

    if (!clientId || !clientSecret) {
      console.error(
        "GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não configurado."
      )

      return NextResponse.redirect(
        new URL(
          `/auth/google-success?erro=config`,
          req.url
        )
      )
    }

    // =====================================================
    // TROCAR CODE PELO TOKEN
    // =====================================================

    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code"
        })
      }
    )

    const tokenData =
      await tokenResponse.json()

    if (
      !tokenResponse.ok ||
      !tokenData.access_token
    ) {
      console.error(
        "ERRO AO PEGAR TOKEN DO GOOGLE:",
        tokenData
      )

      return NextResponse.redirect(
        new URL(
          `/auth/google-success?erro=token`,
          req.url
        )
      )
    }

    // =====================================================
    // PEGAR DADOS DO GOOGLE
    // =====================================================

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization:
            `Bearer ${tokenData.access_token}`
        }
      }
    )

    const googleUser =
      await userResponse.json()

    if (
      !userResponse.ok ||
      !googleUser.email
    ) {
      console.error(
        "ERRO AO PEGAR USUÁRIO DO GOOGLE:",
        googleUser
      )

      return NextResponse.redirect(
        new URL(
          `/auth/google-success?erro=user`,
          req.url
        )
      )
    }

    // =====================================================
    // DADOS DO USUÁRIO
    // =====================================================

    const email = String(
      googleUser.email
    )
      .trim()
      .toLowerCase()

    const nome =
      googleUser.name ||
      email.split("@")[0]

    const fotoPerfil =
      googleUser.picture || null

    // =====================================================
    // PROCURAR NO BANCO
    // =====================================================

    let usuario =
      await prisma.usuario.findUnique({
        where: {
          email
        }
      })

    // =====================================================
    // CRIAR SE NÃO EXISTIR
    // =====================================================

    if (!usuario) {
      const senhaAleatoria =
        crypto.randomBytes(32).toString("hex")

      const senhaHash =
        await bcrypt.hash(
          senhaAleatoria,
          10
        )

      usuario =
        await prisma.usuario.create({
          data: {
            nome,
            email,
            senha: senhaHash,
            tipo: "cliente",
            foto_perfil: fotoPerfil
          }
        })

      console.log(
        "USUÁRIO CRIADO PELO GOOGLE:",
        email
      )
    } else {
      // ===================================================
      // ATUALIZAR FOTO SE NECESSÁRIO
      // ===================================================

      if (
        !usuario.foto_perfil &&
        fotoPerfil
      ) {
        usuario =
          await prisma.usuario.update({
            where: {
              id_usuario:
                usuario.id_usuario
            },
            data: {
              foto_perfil:
                fotoPerfil
            }
          })
      }

      console.log(
        "USUÁRIO EXISTENTE:",
        email
      )
    }

    // =====================================================
    // DADOS SEGUROS
    // =====================================================

    const usuarioSeguro = {
      id_usuario:
        usuario.id_usuario,

      nome:
        usuario.nome,

      email:
        usuario.email,

      telefone:
        usuario.telefone,

      tipo:
        usuario.tipo,

      foto_perfil:
        usuario.foto_perfil
    }

    // =====================================================
    // REDIRECIONAR
    // =====================================================

    const resposta =
      NextResponse.redirect(
        new URL(
          `/auth/google-success?origem=${origem}`,
          req.url
        )
      )

    /*
      IMPORTANTE:

      NÃO usamos encodeURIComponent aqui.

      O próprio Next.js cuida da codificação
      do valor do cookie.
    */

    resposta.cookies.set(
      "google_login_user",
      JSON.stringify(usuarioSeguro),
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 300,
        path: "/"
      }
    )

    // =====================================================
    // APAGAR COOKIES TEMPORÁRIOS
    // =====================================================

    resposta.cookies.set(
      "google_oauth_state",
      "",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/"
      }
    )

    resposta.cookies.set(
      "google_oauth_origem",
      "",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/"
      }
    )

    return resposta

  } catch (error) {
    console.error(
      "ERRO GERAL CALLBACK GOOGLE:",
      error
    )

    return NextResponse.redirect(
      new URL(
        `/auth/google-success?erro=server`,
        req.url
      )
    )
  }
}