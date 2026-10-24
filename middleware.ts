import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

interface Sessao {
  id_usuario?: string
  tipo?: string
}

function lerSessao(request: NextRequest): Sessao | null {
  const cookie = request.cookies.get("usuario")

  if (!cookie?.value) return null

  try {
    return JSON.parse(cookie.value)
  } catch {
    return null
  }
}

// Rotas que pertencem à área do empreendedor (também liberadas para admin)
const rotasEmpreendedor = [
  "/dashboard",
  "/cadastrar-negocio",
  "/produtos",
  "/editar-negocio",
  "/editar-produto",
  "/completar-cadastro"
]

// Rotas que qualquer conta logada pode acessar
const rotasLogados = [
  "/mensagens",
  "/perfil"
]

const rotaAdmin = "/admin"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const sessao = lerSessao(request)
  const logado = Boolean(sessao?.id_usuario)
  const tipo = sessao?.tipo

  const ehEmpreendedor = tipo === "empreendedor" || tipo === "admin"
  const ehAdmin = tipo === "admin"

  const precisaEmpreendedor = rotasEmpreendedor.some((rota) =>
    pathname.startsWith(rota)
  )
  const precisaLogado = rotasLogados.some((rota) =>
    pathname.startsWith(rota)
  )
  const precisaAdmin = pathname.startsWith(rotaAdmin)

  // Sem sessão: manda para o login preservando o destino
  if ((precisaEmpreendedor || precisaLogado || precisaAdmin) && !logado) {
    const destino = new URL("/login", request.url)
    destino.searchParams.set("redirect", pathname)
    return NextResponse.redirect(destino)
  }

  // Logado, mas sem o papel necessário: volta para a home com aviso
  if (logado) {
    const semPermissao =
      (precisaEmpreendedor && !ehEmpreendedor) ||
      (precisaAdmin && !ehAdmin)

    if (semPermissao) {
      const destino = new URL("/", request.url)
      destino.searchParams.set("acesso", "negado")
      return NextResponse.redirect(destino)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cadastrar-negocio/:path*",
    "/produtos/:path*",
    "/editar-negocio/:path*",
    "/editar-produto/:path*",
    "/completar-cadastro/:path*",
    "/mensagens/:path*",
    "/perfil/:path*",
    "/admin/:path*"
  ]
}
