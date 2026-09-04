"use client"

import { useEffect, useState } from "react"

export default function GoogleSuccess() {
  const [mensagem, setMensagem] = useState(
    "Finalizando seu acesso..."
  )

  useEffect(() => {
    async function finalizarLogin() {
      try {
        const params = new URLSearchParams(
          window.location.search
        )

        const erro = params.get("erro")

        if (erro) {
          console.error(
            "ERRO GOOGLE:",
            erro
          )

          setMensagem(
            "Não foi possível entrar com o Google."
          )

          setTimeout(() => {
            window.location.href =
              "/login?google=erro"
          }, 2500)

          return
        }

        const resposta = await fetch(
          "/api/auth/google/session",
          {
            method: "GET",
            cache: "no-store"
          }
        )

        const dados = await resposta.json()

        if (!resposta.ok || !dados.usuario) {
          throw new Error(
            "Usuário Google não encontrado"
          )
        }

        // Salva o usuário da mesma forma que
        // o login tradicional já faz.
        localStorage.setItem(
          "usuario",
          JSON.stringify(dados.usuario)
        )

        setMensagem(
          "Login realizado com sucesso!"
        )

        setTimeout(() => {
          const origem =
            params.get("origem")

          if (
            dados.usuario.tipo ===
            "empreendedor"
          ) {
            window.location.href =
              "/dashboard"
            return
          }

          if (origem === "cadastro") {
            window.location.href = "/"
            return
          }

          window.location.href = "/"
        }, 800)
      } catch (error) {
        console.error(
          "ERRO AO FINALIZAR LOGIN GOOGLE:",
          error
        )

        setMensagem(
          "Não foi possível finalizar o login."
        )

        setTimeout(() => {
          window.location.href =
            "/login?google=erro"
        }, 2500)
      }
    }

    finalizarLogin()
  }, [])

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-slate-900 rounded-[32px] shadow-2xl p-10 text-center">

        <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
          <span className="text-4xl">
            ✓
          </span>
        </div>

        <h1 className="text-3xl font-black text-white">
          {mensagem}
        </h1>

        <p className="text-gray-400 mt-4">
          Aguarde enquanto preparamos sua conta...
        </p>

        <div className="mt-8 flex justify-center">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>

      </div>
    </main>
  )
}