"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

const imagensCategoria: Record<string, string> = {
  Artesanato: "/categorias/artesanato-futuro-v2.png",
  Beleza: "/categorias/beleza-futuro-v2.png",
  Alimentação: "/categorias/alimentacao-futuro-v2.png",
  Informática: "/categorias/informatica-futuro-v2.png",
  Moda: "/categorias/moda-futuro-v2.png",
  Serviços: "/categorias/servicos-futuro-v2.png",
}

export default function CategoriaPage({
  params,
}: {
  params: Promise<{ nome: string }>
}) {
  const { nome } = use(params)
  const categoria = decodeURIComponent(nome)

  const [negocios, setNegocios] = useState<any[]>([])
  const [categorias, setCategorias] = useState<any[]>([])
  const [busca, setBusca] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [carregandoMais, setCarregandoMais] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [temMais, setTemMais] = useState(false)

  const POR_PAGINA = 9

  async function buscarPagina(numero: number) {
    const anexar = numero > 1
    if (anexar) setCarregandoMais(true)
    else setCarregando(true)

    try {
      const [resNegocios, resCategorias] = await Promise.all([
        fetch(
          `/api/negocios?categoria=${encodeURIComponent(categoria)}&limite=${POR_PAGINA}&pagina=${numero}`
        ),
        fetch("/api/categorias"),
      ])

      const dadosNegocios = await resNegocios.json()
      const dadosCategorias = await resCategorias.json()

      if (resNegocios.ok) {
        setNegocios((anterior) =>
          anexar ? [...anterior, ...dadosNegocios] : dadosNegocios
        )
        setPagina(numero)
        setTemMais(dadosNegocios.length === POR_PAGINA)
      } else {
        setNegocios(anterior => anexar ? anterior : [])
      }

      if (resCategorias.ok) setCategorias(dadosCategorias)
    } catch {
      if (!anexar) setNegocios([])
    }

    setCarregando(false)
    setCarregandoMais(false)
  }

  useEffect(() => {
    buscarPagina(1)
  }, [categoria])

  const filtrados = negocios.filter((n) => {
    if (!busca.trim()) return true
    const termo = busca.toLowerCase()
    return (
      n.nome?.toLowerCase().includes(termo) ||
      n.descricao?.toLowerCase().includes(termo)
    )
  })

  const infoCategoria = categorias.find((c) => c.nome === categoria)
  const icone = infoCategoria?.icone || "🏪"

  return (
    <main className="min-h-screen text-slate-950 transition-colors dark:text-white">
      <Navbar busca={busca} setBusca={setBusca} />

      <section className="relative overflow-hidden border-b border-cyan-900/10 px-4 py-10 dark:border-cyan-300/10 sm:px-6 sm:py-16">
        <div className="future-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-7 inline-flex min-h-11 items-center rounded-2xl border border-cyan-900/10 bg-white/80 px-4 font-bold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white dark:border-cyan-300/10 dark:bg-slate-900/80 dark:text-white sm:mb-8 sm:px-5"
          >
            ← Voltar para o início
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[26px] border border-cyan-900/10 bg-white/85 text-5xl shadow-xl backdrop-blur dark:border-cyan-300/10 dark:bg-slate-900/85 sm:h-24 sm:w-24 sm:rounded-[32px] sm:text-6xl">
              {icone}
            </div>
            <div className="min-w-0">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight break-words">{categoria}</h1>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                {infoCategoria?.descricao || "Negócios desta categoria perto de você."}
              </p>
            </div>
          </div>

          <p className="mt-5 font-bold text-cyan-800 dark:text-cyan-200 sm:mt-6">
            {carregando
              ? "Carregando..."
              : `${filtrados.length} negócio${filtrados.length === 1 ? "" : "s"} encontrado${filtrados.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-nowrap sm:flex-wrap gap-3 mb-8 sm:mb-10 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {categorias.map((c) => (
            <Link
              key={c.id_categoria}
              href={`/categorias/${encodeURIComponent(c.nome)}`}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition shadow-sm ${
                c.nome === categoria
                  ? "bg-orange-600 text-white"
                  : "bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-slate-800"
              }`}
            >
              {c.icone} {c.nome}
            </Link>
          ))}
        </div>

        {carregando && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl text-center">
            <p className="text-orange-600 font-black">Carregando negócios...</p>
          </div>
        )}

        {!carregando && filtrados.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-xl text-center">
            <div className="text-6xl mb-4">{icone}</div>
            <h3 className="text-3xl font-black text-orange-600">
              Nenhum negócio nesta categoria ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-300 mt-3">
              Seja o primeiro a cadastrar um negócio em {categoria}.
            </p>
            <Link
              href="/cadastrar-negocio"
              className="inline-block mt-6 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg transition"
            >
              + Cadastrar negócio
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 lg:gap-6">
          {filtrados.map((negocio) => (
            <div
              key={negocio.id_negocio}
              className="future-card group flex h-full flex-col overflow-hidden rounded-[26px] transition duration-300 hover:-translate-y-1 sm:rounded-[30px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-orange-100 dark:bg-slate-800 flex items-center justify-center">
                {negocio.fotos?.length > 0 ? (
                  <img
                    src={negocio.fotos[0].url}
                    alt={negocio.nome}
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = imagensCategoria[categoria] || "/categorias/alimentacao-futuro-v2.png"
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-7xl">
                    {icone}
                  </div>
                )}
                <div className="absolute left-4 bottom-4 bg-white/95 text-orange-600 px-4 py-2 rounded-2xl font-black shadow-lg">
                  ⭐ {negocio.media_avaliacao || "0.0"}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1">
                  {negocio.nome}
                </h3>
                <p className="text-gray-500 dark:text-gray-300 text-sm mt-3 line-clamp-2">
                  {negocio.descricao || "Conheça este negócio local da sua região."}
                </p>
                {negocio.endereco && (
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-3">
                    📍 {negocio.endereco.bairro}, {negocio.endereco.cidade}
                  </p>
                )}
                <Link
                  href={`/negocio/${negocio.id_negocio}`}
                  className="mt-auto block text-center bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black transition shadow-md hover:shadow-lg"
                >
                  Ver negócio
                </Link>
              </div>
            </div>
          ))}
        </div>

        {temMais && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => buscarPagina(pagina + 1)}
              disabled={carregandoMais}
              className="press min-h-12 rounded-2xl border-2 border-orange-600 px-8 font-black text-orange-700 transition hover:bg-orange-50 dark:text-orange-300 dark:hover:bg-slate-800 disabled:opacity-60"
            >
              {carregandoMais ? "Carregando..." : "Carregar mais negócios"}
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
