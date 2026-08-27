"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import Logo from "../../components/Logo"


export default function Login() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [verSenha, setVerSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()

    setCarregando(true)

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          senha
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        toast.error(dados.error || "Erro ao entrar")
        setCarregando(false)
        return
      }

      localStorage.setItem("usuario", JSON.stringify(dados.usuario))

      toast.success("Login realizado com sucesso!")

      setTimeout(() => {
        if (redirect) {
          window.location.href = redirect
        } else if (dados.usuario.tipo === "admin") {
          window.location.href = "/admin"
        } else if (dados.usuario.tipo === "empreendedor") {
          window.location.href = "/dashboard"
        } else {
          window.location.href = "/"
        }
      }, 700)

    } catch (error) {
      toast.error("Erro de conexão")
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 flex items-center justify-center px-6 py-12">



      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden">

        <div className="hidden lg:flex flex-col justify-center p-14 bg-gradient-to-br from-orange-600 to-orange-400 text-white">

          <div className="bg-white rounded-[30px] p-6 w-fit mb-10">
            <Logo />
          </div>

          <h1 className="text-6xl font-black leading-tight">
            Bem-vindo de volta!
          </h1>

          <p className="text-orange-100 text-xl mt-6 leading-relaxed">
            Acesse sua conta para favoritar negócios, gerenciar seu perfil e acompanhar tudo da sua região.
          </p>

          <div className="grid gap-4 mt-10">
            <div className="bg-white/20 rounded-3xl p-5 font-bold">
              ❤️ Salve seus negócios favoritos
            </div>

            <div className="bg-white/20 rounded-3xl p-5 font-bold">
              🏪 Gerencie seus empreendimentos
            </div>

            <div className="bg-white/20 rounded-3xl p-5 font-bold">
              📍 Descubra o comércio local
            </div>
          </div>

        </div>

        <div className="p-10 lg:p-16">

          <div className="lg:hidden mb-10">
            <Logo />
          </div>

          <h2 className="text-5xl font-black text-gray-900 dark:text-white">
            Entrar
          </h2>

          <p className="text-gray-500 dark:text-gray-300 mt-4">
            Entre com seu email e senha para continuar.
          </p>

          <form onSubmit={entrar} className="mt-10 space-y-6">

            <div>
              <label className="font-black text-gray-800 dark:text-white">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-black text-gray-800 dark:text-white">
                Senha
              </label>

              <div className="relative">
                <input
                  type={verSenha ? "text" : "password"}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 pr-24 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setVerSenha(!verSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 font-black"
                >
                  {verSenha ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button
              disabled={carregando}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-black py-5 rounded-2xl text-xl shadow-xl transition"
            >
              {carregando ? "Entrando..." : "Entrar"}
            </button>

          </form>

          <p className="text-center text-gray-500 dark:text-gray-300 mt-8">
            Ainda não tem conta?
            <a href="/cadastro" className="text-orange-600 font-black ml-2">
              Criar conta
            </a>
          </p>

          <a
            href="/"
            className="block text-center mt-6 text-gray-400 hover:text-orange-600 font-bold"
          >
            Voltar para início
          </a>

        </div>

      </div>

    </main>
  )
}