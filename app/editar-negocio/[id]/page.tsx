"use client"

import { useEffect, useState, use } from "react"

export default function EditarNegocioPage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = use(params)

  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const [telefone, setTelefone] = useState("")
  const [horario, setHorario] = useState("")

  const [rua, setRua] = useState("")
  const [numero, setNumero] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [cep, setCep] = useState("")

  const [imagem, setImagem] = useState<File | null>(null)

  const [mensagem, setMensagem] = useState("")

  useEffect(() => {

    async function buscarNegocio() {

      try {

        const resposta = await fetch(`/api/negocios/${id}`)
        const dados = await resposta.json()

        if (resposta.ok) {

          setNome(dados.nome || "")
          setDescricao(dados.descricao || "")
          setTelefone(dados.telefone || "")
          setHorario(dados.horario_funcionamento || "")

          if (dados.endereco) {

            setRua(dados.endereco.rua || "")
            setNumero(dados.endereco.numero || "")
            setBairro(dados.endereco.bairro || "")
            setCidade(dados.endereco.cidade || "")
            setEstado(dados.endereco.estado || "")
            setCep(dados.endereco.cep || "")

          }

        }

      } catch (error) {

        console.log(error)

      }

      setCarregando(false)

    }

    buscarNegocio()

  }, [id])

  async function salvarAlteracoes(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setSalvando(true)
    setMensagem("")

    let urlImagem = ""

    if (imagem) {

      const formData = new FormData()

      formData.append("arquivo", imagem)

      const upload = await fetch("/api/upload", {

        method: "POST",
        body: formData

      })

      const uploadDados = await upload.json()

      if (upload.ok) {
        urlImagem = uploadDados.url
      }

    }

    const resposta = await fetch(
      `/api/negocios/${id}`,
      {

        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          nome,
          descricao,
          telefone,

          horario_funcionamento: horario,

          rua,
          numero,
          bairro,
          cidade,
          estado,
          cep,

          imagem: urlImagem

        })

      }
    )

    const dados = await resposta.json()

    if (resposta.ok) {

      setMensagem("Negócio atualizado com sucesso!")

    } else {

      setMensagem(
        dados.error || "Erro ao atualizar negócio"
      )

    }

    setSalvando(false)

  }

  if (carregando) {

    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <h1 className="text-4xl font-black text-blue-700">
          Carregando negócio...
        </h1>
      </main>
    )

  }

  return (
    <main className="min-h-screen bg-blue-50 py-20 px-6">

      <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-700 to-cyan-500 p-12 text-white">

          <h1 className="text-5xl font-black">
            Editar negócio
          </h1>

          <p className="mt-4 text-blue-100 text-lg">
            Atualize as informações do seu negócio.
          </p>

        </div>

        <form
          onSubmit={salvarAlteracoes}
          className="p-10 space-y-6"
        >

          <div>

            <label className="font-bold text-gray-700">
              Nova foto do negócio
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImagem(
                  e.target.files?.[0] || null
                )
              }
              className="w-full mt-2 border border-gray-200 rounded-2xl p-4"
            />

          </div>

          <div>

            <label className="font-bold text-gray-700">
              Nome
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

            <input
              value={telefone}
              onChange={(e) =>
                setTelefone(e.target.value)
              }
              placeholder="Telefone"
              className="border border-gray-200 rounded-2xl p-4"
            />

            <input
              value={horario}
              onChange={(e) =>
                setHorario(e.target.value)
              }
              placeholder="Horário"
              className="border border-gray-200 rounded-2xl p-4"
            />

          </div>

          <h2 className="text-3xl font-black text-blue-700">
            Endereço
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <input
              value={rua}
              onChange={(e) =>
                setRua(e.target.value)
              }
              placeholder="Rua"
              className="border border-gray-200 rounded-2xl p-4"
            />

            <input
              value={numero}
              onChange={(e) =>
                setNumero(e.target.value)
              }
              placeholder="Número"
              className="border border-gray-200 rounded-2xl p-4"
            />

            <input
              value={bairro}
              onChange={(e) =>
                setBairro(e.target.value)
              }
              placeholder="Bairro"
              className="border border-gray-200 rounded-2xl p-4"
            />

            <input
              value={cidade}
              onChange={(e) =>
                setCidade(e.target.value)
              }
              placeholder="Cidade"
              className="border border-gray-200 rounded-2xl p-4"
            />

            <input
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value)
              }
              placeholder="Estado"
              className="border border-gray-200 rounded-2xl p-4"
            />

            <input
              value={cep}
              onChange={(e) =>
                setCep(e.target.value)
              }
              placeholder="CEP"
              className="border border-gray-200 rounded-2xl p-4"
            />

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