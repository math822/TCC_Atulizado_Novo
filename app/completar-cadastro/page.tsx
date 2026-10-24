"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Navbar from "../../components/Navbar"

function formatarCNPJ(valor: string) {
  const numeros = valor.replace(/\D/g, "").slice(0, 14)

  if (numeros.length <= 2) return numeros
  if (numeros.length <= 5) return `${numeros.slice(0, 2)}.${numeros.slice(2)}`
  if (numeros.length <= 8)
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`
  if (numeros.length <= 12)
    return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`

  return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12, 14)}`
}

export default function CompletarCadastro() {
  const [cnpj, setCnpj] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    const salvo = localStorage.getItem("usuario")

    if (!salvo) {
      window.location.href = "/login?redirect=/completar-cadastro"
      return
    }

    setPronto(true)
  }, [])

  async function concluir(e: React.FormEvent) {
    e.preventDefault()

    if (cnpj.replace(/\D/g, "").length !== 14) {
      toast.error("Informe um CNPJ válido com 14 dígitos.")
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch("/api/auth/completar-empreendedor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj: cnpj.replace(/\D/g, "") })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        toast.error(dados.error || "Erro ao concluir o cadastro.")
        setCarregando(false)
        return
      }

      if (dados.usuario) {
        localStorage.setItem("usuario", JSON.stringify(dados.usuario))
      }

      toast.success("Cadastro de empreendedor concluído!")

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 900)
    } catch {
      toast.error("Erro de conexão.")
      setCarregando(false)
    }
  }

  if (!pronto) return null

  return (
    <main className="relative flex min-h-screen flex-col text-slate-950 dark:text-white">
      <Navbar />

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="future-surface w-full max-w-xl rounded-[40px] p-10">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-4xl">
            🏪
          </div>

          <span className="section-label">● Último passo</span>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Informe seu CNPJ
          </h1>

          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Conclua seu cadastro de empreendedor. O CNPJ será enviado para verificação da nossa equipe.
          </p>

          <form onSubmit={concluir} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="cnpj"
                className="font-black text-gray-800 dark:text-white"
              >
                CNPJ da empresa
              </label>

              <input
                id="cnpj"
                required
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={18}
                value={cnpj}
                onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
                placeholder="00.000.000/0000-00"
                className="mt-2 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 text-base font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="press w-full rounded-2xl bg-orange-600 py-5 text-xl font-black text-white shadow-xl shadow-orange-600/20 transition hover:bg-orange-700 disabled:bg-gray-400"
            >
              {carregando ? "Enviando..." : "Concluir cadastro"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
