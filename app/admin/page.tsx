"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const rotulos: Record<string, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  nao_solicitada: "Não solicitada",
}

const cores: Record<string, string> = {
  pendente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  aprovado: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  rejeitado: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  nao_solicitada: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
}

interface Empreendedor {
  id_usuario: string
  nome: string
  email: string
  telefone: string | null
  cnpj: string | null
  status_verificacao: string
  data_cadastro: string
  negocios: { id_negocio: string; nome: string }[]
}

export default function AdminPage() {
  const [empreendedores, setEmpreendedores] = useState<Empreendedor[]>([])
  const [resumo, setResumo] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvandoId, setSalvandoId] = useState<string | null>(null)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    try {
      const resposta = await fetch("/api/admin/verificacao")
      const dados = await resposta.json()

      if (resposta.ok) {
        setEmpreendedores(dados.empreendedores)
        setResumo(dados.resumo)
      } else {
        toast.error(dados.error || "Erro ao carregar")
      }
    } catch {
      toast.error("Erro de conexão")
    }

    setCarregando(false)
  }

  async function definirStatus(id_usuario: string, status: string) {
    setSalvandoId(id_usuario)

    try {
      const resposta = await fetch("/api/admin/verificacao", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario, status }),
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        setEmpreendedores((anterior) =>
          anterior.map((e) =>
            e.id_usuario === id_usuario ? { ...e, status_verificacao: status } : e
          )
        )
        toast.success(
          status === "aprovado" ? "Empreendedor aprovado" : "Verificação atualizada"
        )
      } else {
        toast.error(dados.error || "Erro ao atualizar")
      }
    } catch {
      toast.error("Erro de conexão")
    }

    setSalvandoId(null)
  }

  return (
    <main className="min-h-screen text-slate-950 dark:text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <span className="section-label">Área restrita</span>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
          Administração
        </h1>
        <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
          Verifique os CNPJs dos empreendedores que entraram na plataforma.
        </p>

        {resumo && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Contas", resumo.usuarios],
              ["Negócios", resumo.negocios],
              ["Avaliações", resumo.avaliacoes],
              ["Pendentes", resumo.pendentes],
            ].map(([rotulo, valor]) => (
              <div key={rotulo as string} className="future-surface rounded-3xl px-6 py-5">
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{rotulo}</p>
                <p className="mt-1 text-3xl font-black text-orange-600">{valor}</p>
              </div>
            ))}
          </div>
        )}

        {carregando && (
          <div className="future-surface mt-10 rounded-3xl p-10 text-center">
            <p className="font-black text-orange-600">Carregando fila de verificação...</p>
          </div>
        )}

        {!carregando && empreendedores.length === 0 && (
          <div className="future-surface mt-10 rounded-3xl p-10 text-center">
            <p className="text-xl font-black">Nenhum empreendedor cadastrado ainda.</p>
          </div>
        )}

        <div className="mt-10 space-y-4">
          {empreendedores.map((empreendedor) => (
            <div
              key={empreendedor.id_usuario}
              className="future-surface rounded-3xl p-6 sm:p-7"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black">{empreendedor.nome}</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        cores[empreendedor.status_verificacao] || cores.nao_solicitada
                      }`}
                    >
                      {rotulos[empreendedor.status_verificacao] || empreendedor.status_verificacao}
                    </span>
                  </div>

                  <p className="mt-2 text-slate-600 dark:text-slate-300">
                    {empreendedor.email}
                    {empreendedor.telefone ? ` • ${empreendedor.telefone}` : ""}
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    CNPJ {empreendedor.cnpj || "não informado"} • entrou em{" "}
                    {new Date(empreendedor.data_cadastro).toLocaleDateString("pt-BR")}
                  </p>

                  {empreendedor.negocios.length > 0 && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {empreendedor.negocios.length} negócio(s):{" "}
                      {empreendedor.negocios.map((n) => n.nome).join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-shrink-0 flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => definirStatus(empreendedor.id_usuario, "aprovado")}
                    disabled={salvandoId === empreendedor.id_usuario}
                    className="press min-h-11 rounded-2xl bg-green-600 px-5 font-black text-white transition hover:bg-green-700 disabled:opacity-60"
                  >
                    Aprovar
                  </button>

                  <button
                    type="button"
                    onClick={() => definirStatus(empreendedor.id_usuario, "rejeitado")}
                    disabled={salvandoId === empreendedor.id_usuario}
                    className="press min-h-11 rounded-2xl border-2 border-red-300 px-5 font-black text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 disabled:opacity-60"
                  >
                    Recusar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="press inline-flex min-h-12 items-center rounded-2xl border border-cyan-900/10 px-6 font-black text-slate-800 transition hover:bg-cyan-50 dark:border-cyan-300/10 dark:text-white dark:hover:bg-slate-800"
          >
            ← Voltar para o site
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
