"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"

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

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      try {
        const [resNegocios, resCategorias] = await Promise.all([
          fetch(`/api/negocios?categoria=${encodeURIComponent(categoria)}`),
          fetch("/api/categorias"),
        ])
        const dadosNegocios = await resNegocios.json()
        const dadosCategorias = await resCategorias.json()
        setNegocios(resNegocios.ok ? dadosNegocios : [])
        setCategorias(resCategorias.ok ? dadosCategorias : [])
      } catch {
        setNegocios([])
      }
      setCarregando(false)
    }
    carregar()
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
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 transition-colors">
      <Navbar busca={busca} setBusca={setBusca} />

      <section className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-block bg-white/20 px-5 py-2.5 rounded-2xl font-bold mb-8 hover:bg-white/30 transition"
          >
            ← Voltar para início
          </Link>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-[32px] bg-white/20 flex items-center justify-center text-6xl shadow-xl">
              {icone}
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black">{categoria}</h1>
              <p className="text-orange-100 text-lg mt-2">
                {infoCategoria?.descricao || "Negócios desta categoria perto de você."}
              </p>
            </div>
          </div>

          <p className="mt-6 text-orange-100 font-bold">
            {carregando
              ? "Carregando..."
              : `${filtrados.length} negócio${filtrados.length === 1 ? "" : "s"} encontrado${filtrados.length === 1 ? "" : "s"}`}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3 mb-10">
          {categorias.map((c) => (
            <Link
              key={c.id_categoria}
              href={`/categorias/${encodeURIComponent(c.nome)}`}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition shadow-sm ${
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtrados.map((negocio) => (
            <div
              key={negocio.id_negocio}
              className="group bg-white dark:bg-slate-900 rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center">
                {negocio.fotos?.length > 0 ? (
                  <img
                    src={negocio.fotos[0].url}
                    alt={negocio.nome}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

              <div className="p-5">
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
                  className="mt-5 block text-center bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black transition"
                >
                  Ver negócio
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
