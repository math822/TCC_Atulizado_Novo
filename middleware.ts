import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(
  request: NextRequest
) {

  const usuario =
    request.cookies.get("usuario")

  const pathname =
    request.nextUrl.pathname

  const rotasProtegidas = [

    "/dashboard",
    "/admin",
    "/produtos",
    "/editar-negocio",
    "/editar-produto"

  ]

  const precisaAuth =
    rotasProtegidas.some((rota) =>
      pathname.startsWith(rota)
    )

  if (precisaAuth && !usuario) {

    return NextResponse.redirect(
      new URL("/login", request.url)
    )

  }

  return NextResponse.next()

}

export const config = {

  matcher: [

    "/dashboard/:path*",
    "/admin/:path*",
    "/produtos/:path*",
    "/editar-negocio/:path*",
    "/editar-produto/:path*"

  ]

}