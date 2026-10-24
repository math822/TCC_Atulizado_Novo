"use client"

import Link from "next/link"
import { useState } from "react"

const campo =
  "min-h-12 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 px-4 py-3.5 font-medium text-slate-900 outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"

const rotulo = "mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")

  async function redefinir(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setMensagem("")
    setErro("")

    try {
      const resposta = await fetch("/api/auth/recuperar-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, telefone, novaSenha })
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        setMensagem(dados.message)
      } else {
        setErro(dados.error || "Erro ao redefinir a senha.")
      }
    } catch {
      setErro("Erro de conexão. Tente novamente.")
    }

    setCarregando(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 via-white to-cyan-50 px-4 py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md rounded-[32px] border border-cyan-900/10 bg-white p-8 shadow-2xl dark:border-cyan-300/10 dark:bg-slate-900 sm:p-10">
        <div className="text-5xl">🔑</div>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
          Recuperar senha
        </h1>

        <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">
          Confirme o email e o telefone da sua conta para definir uma senha nova.
        </p>

        <form onSubmit={redefinir} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className={rotulo}>Email</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@email.com"
              className={campo}
            />
          </div>

          <div>
            <label htmlFor="telefone" className={rotulo}>Telefone cadastrado</label>
            <input
              id="telefone"
              type="tel"
              required
              autoComplete="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(19) 99999-9999"
              className={campo}
            />
          </div>

          <div>
            <label htmlFor="novaSenha" className={rotulo}>Nova senha</label>
            <input
              id="novaSenha"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              className={campo}
            />
          </div>

          {erro && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {erro}
            </p>
          )}

          {mensagem && (
            <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-bold text-green-700 dark:bg-green-950/40 dark:text-green-300">
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="press min-h-12 w-full rounded-2xl bg-orange-600 px-5 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:opacity-60"
          >
            {carregando ? "Salvando..." : "Redefinir senha"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Lembrou a senha?{" "}
          <Link href="/login" className="font-black text-cyan-700 hover:underline dark:text-cyan-300">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
