"use client"

import { useEffect, useState } from "react"

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
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-12 text-white">
          <h1 className="text-5xl font-black">
            <div className="flex gap-3 mt-5">
              <span className="bg-white/20 px-4 py-2 rounded-xl font-bold">
                🛒 Produtos
              </span>

              <span className="bg-white/20 px-4 py-2 rounded-xl font-bold">
                🏪 Negócios
              </span>

              <span className="bg-white/20 px-4 py-2 rounded-xl font-bold">
                📈 Visibilidade
              </span>
            </div>
            Produtos e serviços
          </h1>

          <p className="mt-4 text-blue-100 text-lg">
            Cadastre produtos para aparecerem na página do seu negócio.
          </p>
        </div>

        {negocios.length === 0 ? (
          <div className="p-10 text-center">
            <h2 className="text-3xl font-black text-orange-600">
              Você ainda não tem negócios cadastrados
            </h2>

            <a
              href="/cadastrar-negocio"
              className="mt-6 inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-bold"
            >
              Cadastrar negócio primeiro
            </a>
          </div>
        ) : (
          <form onSubmit={cadastrarProduto} className="p-10 space-y-6">

            <div>
              <label className="font-bold text-gray-700">
                Escolha o negócio
              </label>

              <select
                value={idNegocio}
                onChange={(e) => setIdNegocio(e.target.value)}
                className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              >
                {negocios.map((negocio) => (
                  <option key={negocio.id_negocio} value={negocio.id_negocio}>
                    {negocio.nome}
                  </option>
                ))}
              </select>
            </div>
            //focus

            <div>
              <label className="font-bold text-gray-700">
                Nome do produto/serviço
              </label>

              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: X-Burguer Especial"
                className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700">
                Descrição
              </label>

              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o produto..."
                className="w-full mt-2 border border-orange-100 rounded-2xl p-4 h-32 outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="font-bold text-gray-700">
                  Preço
                </label>

                <input
                  required
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="24.90"
                  className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full mt-2 border border-orange-100 rounded-2xl p-4 outline-none focus:border-orange-500"
                >
                  <option value="disponivel">Disponível</option>
                  <option value="indisponivel">Indisponível</option>
                </select>
              </div>
            </div>

            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-5 rounded-2xl text-xl shadow-xl transition">
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
    </main>
  )
}