"use client"

import { useEffect, useState, use } from "react"

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
          status

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
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">

        <h1 className="text-4xl font-black text-blue-700">
          Carregando produto...
        </h1>

      </main>
    )

  }

  return (
    <main className="min-h-screen bg-blue-50 py-20 px-6">

      <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-700 to-cyan-500 p-12 text-white">

          <h1 className="text-5xl font-black">
            Editar produto
          </h1>

          <p className="mt-4 text-blue-100 text-lg">
            Atualize as informações do produto.
          </p>

        </div>

        <form
          onSubmit={salvarProduto}
          className="p-10 space-y-6"
        >

          <div>

            <label className="font-bold text-gray-700">
              Nome do produto
            </label>

            <input
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              className="w-full mt-2 border border-gray-200 rounded-2xl p-4"
            />

          </div>

          <div>

            <label className="font-bold text-gray-700">
              Descrição
            </label>

            <textarea
              value={descricao}
              onChange={(e) =>
                setDescricao(e.target.value)
              }
              className="w-full mt-2 border border-gray-200 rounded-2xl p-4 h-40"
            />

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <div>

              <label className="font-bold text-gray-700">
                Preço
              </label>

              <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) =>
                  setPreco(e.target.value)
                }
                className="w-full mt-2 border border-gray-200 rounded-2xl p-4"
              />

            </div>

            <div>

              <label className="font-bold text-gray-700">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full mt-2 border border-gray-200 rounded-2xl p-4"
              >

                <option value="disponivel">
                  Disponível
                </option>

                <option value="indisponivel">
                  Indisponível
                </option>

              </select>

            </div>

          </div>

          <button
            disabled={salvando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl text-xl shadow-xl"
          >

            {salvando
              ? "Salvando..."
              : "Salvar alterações"}

          </button>

          {mensagem && (

            <p className="text-center font-bold text-blue-700">
              {mensagem}
            </p>

          )}

        </form>

      </div>

    </main>
  )
}