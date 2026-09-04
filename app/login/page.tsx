"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import Logo from "../../components/Logo"

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
    <main className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* CARD DE LOGIN */}
        <div className="bg-white rounded-3xl shadow-xl p-7 sm:p-9">

          {/* TÍTULO */}
          <div className="text-center mb-7">
            <h1 className="text-3xl font-black text-gray-900">
              Entrar
            </h1>

            <p className="text-gray-500 mt-2">
              Acesse sua conta do Lá da Vendinha
            </p>
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            onClick={entrarComGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 rounded-xl transition shadow-sm"
          >
            {/* Ícone Google */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
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
          <div className="flex items-center gap-4 my-7">
            <div className="h-px bg-gray-200 flex-1" />

            <span className="text-sm text-gray-400 font-medium">
              ou
            </span>

            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={entrar} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700 mb-2"
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
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3.5 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {/* SENHA */}
            <div>
              <div className="flex items-center justify-between mb-2">

                <label
                  htmlFor="senha"
                  className="text-sm font-bold text-gray-700"
                >
                  Senha
                </label>

                <button
                  type="button"
                  onClick={() =>
                    toast("A recuperação de senha será adicionada em breve.")
                  }
                  className="text-sm font-bold text-orange-600 hover:text-orange-700"
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
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3.5 pr-20 text-gray-900 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-black py-4 rounded-xl transition shadow-lg shadow-orange-200"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

          </form>

          {/* CADASTRO */}
          <div className="text-center mt-7">

            <span className="text-gray-500">
              Ainda não tem uma conta?
            </span>

            <a
              href="/cadastro"
              className="ml-2 font-black text-orange-600 hover:text-orange-700"
            >
              Criar conta
            </a>

          </div>

        </div>

        {/* VOLTAR */}
        <a
          href="/"
          className="block text-center mt-6 text-sm font-bold text-gray-500 hover:text-orange-600 transition"
        >
          ← Voltar para o início
        </a>

      </div>
    </main>
  )
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-orange-50 flex items-center justify-center">
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