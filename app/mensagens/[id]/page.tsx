"use client"

import Link from "next/link"
import { useEffect, useRef, useState, use } from "react"
import toast from "react-hot-toast"
import Navbar from "../../../components/Navbar"

interface Mensagem {
  id_mensagem: string
  texto: string
  data: string
  id_remetente: string
}

interface Detalhe {
  id_conversa: string
  assunto: string | null
  negocio: { id_negocio: string; nome: string } | null
  outro: { id_usuario: string; nome: string; foto_perfil: string | null }
  mensagens: Mensagem[]
}

function hora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  })
}

export default function ConversaPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  const [usuario, setUsuario] = useState<any>(null)
  const [detalhe, setDetalhe] = useState<Detalhe | null>(null)
  const [texto, setTexto] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(false)

  const fimRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const salvo = localStorage.getItem("usuario")
    if (!salvo) {
      window.location.href = `/login?redirect=/mensagens/${id}`
      return
    }
    setUsuario(JSON.parse(salvo))
  }, [id])

  async function carregar() {
    if (!usuario) return
    try {
      const r = await fetch(`/api/chat/conversas/${id}?id_usuario=${usuario.id_usuario}`)
      if (!r.ok) {
        setErro(true)
        return
      }
      const dados = await r.json()
      setDetalhe(dados)
    } catch {
      // mantém a última versão em caso de falha momentânea
    }
  }

  // primeira carga + polling leve para simular tempo real
  useEffect(() => {
    if (!usuario) return
    carregar()
    const intervalo = setInterval(carregar, 4000)
    return () => clearInterval(intervalo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario, id])

  // rola para a última mensagem
  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [detalhe?.mensagens.length])

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const conteudo = texto.trim()
    if (!conteudo || !usuario || enviando) return

    setEnviando(true)
    try {
      const r = await fetch(`/api/chat/conversas/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario: usuario.id_usuario, texto: conteudo })
      })
      const dados = await r.json()
      if (r.ok) {
        setTexto("")
        setDetalhe((prev) =>
          prev ? { ...prev, mensagens: [...prev.mensagens, dados] } : prev
        )
      } else {
        toast.error(dados.error || "Erro ao enviar")
      }
    } catch {
      toast.error("Erro ao enviar mensagem")
    }
    setEnviando(false)
  }

  return (
    <main className="flex min-h-screen flex-col text-slate-950 dark:text-white">
      <Navbar />

      <section className="relative flex flex-1 flex-col overflow-hidden">
        <div className="future-grid pointer-events-none absolute inset-0" />

        <div className="relative z-10 border-b border-cyan-900/10 bg-white/80 px-4 py-4 backdrop-blur-xl dark:border-cyan-300/10 dark:bg-slate-950/80 sm:px-6">
          <div className="mx-auto flex max-w-3xl items-center gap-4">
            <Link
              href="/mensagens"
              aria-label="Voltar para as mensagens"
              className="press flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-900/10 bg-white text-lg font-black dark:border-cyan-300/10 dark:bg-slate-900"
            >
              ←
            </Link>

            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-cyan-600 text-lg font-black text-white">
              {detalhe?.outro.foto_perfil ? (
                <img src={detalhe.outro.foto_perfil} alt="" className="h-full w-full object-cover" />
              ) : (
                detalhe?.outro.nome?.[0]?.toUpperCase() || "?"
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-black leading-tight">
                {detalhe?.outro.nome || "Carregando..."}
              </h1>
              {detalhe?.negocio && (
                <Link
                  href={`/negocio/${detalhe.negocio.id_negocio}`}
                  className="link-underline truncate text-sm font-bold text-cyan-700 dark:text-cyan-300"
                >
                  {detalhe.negocio.nome}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
          {erro ? (
            <div className="future-card my-auto rounded-3xl p-10 text-center">
              <h2 className="text-2xl font-black text-red-600">Conversa indisponível</h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
                Não foi possível abrir esta conversa. Ela pode ter sido removida ou você não participa dela.
              </p>
              <Link
                href="/mensagens"
                className="press mt-6 inline-flex min-h-12 items-center rounded-2xl bg-orange-600 px-6 font-black text-white transition hover:bg-orange-700"
              >
                Voltar para mensagens
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto pb-4">
                {detalhe?.mensagens.length === 0 && (
                  <p className="mt-10 text-center text-lg text-slate-500 dark:text-slate-400">
                    Nenhuma mensagem ainda. Envie a primeira! 👋
                  </p>
                )}

                {detalhe?.mensagens.map((m) => {
                  const minha = m.id_remetente === usuario?.id_usuario
                  return (
                    <div key={m.id_mensagem} className={`flex ${minha ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`animate-pop max-w-[78%] rounded-3xl px-5 py-3 shadow-sm ${
                          minha
                            ? "rounded-br-lg bg-orange-600 text-white"
                            : "rounded-bl-lg future-card text-slate-900 dark:text-white"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-base leading-relaxed">{m.texto}</p>
                        <p className={`mt-1 text-right text-xs font-bold ${minha ? "text-orange-100" : "text-slate-400"}`}>
                          {hora(m.data)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={fimRef} />
              </div>

              <form
                onSubmit={enviar}
                className="future-surface sticky bottom-4 mt-4 flex items-end gap-3 rounded-3xl p-3"
              >
                <label htmlFor="msg-texto" className="sr-only">
                  Escreva sua mensagem
                </label>
                <textarea
                  id="msg-texto"
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      enviar(e)
                    }
                  }}
                  rows={1}
                  placeholder="Escreva sua mensagem..."
                  className="max-h-32 min-h-12 flex-1 resize-none rounded-2xl border border-cyan-900/10 bg-white px-4 py-3 text-base font-medium outline-none focus:border-cyan-600 dark:border-cyan-300/10 dark:bg-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={enviando || !texto.trim()}
                  className="press inline-flex min-h-12 items-center rounded-2xl bg-cyan-600 px-6 font-black text-white shadow-lg shadow-cyan-600/20 transition hover:bg-cyan-700 disabled:opacity-50"
                >
                  {enviando ? "..." : "Enviar"}
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
