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

          const completar =
            params.get("completar")

          if (completar === "1") {
            window.location.href =
              "/completar-cadastro"
            return
          }

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-slate-950 dark:text-white">
      <div className="future-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="future-surface animate-pop relative w-full max-w-md rounded-[32px] p-10 text-center">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-cyan-600 text-4xl font-black text-white">
          ✓
        </div>

        <h1 className="text-3xl font-black">{mensagem}</h1>

        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
          Aguarde enquanto preparamos sua conta...
        </p>

        <div className="mt-8 flex justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      </div>
    </main>
  )
}