import { NextResponse } from "next/server"

export async function POST() {
  const resposta = NextResponse.json({
    message: "Logout realizado com sucesso"
  })

  resposta.cookies.set("usuario", "", {
    path: "/",
    maxAge: 0
  })

  return resposta
}