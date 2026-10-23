"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import Navbar from "../../components/Navbar"

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [verSenha, setVerSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  async function entrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCarregando(true)

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          senha,
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        toast.error(dados.error || "Email ou senha incorretos.")
        setCarregando(false)
        return
      }

      localStorage.setItem("usuario", JSON.stringify(dados.usuario))

      toast.success("Login realizado com sucesso!")

      setTimeout(() => {
        if (redirect) {
          window.location.href = redirect
        } else if (dados.usuario.tipo === "empreendedor") {
          window.location.href = "/dashboard"
        } else {
          window.location.href = "/"
        }
      }, 500)
    } catch {
      toast.error("Erro de conexão com o servidor.")
      setCarregando(false)
    }
  }

  function entrarComGoogle() {
    /*
      Este botão já está preparado para o Google.

      Quando criarmos a rota OAuth:
      /api/auth/google

      basta redirecionar para ela.
    */

    window.location.href = "/api/auth/google"
  }

  return (
    <main className="relative flex min-h-screen flex-col text-slate-950 transition-colors dark:text-white">
      <Navbar />

      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-orange-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl" />

      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* CARD DE LOGIN */}
          <div className="future-surface rounded-3xl p-7 sm:p-9">

            {/* TÍTULO */}
            <div className="mb-7 text-center">
              <span className="section-label">● Acesso</span>
              <h1 className="mt-4 text-3xl font-black">Entrar</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Acesse sua conta do Lá da Vendinha
              </p>
            </div>

            {/* GOOGLE */}
            <button
              type="button"
              onClick={entrarComGoogle}
              className="press flex w-full items-center justify-center gap-3 rounded-2xl border border-cyan-900/10 bg-white py-4 font-bold text-slate-800 shadow-sm transition hover:bg-slate-50 dark:border-cyan-300/10 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {/* Ícone Google */}
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.22a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.39Z"
                />
                <path
                  fill="#34A853"
                  d="M12 21.77c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.51A9.74 9.74 0 0 0 12 21.77Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.54 13.89A5.86 5.86 0 0 1 6.23 12c0-.66.11-1.3.31-1.89V7.6H3.3A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.4l3.24-2.51Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 6.08c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.17 14.63 2.23 12 2.23a9.74 9.74 0 0 0-8.7 5.37l3.24 2.51C7.31 7.8 9.46 6.08 12 6.08Z"
                />
              </svg>

              Continuar com Google
            </button>

            {/* DIVISOR */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-cyan-900/10 dark:bg-cyan-300/10" />
              <span className="text-sm font-medium text-slate-400">ou</span>
              <div className="h-px flex-1 bg-cyan-900/10 dark:bg-cyan-300/10" />
            </div>

            {/* FORMULÁRIO */}
            <form onSubmit={entrar} className="space-y-5">

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@email.com"
                  className="min-h-12 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 px-4 py-3.5 font-medium text-slate-900 outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                />
              </div>

              {/* SENHA */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="senha"
                    className="text-sm font-bold text-slate-700 dark:text-slate-200"
                  >
                    Senha
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      toast("A recuperação de senha será adicionada em breve.")
                    }
                    className="link-underline text-sm font-bold text-orange-600 hover:text-orange-700"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="senha"
                    type={verSenha ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    className="min-h-12 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 px-4 py-3.5 pr-20 font-medium text-slate-900 outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() => setVerSenha(!verSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-sm font-bold text-orange-600 hover:text-orange-700"
                  >
                    {verSenha ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              {/* BOTÃO ENTRAR */}
              <button
                type="submit"
                disabled={carregando}
                className="press w-full rounded-2xl bg-orange-600 py-4 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:bg-gray-400"
              >
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>

            {/* CADASTRO */}
            <div className="mt-7 text-center">
              <span className="text-slate-600 dark:text-slate-300">
                Ainda não tem uma conta?
              </span>

              <a
                href="/cadastro"
                className="link-underline ml-2 font-black text-orange-600 hover:text-orange-700"
              >
                Criar conta
              </a>
            </div>
          </div>

          {/* VOLTAR */}
          <a
            href="/"
            className="link-underline mt-6 block text-center text-sm font-bold text-slate-500 hover:text-orange-600 transition"
          >
            ← Voltar para o início
          </a>
        </div>
      </div>
    </main>
  )
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center text-slate-950 dark:text-white">
          <p className="text-gray-500 font-bold">
            Carregando...
          </p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  )
}