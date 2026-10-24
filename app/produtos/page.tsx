"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { confirmar } from "../../components/Confirmar"
import { moedaBR } from "../lib/formatar"

export default function ProdutosPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [negocios, setNegocios] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  // Formulário de cadastro
  const [idNegocio, setIdNegocio] = useState("")
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [status, setStatus] = useState("disponivel")
  const [imagem, setImagem] = useState("")
  const [mensagem, setMensagem] = useState("")

  // Filtros da listagem
  const [filtroNegocio, setFiltroNegocio] = useState("todos")
  const [busca, setBusca] = useState("")

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario })
    })

    const dados = await resposta.json()

    if (resposta.ok) {
      setNegocios(dados)
      if (dados.length > 0) setIdNegocio(dados[0].id_negocio)
    }

    buscarProdutos(id_usuario)
  }

  async function buscarProdutos(id_usuario: string) {
    setCarregando(true)
    try {
      const resposta = await fetch(`/api/produtos?id_usuario=${id_usuario}`)
      const dados = await resposta.json()
      setProdutos(resposta.ok && Array.isArray(dados) ? dados : [])
    } catch {
      setProdutos([])
    }
    setCarregando(false)
  }

  async function cadastrarProduto(e: React.FormEvent) {
    e.preventDefault()
    setMensagem("")

    if (!idNegocio) {
      setMensagem("Escolha um negócio primeiro.")
      return
    }

    const resposta = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_negocio: idNegocio,
        nome,
        descricao,
        preco,
        status,
        imagem: imagem.trim() || null
      })
    })

    const dados = await resposta.json()

    if (resposta.ok) {
      setMensagem("Produto cadastrado com sucesso!")
      setNome("")
      setDescricao("")
      setPreco("")
      setStatus("disponivel")
      setImagem("")
      if (usuario) buscarProdutos(usuario.id_usuario)
    } else {
      setMensagem(dados.error || "Erro ao cadastrar produto.")
    }
  }

  async function apagarProduto(id_produto: string) {
    if (!(await confirmar({ titulo: "Apagar este produto?", texto: "O anúncio sai do ar e não pode ser recuperado.", rotuloConfirmar: "Apagar", perigoso: true }))) return

    const resposta = await fetch(`/api/produtos/${id_produto}`, {
      method: "DELETE"
    })

    if (resposta.ok) {
      setProdutos((old) => old.filter((p) => p.id_produto !== id_produto))
    } else {
      const dados = await resposta.json().catch(() => ({}))
      setMensagem(dados.error || "Erro ao apagar produto.")
    }
  }

  const nomeNegocio = (id: string) =>
    negocios.find((n) => n.id_negocio === id)?.nome || "Negócio"

  const produtosFiltrados = produtos.filter((p) => {
    if (filtroNegocio !== "todos" && p.id_negocio !== filtroNegocio) return false
    if (busca.trim()) {
      const t = busca.toLowerCase()
      return (
        p.nome?.toLowerCase().includes(t) ||
        p.descricao?.toLowerCase().includes(t)
      )
    }
    return true
  })

  const campo =
    "min-h-12 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white"

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
              <h1 className="mt-5 text-5xl font-black tracking-tight">Produtos e serviços</h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Cadastre, edite e gerencie os produtos que aparecem na página dos seus negócios.
              </p>
            </div>
          </div>

          {negocios.length === 0 && !carregando ? (
            <div className="p-10 text-center">
              <h2 className="text-3xl font-black text-orange-600">
                Você ainda não tem negócios cadastrados
              </h2>
              <Link
                href="/cadastrar-negocio"
                className="press mt-6 inline-block rounded-2xl bg-orange-600 px-6 py-3 font-bold text-white transition hover:bg-orange-700"
              >
                Cadastrar negócio primeiro
              </Link>
            </div>
          ) : (
            <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">

              {/* FORMULÁRIO DE CADASTRO */}
              <form onSubmit={cadastrarProduto} className="space-y-5">
                <h2 className="text-2xl font-black">Novo produto</h2>

                <div>
                  <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200" htmlFor="negocio">
                    Negócio
                  </label>
                  <select
                    id="negocio" required value={idNegocio} onChange={(e) => setIdNegocio(e.target.value)} className={campo}>
                    {negocios.map((negocio) => (
                      <option key={negocio.id_negocio} value={negocio.id_negocio}>
                        {negocio.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200" htmlFor="nome-do-produto-servico">
                    Nome do produto/serviço
                  </label>
                  <input
                    id="nome-do-produto-servico"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: X-Burguer Especial"
                    className={campo}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200" htmlFor="descricao">
                    Descrição
                  </label>
                  <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Descreva o produto..."
                    className={`${campo} h-28`}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200" htmlFor="imagem-url-span-classname-font-nor">
                    Imagem (URL) <span className="font-normal text-slate-400">— opcional</span>
                  </label>
                  <input
                    id="imagem-url-span-classname-font-nor"
                    type="url"
                    value={imagem}
                    onChange={(e) => setImagem(e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                    className={campo}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200" htmlFor="preco">
                      Preço
                    </label>
                    <input
                      id="preco"
                      required
                      type="number"
                      step="0.01"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      placeholder="24.90"
                      className={campo}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={campo}>
                      <option value="disponivel">Disponível</option>
                      <option value="indisponivel">Indisponível</option>
                    </select>
                  </div>
                </div>

                <button className="press w-full rounded-2xl bg-orange-600 py-4 text-lg font-black text-white shadow-xl shadow-orange-600/20 transition hover:bg-orange-700">
                  Cadastrar produto
                </button>

                {mensagem && (
                  <p className="text-center font-bold text-orange-600">{mensagem}</p>
                )}
              </form>

              {/* LISTAGEM */}
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-black">
                    Meus produtos{" "}
                    <span className="text-base font-bold text-slate-400">({produtos.length})</span>
                  </h2>
                </div>

                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar produto..."
                    className={`${campo} p-3`}
                  />
                  <select
                    value={filtroNegocio}
                    onChange={(e) => setFiltroNegocio(e.target.value)}
                    className={`${campo} p-3`}
                  >
                    <option value="todos">Todos os negócios</option>
                    {negocios.map((n) => (
                      <option key={n.id_negocio} value={n.id_negocio}>{n.nome}</option>
                    ))}
                  </select>
                </div>

                {carregando ? (
                  <p className="py-10 text-center font-bold text-orange-600">Carregando produtos...</p>
                ) : produtosFiltrados.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-cyan-900/20 p-10 text-center dark:border-cyan-300/20">
                    <p className="text-4xl">🛒</p>
                    <p className="mt-3 font-bold text-slate-500 dark:text-slate-400">
                      {produtos.length === 0
                        ? "Você ainda não cadastrou produtos."
                        : "Nenhum produto com esse filtro."}
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {produtosFiltrados.map((p) => (
                      <li
                        key={p.id_produto}
                        className="flex items-center gap-4 rounded-2xl border border-cyan-900/10 bg-white/70 p-3 dark:border-cyan-300/10 dark:bg-slate-800/60"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-orange-100 to-cyan-100 dark:from-slate-700 dark:to-slate-600">
                          {p.imagem ? (
                            <img
                              src={p.imagem}
                              alt={p.nome}
                              onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.style.display = "none"
                              }}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-2xl">🛒</div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-black">{p.nome}</p>
                          <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                            {nomeNegocio(p.id_negocio)} ·{" "}
                            <span className={p.status === "disponivel" ? "text-green-600 dark:text-green-400" : "text-red-500"}>
                              {p.status === "disponivel" ? "Disponível" : "Indisponível"}
                            </span>
                          </p>
                          <p className="font-black text-orange-600">
                            {moedaBR(p.preco)}
                          </p>
                        </div>

                        <div className="flex flex-shrink-0 flex-col gap-2">
                          <Link
                            href={`/editar-produto/${p.id_produto}`}
                            className="press rounded-xl bg-cyan-600 px-3 py-2 text-center text-sm font-black text-white transition hover:bg-cyan-700"
                          >
                            Editar
                          </Link>
                          <button
                            type="button"
                            onClick={() => apagarProduto(p.id_produto)}
                            className="press rounded-xl bg-red-500 px-3 py-2 text-sm font-black text-white transition hover:bg-red-600"
                          >
                            Apagar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  )
}
