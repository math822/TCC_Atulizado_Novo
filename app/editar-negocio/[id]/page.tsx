"use client"

import { useEffect, useState, use } from "react"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const campo =
  "w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 min-h-12 font-medium text-slate-900 outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white"

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
      <main className="flex min-h-screen items-center justify-center text-slate-950 dark:text-white">
        <h1 className="text-4xl font-black text-orange-600">
          Carregando negócio...
        </h1>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col text-slate-950 dark:text-white">
      <Navbar />

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6">
        <div className="future-card overflow-hidden rounded-[40px]">

          <div className="relative overflow-hidden border-b border-cyan-900/10 px-10 py-12 dark:border-cyan-300/10">
            <div className="future-grid pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute -right-20 -top-10 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative">
              <span className="section-label">● Editar</span>
              <h1 className="mt-3 text-5xl font-black tracking-tight">Editar negócio</h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Atualize as informações do seu negócio.
              </p>
            </div>
          </div>

          <form onSubmit={salvarAlteracoes} className="space-y-6 p-8 sm:p-10">

            <div>
              <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                Nova foto do negócio
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagem(e.target.files?.[0] || null)}
                className="w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 font-medium dark:border-cyan-300/10 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                Nome
              </label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} className={campo} />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-700 dark:text-slate-200">
                Descrição
              </label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className={`${campo} h-40`} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone" className={campo} />
              <input value={horario} onChange={(e) => setHorario(e.target.value)} placeholder="Horário" className={campo} />
            </div>

            <h2 className="text-3xl font-black text-orange-600">Endereço</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <input value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Rua" className={campo} />
              <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Número" className={campo} />
              <input value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" className={campo} />
              <input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" className={campo} />
              <input value={estado} onChange={(e) => setEstado(e.target.value)} placeholder="Estado" className={campo} />
              <input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="CEP" className={campo} />
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