"use client"

import { useEffect, useState, use } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const campo =
  "w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 min-h-12 font-medium text-slate-900 outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white"

export default function EditarProdutoPage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = use(params)

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [status, setStatus] = useState("disponivel")
  const [imagem, setImagem] = useState("")

  const [mensagem, setMensagem] = useState("")

  useEffect(() => {

    async function buscarProduto() {

      try {

        const resposta = await fetch(
          `/api/produtos/${id}`
        )

        const dados = await resposta.json()

        if (resposta.ok) {

          setNome(dados.nome || "")
          setDescricao(dados.descricao || "")
          setPreco(dados.preco || "")
          setImagem(dados.imagem || "")
          setStatus(
            dados.status || "disponivel"
          )

        }

      } catch (error) {

        console.log(error)

      }

      setCarregando(false)

    }

    buscarProduto()

  }, [id])

  async function salvarProduto(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setSalvando(true)
    setMensagem("")

    const resposta = await fetch(
      `/api/produtos/${id}`,
      {

        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          nome,
          descricao,
          preco,
          status,
          imagem: imagem.trim() || null

        })

      }
    )

    const dados = await resposta.json()

    if (resposta.ok) {

      setMensagem(
        "Produto atualizado com sucesso!"
      )

    } else {

      setMensagem(
        dados.error || "Erro ao atualizar"
      )

    }

    setSalvando(false)

  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center text-slate-950 dark:text-white">
        <h1 className="text-4xl font-black text-orange-600">
          Carregando produto...
        </h1>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col text-slate-950 dark:text-white">
      <Navbar />

      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
        <div className="future-card overflow-hidden rounded-[40px]">

          <div className="relative overflow-hidden border-b border-cyan-900/10 px-10 py-12 dark:border-cyan-300/10">
            <div className="future-grid pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute -right-20 -top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative">
              <span className="section-label">● Editar</span>
              <h1 className="mt-3 text-5xl font-black tracking-tight">Editar produto</h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Atualize as informações do produto.
              </p>
            </div>
          </div>

          <form onSubmit={salvarProduto} className="space-y-6 p-8 sm:p-10">

            <div>
              <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                Nome do produto
              </label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} className={campo} />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                Descrição
              </label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className={`${campo} h-40`} />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                Imagem (URL) <span className="font-normal text-slate-400">— opcional</span>
              </label>
              <input type="url" value={imagem} onChange={(e) => setImagem(e.target.value)} placeholder="https://exemplo.com/foto.jpg" className={campo} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                  Preço
                </label>
                <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} className={campo} />
              </div>

              <div>
                <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                  Status
                </label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className={campo}>
                  <option value="disponivel">Disponível</option>
                  <option value="indisponivel">Indisponível</option>
                </select>
              </div>
            </div>

            <button
              disabled={salvando}
              className="press w-full rounded-2xl bg-orange-600 py-5 text-xl font-black text-white shadow-xl shadow-orange-600/20 transition hover:bg-orange-700 disabled:bg-gray-400"
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>

            {mensagem && (
              <p className="text-center font-bold text-orange-700">{mensagem}</p>
            )}

          </form>
        </div>
      </div>

      <Footer />
    </main>
  )
}