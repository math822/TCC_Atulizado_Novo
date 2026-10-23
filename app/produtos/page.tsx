"use client"

import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function ProdutosPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [negocios, setNegocios] = useState<any[]>([])

  const [idNegocio, setIdNegocio] = useState("")
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [status, setStatus] = useState("disponivel")
  const [mensagem, setMensagem] = useState("")

  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario")

    if (!usuarioStorage) {
      window.location.href = "/login?redirect=/produtos"
      return
    }

    const usuarioLogado = JSON.parse(usuarioStorage)
    setUsuario(usuarioLogado)
    buscarNegocios(usuarioLogado.id_usuario)
  }, [])

  async function buscarNegocios(id_usuario: string) {
    const resposta = await fetch("/api/meus-negocios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id_usuario })
    })

    const dados = await resposta.json()

    if (resposta.ok) {
      setNegocios(dados)

      if (dados.length > 0) {
        setIdNegocio(dados[0].id_negocio)
      }
    }
  }

  async function cadastrarProduto(e: React.FormEvent) {
    e.preventDefault()
    setMensagem("")

    const resposta = await fetch("/api/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id_negocio: idNegocio,
        nome,
        descricao,
        preco,
        status
      })
    })

    const dados = await resposta.json()

    if (resposta.ok) {
      setMensagem("Produto cadastrado com sucesso!")
      setNome("")
      setDescricao("")
      setPreco("")
      setStatus("disponivel")
    } else {
      setMensagem(dados.error || "Erro ao cadastrar produto.")
    }
  }

  return (
    <main className="flex min-h-screen flex-col text-slate-950 dark:text-white">
      <Navbar />

      <div className="flex-1 px-4 py-10 sm:px-6">
        <div className="future-card mx-auto max-w-5xl overflow-hidden rounded-[40px]">

          <div className="relative overflow-hidden border-b border-cyan-900/10 px-8 py-12 dark:border-cyan-300/10">
            <div className="future-grid pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute -right-20 -top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative">
              <span className="section-label">● Área do empreendedor</span>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-xl bg-cyan-500/15 px-4 py-2 font-bold text-cyan-700 dark:text-cyan-200">🛒 Produtos</span>
                <span className="rounded-xl bg-cyan-500/15 px-4 py-2 font-bold text-cyan-700 dark:text-cyan-200">🏪 Negócios</span>
                <span className="rounded-xl bg-cyan-500/15 px-4 py-2 font-bold text-cyan-700 dark:text-cyan-200">📈 Visibilidade</span>
              </div>
              <h1 className="mt-5 text-5xl font-black tracking-tight">Produtos e serviços</h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Cadastre produtos para aparecerem na página do seu negócio.
              </p>
            </div>
          </div>

          {negocios.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-3xl font-black text-orange-600">
                Você ainda não tem negócios cadastrados
              </h2>

              <a
                href="/cadastrar-negocio"
                className="press mt-6 inline-block rounded-2xl bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700"
              >
                Cadastrar negócio primeiro
              </a>
            </div>
          ) : (
            <form onSubmit={cadastrarProduto} className="space-y-6 p-8 sm:p-10">

              <div>
                <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                  Escolha o negócio
                </label>

                <select
                  value={idNegocio}
                  onChange={(e) => setIdNegocio(e.target.value)}
                  className="min-h-12 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white"
                >
                  {negocios.map((negocio) => (
                    <option key={negocio.id_negocio} value={negocio.id_negocio}>
                      {negocio.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                  Nome do produto/serviço
                </label>

                <input
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: X-Burguer Especial"
                  className="min-h-12 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                  Descrição
                </label>

                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva o produto..."
                  className="w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white h-32"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                    Preço
                  </label>

                  <input
                    required
                    type="number"
                    step="0.01"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    placeholder="24.90"
                    className="min-h-12 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="min-h-12 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="indisponivel">Indisponível</option>
                  </select>
                </div>
              </div>

              <button className="press w-full rounded-2xl bg-orange-600 py-5 text-xl font-black text-white shadow-xl shadow-orange-600/20 transition hover:bg-orange-700">
                Cadastrar produto
              </button>

              {mensagem && (
                <p className="text-center font-bold text-orange-600">
                  {mensagem}
                </p>
              )}

            </form>
          )}

        </div>
      </div>

      <Footer />
    </main>
  )
}