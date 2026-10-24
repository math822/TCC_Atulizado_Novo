"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import CategoryGrid from "../components/CategoryGrid"
import Footer from "../components/Footer"
import Reveal from "../components/Reveal"

export default function Home() {
  const [negocios, setNegocios] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [favoritos, setFavoritos] = useState<string[]>([])

  // Geolocalização: cidade detectada do usuário (para "perto de você")
  const [cidadeUsuario, setCidadeUsuario] = useState<string | null>(null)
  const [geoStatus, setGeoStatus] = useState<"ocioso" | "pedindo" | "ok" | "negado" | "erro">("ocioso")

  useEffect(() => {
    const salva = localStorage.getItem("gd_cidade")
    if (salva) {
      setCidadeUsuario(salva)
      setGeoStatus("ok")
    }
  }, [])

  useEffect(() => {
    buscarNegocios()
    buscarFavoritos()
  }, [busca, cidadeUsuario])

  async function buscarNegocios() {
    try {
      setCarregando(true)

      // Busca com texto: mostra resultados filtrados (ignora recorte regional)
      if (busca.trim()) {
        const resposta = await fetch(
          `/api/negocios?busca=${encodeURIComponent(busca)}&ordenar=avaliacao`
        )
        const dados = await resposta.json()
        setNegocios(resposta.ok && Array.isArray(dados) ? dados : [])
        setCarregando(false)
        return
      }

      // Sem busca: destaques (um por categoria). Região primeiro, geral preenche.
      const geralResposta = await fetch(
        `/api/negocios?ordenar=avaliacao&destaques=true`
      )
      const geral = geralResposta.ok ? await geralResposta.json() : []

      if (!cidadeUsuario) {
        setNegocios(Array.isArray(geral) ? geral : [])
        setCarregando(false)
        return
      }

      const regiaoResposta = await fetch(
        `/api/negocios?ordenar=avaliacao&destaques=true&cidade=${encodeURIComponent(cidadeUsuario)}`
      )
      const regiao = regiaoResposta.ok ? await regiaoResposta.json() : []

      setNegocios(mesclarPorCategoria(regiao, geral))
    } catch (error) {
      setNegocios([])
    }

    setCarregando(false)
  }

  // Junta lista priorizada + lista de backup garantindo 1 por categoria
  function mesclarPorCategoria(prioritaria: any[], backup: any[]) {
    const vistos = new Set<string>()
    const resultado: any[] = []

    for (const item of [...prioritaria, ...backup]) {
      const chave = item.id_categoria || item.id_negocio
      if (vistos.has(chave)) continue
      vistos.add(chave)
      resultado.push(item)
    }

    return resultado
  }

  function ativarLocalizacao() {
    if (!("geolocation" in navigator)) {
      setGeoStatus("erro")
      toast.error("Seu navegador não suporta localização")
      return
    }

    setGeoStatus("pedindo")

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const r = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
          )
          const dados = await r.json()
          const cidade = dados.city || dados.locality || dados.principalSubdivision

          if (cidade) {
            setCidadeUsuario(cidade)
            localStorage.setItem("gd_cidade", cidade)
            setGeoStatus("ok")
            toast.success(`Mostrando negócios de ${cidade}`)
          } else {
            setGeoStatus("erro")
            toast.error("Não foi possível identificar sua cidade")
          }
        } catch {
          setGeoStatus("erro")
          toast.error("Erro ao identificar sua localização")
        }
      },
      () => {
        setGeoStatus("negado")
        toast.error("Permissão de localização negada")
      },
      { timeout: 10000 }
    )
  }

  function limparLocalizacao() {
    setCidadeUsuario(null)
    localStorage.removeItem("gd_cidade")
    setGeoStatus("ocioso")
  }

  async function buscarFavoritos() {
    const salvo = localStorage.getItem("usuario")

    if (!salvo) return

    const usuario = JSON.parse(salvo)

    const resposta = await fetch(
      `/api/favoritos?id_usuario=${usuario.id_usuario}`
    )

    const dados = await resposta.json()

    if (resposta.ok) {
      setFavoritos(dados.map((item: any) => item.id_negocio))
    }
  }

  async function favoritar(id_negocio: string) {
    try {
      const salvo = localStorage.getItem("usuario")

      if (!salvo) {
        window.location.href = "/login"
        return
      }

      const usuario = JSON.parse(salvo)

      const resposta = await fetch("/api/favoritos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          id_negocio
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        toast.error(dados.error || "Erro ao favoritar")
        return
      }

      if (dados.favoritado) {
        setFavoritos((old) => [...old, id_negocio])
        toast.success("Adicionado aos favoritos ❤️")
      } else {
        setFavoritos((old) => old.filter((id) => id !== id_negocio))
        toast.success("Removido dos favoritos")
      }
    } catch (error) {
      toast.error("Erro de conexão")
    }
  }

  return (
    <main className="min-h-screen text-slate-950 transition-colors dark:text-white">
      <Navbar busca={busca} setBusca={setBusca} />

      <Hero busca={busca} setBusca={setBusca} />

      <CategoryGrid />

      <section id="negocios" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">

        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="section-label">Bem avaliados na região</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Destaques perto de você
            </h2>

            <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Um negócio de cada categoria, escolhido pelas melhores avaliações.
            </p>

            {/* Controle de localização */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {geoStatus === "ok" && cidadeUsuario ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-black text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-200">
                  📍 Perto de você: {cidadeUsuario}
                  <button
                    type="button"
                    onClick={limparLocalizacao}
                    className="ml-1 text-cyan-700 underline-offset-2 hover:underline dark:text-cyan-300"
                  >
                    limpar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={ativarLocalizacao}
                  disabled={geoStatus === "pedindo"}
                  className="press inline-flex min-h-10 items-center gap-2 rounded-full border border-cyan-600/40 bg-white px-4 py-2 text-sm font-black text-cyan-800 transition hover:bg-cyan-50 disabled:opacity-60 dark:bg-slate-900 dark:text-cyan-200 dark:hover:bg-slate-800"
                >
                   {geoStatus === "pedindo" ? "Localizando..." : "Usar minha localização"}
                </button>
              )}
            </div>
          </div>

          <Link
            href="/cadastrar-negocio"
            className="hidden min-h-12 items-center rounded-2xl bg-orange-600 px-6 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 md:inline-flex"
          >
            + Cadastrar negócio
          </Link>
        </div>

        {carregando && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl text-center">
            <p className="text-orange-600 font-black">
              Carregando negócios...
            </p>
          </div>
        )}

        {!carregando && negocios.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl text-center">
            <h3 className="text-3xl font-black text-orange-600">
              Nenhum negócio encontrado
            </h3>

            <p className="text-gray-500 dark:text-gray-300 mt-3">
              Tente buscar outro nome, bairro, cidade ou categoria.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {negocios.map((negocio, i) => (
            <Reveal key={negocio.id_negocio} delay={i * 60} variant="scale">
            <div
              className="future-card shine hover-rise group flex h-full flex-col overflow-hidden rounded-[30px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-orange-100 to-cyan-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                {negocio.fotos?.length > 0 ? (
                  <img
                    src={negocio.fotos[0].url}
                    alt={negocio.nome}
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = "/categorias/alimentacao-futuro-v2.png"
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-7xl">
                    🏪
                  </div>
                )}

                <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition" />

                <button
                  type="button"
                  onClick={() => favoritar(negocio.id_negocio)}
                  aria-label={favoritos.includes(negocio.id_negocio) ? `Remover ${negocio.nome} dos favoritos` : `Adicionar ${negocio.nome} aos favoritos`}
                  aria-pressed={favoritos.includes(negocio.id_negocio)}
                  className={`absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-2xl shadow-lg transition hover:scale-105 ${
                    favoritos.includes(negocio.id_negocio)
                      ? "text-red-500"
                      : "text-slate-400"
                  }`}
                >
                  ♥
                </button>

                <div className="absolute left-4 bottom-4 bg-white/95 text-orange-600 px-3.5 py-1.5 rounded-full font-black shadow-lg text-sm">
                  ⭐ {negocio.media_avaliacao || "0.0"}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <span className="inline-block w-fit rounded-full bg-cyan-50 px-3 py-1 text-sm font-black text-cyan-800 dark:bg-cyan-950/30 dark:text-cyan-200">
                  {negocio.categoria?.nome || "Negócio local"}
                </span>

                <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1 mt-3">
                  {negocio.nome}
                </h3>

                <p className="mt-2 line-clamp-2 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {negocio.descricao || "Conheça este negócio local da sua região."}
                </p>

                {negocio.endereco && (
                  <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
                    📍 {negocio.endereco.bairro}, {negocio.endereco.cidade}
                  </p>
                )}

                <Link
                  href={`/negocio/${negocio.id_negocio}`}
                  className="press mt-auto flex min-h-12 items-center justify-center rounded-2xl bg-orange-600 px-5 py-3 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
                >
                  Ver negócio
                </Link>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Seção de benefícios */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="section-label">Pensado para todas as idades</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Simples para usar. Bom para a comunidade.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Conectamos você aos melhores negócios da sua região de forma simples
            e rápida.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icone: "🔎",
              titulo: "Descoberta fácil",
              texto: "Encontre lojas e serviços perto de você em segundos.",
            },
            {
              icone: "⭐",
              titulo: "Avaliações reais",
              texto: "Veja notas e comentários de clientes de verdade.",
            },
            {
              icone: "🏪",
              titulo: "Comércio local",
              texto: "Valorize empreendedores da sua comunidade.",
            },
            {
              icone: "❤️",
              titulo: "Seus favoritos",
              texto: "Salve os negócios que você mais gosta para voltar depois.",
            },
          ].map((b, i) => (
            <Reveal key={b.titulo} delay={i * 90} variant="up">
            <div
              className="future-card hover-rise h-full rounded-3xl p-7"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-3xl">
                {b.icone}
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-5">
                {b.titulo}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {b.texto}
              </p>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Chamada para cadastro */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <Reveal>
        <div className="animate-gradient relative overflow-hidden rounded-[36px] bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 px-6 py-14 text-center shadow-2xl sm:px-8">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <h2 className="relative text-3xl md:text-4xl font-black text-white">
            Tem um negócio local?
          </h2>
          <p className="relative text-orange-50 mt-3 text-lg max-w-xl mx-auto">
            Cadastre-se grátis e seja encontrado por centenas de clientes da sua
            região.
          </p>
          <Link
            href="/cadastrar-negocio"
            className="relative inline-block mt-8 bg-white text-orange-600 px-9 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition"
          >
            Cadastrar meu negócio →
          </Link>
        </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  )
}