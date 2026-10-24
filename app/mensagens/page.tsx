"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Reveal from "../../components/Reveal"

interface Conversa {
  id_conversa: string
  assunto: string | null
  negocio: { id_negocio: string; nome: string } | null
  outro: { id_usuario: string; nome: string; foto_perfil: string | null }
  ultima_mensagem: { texto: string; data: string; id_remetente: string } | null
  nao_lidas: number
  atualizado_em: string
}

function formatarData(iso: string) {
  const d = new Date(iso)
  const agora = new Date()
  const mesmoDia = d.toDateString() === agora.toDateString()
  if (mesmoDia) {
    return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
}

export default function MensagensPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [conversas, setConversas] = useState<Conversa[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const salvo = localStorage.getItem("usuario")
    if (!salvo) {
      window.location.href = "/login?redirect=/mensagens"
      return
    }
    const u = JSON.parse(salvo)
    setUsuario(u)

    fetch(`/api/chat/conversas?id_usuario=${u.id_usuario}`)
      .then((r) => r.json())
      .then((dados) => {
        if (Array.isArray(dados)) setConversas(dados)
      })
      .finally(() => setCarregando(false))
  }, [])

  return (
    <main className="min-h-screen text-slate-950 dark:text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-cyan-900/10 px-4 py-10 dark:border-cyan-300/10 sm:px-6 sm:py-14">
        <div className="future-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <span className="section-label">● Central de mensagens</span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
            Suas conversas
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Converse com clientes e empreendedores sobre os negócios da sua região.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {carregando ? (
          <p role="status" className="text-center text-lg font-bold text-slate-500 dark:text-slate-300">
            Carregando conversas...
          </p>
        ) : conversas.length === 0 ? (
          <div className="future-card rounded-3xl p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-100 text-3xl dark:bg-slate-800">
              💬
            </div>
            <h2 className="mt-5 text-2xl font-black">Nenhuma conversa ainda</h2>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
              Abra o perfil de um negócio e clique em <strong>Falar com o vendedor</strong> para começar.
            </p>
            <Link
              href="/negocio"
              className="press mt-6 inline-flex min-h-12 items-center rounded-2xl bg-orange-600 px-6 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
            >
              Explorar negócios
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {conversas.map((c, i) => {
              const minhas = c.ultima_mensagem?.id_remetente === usuario?.id_usuario
              return (
                <Reveal as="li" key={c.id_conversa} delay={i * 60} variant="up">
                  <Link
                    href={`/mensagens/${c.id_conversa}`}
                    className="future-card shine hover-rise flex items-center gap-4 rounded-3xl p-5"
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-cyan-600 text-xl font-black text-white">
                      {c.outro.foto_perfil ? (
                        <img src={c.outro.foto_perfil} alt="" className="h-full w-full object-cover" />
                      ) : (
                        c.outro.nome?.[0]?.toUpperCase() || "?"
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-lg font-black">{c.outro.nome}</p>
                        {c.ultima_mensagem && (
                          <span className="flex-shrink-0 text-sm font-bold text-slate-500 dark:text-slate-400">
                            {formatarData(c.ultima_mensagem.data)}
                          </span>
                        )}
                      </div>
                      {c.negocio && (
                        <p className="truncate text-sm font-bold text-cyan-700 dark:text-cyan-300">
                          {c.negocio.nome}
                        </p>
                      )}
                      <p className="mt-1 truncate text-base text-slate-600 dark:text-slate-300">
                        {c.ultima_mensagem
                          ? `${minhas ? "Você: " : ""}${c.ultima_mensagem.texto}`
                          : "Sem mensagens ainda. Diga olá!"}
                      </p>
                    </div>

                    {c.nao_lidas > 0 && (
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-black text-white">
                        {c.nao_lidas}
                      </span>
                    )}
                  </Link>
                </Reveal>
              )
            })}
          </ul>
        )}
      </section>

      <Footer />
    </main>
  )
}
