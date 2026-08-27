"use client"

import { useEffect, useState, use } from "react"
import toast from "react-hot-toast"
import Logo from "../../../components/Logo"

export default function NegocioPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [negocio, setNegocio] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)

  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState("")

  useEffect(() => {
    buscarNegocio()
  }, [id])

  async function buscarNegocio() {
    try {
      const resposta = await fetch(`/api/negocios/${id}`)
      const dados = await resposta.json()

      if (resposta.ok) {
        setNegocio(dados)
      }
    } catch (error) {
      console.log(error)
    }

    setCarregando(false)
  }

  async function enviarAvaliacao(e: React.FormEvent) {
    e.preventDefault()

    const usuarioStorage = localStorage.getItem("usuario")

    if (!usuarioStorage) {
      window.location.href = `/login?redirect=/negocio/${id}`
      return
    }

    const usuario = JSON.parse(usuarioStorage)

    const resposta = await fetch("/api/avaliacoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nota,
        comentario,
        id_usuario: usuario.id_usuario,
        id_negocio: negocio.id_negocio
      })
    })

    const dados = await resposta.json()

    if (resposta.ok) {
      toast.success("Avaliação enviada com sucesso!")
      setComentario("")
      setNota(5)
      window.location.reload()
    } else {
      toast.error(dados.error || "Erro ao avaliar")
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 flex items-center justify-center">
        <h1 className="text-4xl font-black text-orange-600">
          Carregando negócio...
        </h1>
      </main>
    )
  }

  if (!negocio) {
    return (
      <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 flex items-center justify-center">
        <h1 className="text-4xl font-black text-red-600">
          Negócio não encontrado
        </h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950">

      <section className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-8 bg-white w-fit p-4 rounded-3xl shadow-xl">
            <Logo />
          </div>

          <a
            href="/"
            className="inline-block bg-white/20 px-5 py-3 rounded-2xl font-black mb-10 hover:bg-white/30"
          >
            ← Voltar para início
          </a>

          <div className="flex flex-col lg:flex-row gap-10 items-center">

            <div className="w-72 h-72 rounded-[40px] overflow-hidden shadow-2xl bg-white/20">
              {negocio.fotos?.length > 0 ? (
                <img
                  src={negocio.fotos[0].url}
                  alt={negocio.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-9xl">
                  🏪
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="bg-white/20 inline-block px-4 py-2 rounded-2xl font-bold">
                {negocio.status || "ativo"}
              </p>

              <h1 className="text-6xl font-black mt-6">
                {negocio.nome}
              </h1>

              <p className="text-orange-100 text-xl mt-6 max-w-3xl">
                {negocio.descricao || "Negócio local cadastrado na plataforma."}
              </p>

              <div className="flex gap-4 flex-wrap mt-8">
                <div className="bg-white/20 px-5 py-3 rounded-2xl font-bold">
                  ⭐ {negocio.media_avaliacao || "0.0"}
                </div>

                <div className="bg-white/20 px-5 py-3 rounded-2xl font-bold">
                  📞 {negocio.telefone || "Não informado"}
                </div>

                <div className="bg-white/20 px-5 py-3 rounded-2xl font-bold">
                  🕒 {negocio.horario_funcionamento || "Horário não informado"}
                </div>
              </div>

              <div className="flex gap-3 mt-8 flex-wrap">
                <button className="bg-white text-red-500 px-5 py-3 rounded-2xl font-black shadow-lg">
                  ♥ Favoritar
                </button>

                <a
                  href={`tel:${negocio.telefone || ""}`}
                  className="bg-white text-orange-600 px-5 py-3 rounded-2xl font-black shadow-lg"
                >
                  📞 Contatar
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
              <h2 className="text-4xl font-black text-orange-600 mb-6">
                Sobre o negócio
              </h2>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {negocio.descricao || "Nenhuma descrição informada."}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
              <h2 className="text-4xl font-black text-orange-600 mb-6">
                Produtos e serviços
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                {negocio.produtos.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-300">
                    Nenhum produto cadastrado ainda.
                  </p>
                )}

                {negocio.produtos.map((produto: any) => (
                  <div
                    key={produto.id_produto}
                    className="border border-orange-100 dark:border-slate-700 rounded-3xl p-5 hover:shadow-xl transition"
                  >
                    <div className="h-40 rounded-2xl bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-6xl">
                      🛒
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-5">
                      {produto.nome}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-300 mt-3">
                      {produto.descricao || "Sem descrição."}
                    </p>

                    <div className="flex items-center justify-between mt-6">
                      <p className="text-3xl font-black text-orange-600">
                        R$ {produto.preco}
                      </p>

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl font-bold">
                        {produto.status || "disponivel"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-8">

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-black text-orange-600 mb-6">
                Informações
              </h2>

              <div className="space-y-5">
                <div>
                  <p className="text-gray-400 font-bold">
                    Telefone
                  </p>

                  <p className="text-xl font-black text-gray-800 dark:text-white mt-1">
                    {negocio.telefone || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 font-bold">
                    Horário
                  </p>

                  <p className="text-xl font-black text-gray-800 dark:text-white mt-1">
                    {negocio.horario_funcionamento || "Não informado"}
                  </p>
                </div>

                {negocio.endereco && (
                  <div>
                    <p className="text-gray-400 font-bold">
                      Endereço
                    </p>

                    <p className="text-xl font-black text-gray-800 dark:text-white mt-1">
                      {negocio.endereco.rua}, {negocio.endereco.numero}
                      <br />
                      {negocio.endereco.bairro} - {negocio.endereco.cidade}
                      <br />
                      {negocio.endereco.estado} • {negocio.endereco.cep}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-black text-orange-600 mb-6">
                Avaliações
              </h2>

              <form onSubmit={enviarAvaliacao} className="space-y-5 mb-10">
                <div>
                  <label className="font-bold text-gray-700 dark:text-white">
                    Nota
                  </label>

                  <select
                    value={nota}
                    onChange={(e) => setNota(Number(e.target.value))}
                    className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                  >
                    <option value={5}>5 ⭐</option>
                    <option value={4}>4 ⭐</option>
                    <option value={3}>3 ⭐</option>
                    <option value={2}>2 ⭐</option>
                    <option value={1}>1 ⭐</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 dark:text-white">
                    Comentário
                  </label>

                  <textarea
                    required
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Digite sua avaliação..."
                    className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 h-32 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                  />
                </div>

                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl">
                  Enviar avaliação
                </button>
              </form>

              {negocio.avaliacoes.length === 0 && (
                <p className="text-gray-500 dark:text-gray-300">
                  Nenhuma avaliação ainda.
                </p>
              )}

              <div className="space-y-5">
                {negocio.avaliacoes.map((avaliacao: any) => (
                  <div
                    key={avaliacao.id_avaliacao}
                    className="border border-orange-100 dark:border-slate-700 rounded-2xl p-5"
                  >
                    <p className="text-yellow-500 font-black text-xl">
                      ⭐ {avaliacao.nota}
                    </p>

                    <p className="text-gray-600 dark:text-gray-300 mt-3">
                      {avaliacao.comentario}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>
    </main>
  )
}