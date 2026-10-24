"use client"

import Link from "next/link"
import { useEffect, useState, use } from "react"
import toast from "react-hot-toast"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import { moedaBR } from "../../lib/formatar"

export default function NegocioPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [negocio, setNegocio] = useState<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [usuario, setUsuario] = useState<any>(null)
  const [abrindoChat, setAbrindoChat] = useState(false)
  const [favorito, setFavorito] = useState(false)

  const [nota, setNota] = useState(5)
  const [comentario, setComentario] = useState("")

  useEffect(() => {
    buscarNegocio()
  }, [id])

  useEffect(() => {
    const salvo = localStorage.getItem("usuario")
    if (salvo) {
      try {
        setUsuario(JSON.parse(salvo))
      } catch {
        localStorage.removeItem("usuario")
      }
    }
  }, [])

  // Marca o coração conforme a lista de favoritos de quem está logado.
  useEffect(() => {
    if (!usuario?.id_usuario || !negocio?.id_negocio) return

    fetch(`/api/favoritos?id_usuario=${usuario.id_usuario}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((dados) => {
        if (Array.isArray(dados)) {
          setFavorito(dados.some((f: any) => f.id_negocio === negocio.id_negocio))
        }
      })
      .catch(() => {})
  }, [usuario, negocio?.id_negocio])

  async function toggleFavorito() {
    if (!usuario?.id_usuario) {
      window.location.href = `/login?redirect=/negocio/${id}`
      return
    }

    try {
      const resposta = await fetch("/api/favoritos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          id_negocio: negocio.id_negocio
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        toast.error(dados.error || "Erro ao favoritar")
        return
      }

      setFavorito(Boolean(dados.favoritado))
      toast.success(dados.favoritado ? "Adicionado aos favoritos ❤️" : "Removido dos favoritos")
    } catch {
      toast.error("Erro de conexão")
    }
  }

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

  async function falarComVendedor() {
    if (!usuario) {
      window.location.href = `/login?redirect=/negocio/${id}`
      return
    }

    setAbrindoChat(true)
    try {
      const resposta = await fetch("/api/chat/conversas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          id_negocio: negocio.id_negocio
        })
      })
      const dados = await resposta.json()
      if (resposta.ok && dados.id_conversa) {
        window.location.href = `/mensagens/${dados.id_conversa}`
      } else {
        toast.error(dados.error || "Não foi possível abrir o chat")
        setAbrindoChat(false)
      }
    } catch {
      toast.error("Erro ao abrir o chat")
      setAbrindoChat(false)
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen text-slate-950 dark:text-white flex items-center justify-center">
        <h1 className="text-4xl font-black text-orange-600">
          Carregando negócio...
        </h1>
      </main>
    )
  }

  if (!negocio) {
    return (
      <main className="min-h-screen text-slate-950 dark:text-white flex items-center justify-center">
        <h1 className="text-4xl font-black text-red-600">
          Negócio não encontrado
        </h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen text-slate-950 dark:text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-cyan-900/10 px-4 py-10 dark:border-cyan-300/10 sm:px-6 sm:py-14">
        <div className="future-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/negocio"
            className="mb-8 inline-flex min-h-11 items-center rounded-2xl border border-cyan-900/10 bg-white/80 px-5 font-bold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white dark:border-cyan-300/10 dark:bg-slate-900/80 dark:text-white"
          >
            ← Voltar para negócios
          </Link>

          <div className="grid items-center gap-8 lg:grid-cols-[360px_1fr] lg:gap-12">
            <div className="future-surface overflow-hidden rounded-[34px] p-2">
              {negocio.fotos?.length > 0 ? (
                <img
                  src={negocio.fotos[0].url}
                  alt={negocio.nome}
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = "/categorias/alimentacao-futuro-v2.png"
                  }}
                  className="aspect-[4/3] w-full rounded-[28px] object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[28px] bg-gradient-to-br from-orange-200 to-cyan-100 text-8xl dark:from-slate-800 dark:to-slate-700">
                  🏪
                </div>
              )}
            </div>

            <div>
              <span className="section-label">● {negocio.status || "ativo"}</span>
              <h1 className="mt-5 break-words text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {negocio.nome}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
                {negocio.descricao || "Negócio local cadastrado na plataforma."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="future-surface rounded-2xl px-5 py-3 font-bold">⭐ {negocio.media_avaliacao || "0.0"}</div>
                <div className="future-surface rounded-2xl px-5 py-3 font-bold">📞 {negocio.telefone || "Não informado"}</div>
                <div className="future-surface rounded-2xl px-5 py-3 font-bold">🕒 {negocio.horario_funcionamento || "Horário não informado"}</div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={toggleFavorito}
                  aria-pressed={favorito}
                  aria-label={favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  className="press min-h-12 rounded-2xl border-2 border-red-200 bg-white px-6 font-black text-red-600 shadow-sm transition hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-900 dark:hover:bg-red-950/30"
                >
                  {favorito ? "♥ Favoritado" : "♡ Favoritar"}
                </button>

                {usuario?.id_usuario === negocio.id_usuario && (
                  <Link
                    href={`/editar-negocio/${negocio.id_negocio}`}
                    className="press inline-flex min-h-12 items-center rounded-2xl border-2 border-cyan-600/40 px-6 font-black text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-200 dark:hover:bg-slate-800"
                  >
                    ✏️ Editar negócio
                  </Link>
                )}

                {usuario?.id_usuario !== negocio.id_usuario && (
                  <button
                    type="button"
                    onClick={falarComVendedor}
                    disabled={abrindoChat}
                    className="press inline-flex min-h-12 items-center rounded-2xl bg-cyan-600 px-6 font-black text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700 disabled:opacity-60"
                  >
                    {abrindoChat ? "Abrindo chat..." : "💬 Falar com o vendedor"}
                  </button>
                )}

                <a
                  href={`tel:${negocio.telefone || ""}`}
                  className="press inline-flex min-h-12 items-center rounded-2xl bg-orange-600 px-6 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
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

            <div className="future-card rounded-3xl p-6 sm:p-8">
              <h2 className="text-4xl font-black text-orange-600 mb-6">
                Sobre o negócio
              </h2>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {negocio.descricao || "Nenhuma descrição informada."}
              </p>
            </div>

            <div className="future-card rounded-3xl p-6 sm:p-8">
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
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-cyan-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          onError={(event) => {
                            event.currentTarget.onerror = null
                            event.currentTarget.style.display = "none"
                          }}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">🛒</span>
                      )}
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-5">
                      {produto.nome}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-300 mt-3">
                      {produto.descricao || "Sem descrição."}
                    </p>

                    <div className="flex items-center justify-between mt-6">
                      <p className="text-3xl font-black text-orange-600">
                        {moedaBR(produto.preco)}
                      </p>

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl font-bold capitalize">
                        {produto.status || "disponivel"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-8">

            <div className="future-card rounded-3xl p-6 sm:p-8">
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

            <div className="future-card rounded-3xl p-6 sm:p-8">
              <h2 className="text-3xl font-black text-orange-600 mb-6">
                Avaliações
              </h2>

              <form onSubmit={enviarAvaliacao} className="space-y-5 mb-10">
                <div>
                  <label className="font-bold text-gray-700 dark:text-white" htmlFor="nota">
                    Nota
                  </label>
                    <select
                      id="nota"
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
                  <label className="font-bold text-gray-700 dark:text-white" htmlFor="comentario">
                    Comentário
                  </label>
                    <textarea
                      id="comentario"
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
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-600 text-sm font-black text-white">
                        {avaliacao.usuario?.foto_perfil ? (
                          <img
                            src={avaliacao.usuario.foto_perfil}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (avaliacao.usuario?.nome?.[0] || "?").toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-black text-slate-900 dark:text-white">
                          {avaliacao.usuario?.nome || "Avaliação sem identificação"}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
                        </p>
                      </div>

                      <p className="flex-shrink-0 text-xl font-black text-yellow-500">
                        ⭐ {avaliacao.nota}
                      </p>
                    </div>

                    <p className="mt-3 text-gray-600 dark:text-gray-300">
                      {avaliacao.comentario || "Sem comentário"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}