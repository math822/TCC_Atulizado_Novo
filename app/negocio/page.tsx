"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function NegociosPage() {
  const [negocios, setNegocios] = useState<any[]>([])
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoMais, setCarregandoMais] = useState(false)
  const [pagina, setPagina] = useState(1)
  const [temMais, setTemMais] = useState(false)

  const POR_PAGINA = 9

  useEffect(() => {
    buscarNegocios(1)
    buscarFavoritos()
  }, [])

  async function buscarNegocios(numeroPagina: number) {
    try {
      if (numeroPagina === 1) setCarregando(true)
      else setCarregandoMais(true)

      const resposta = await fetch(
        `/api/negocios?limite=${POR_PAGINA}&pagina=${numeroPagina}`
      )
      const dados = await resposta.json()

      if (resposta.ok) {
        setNegocios((anterior) =>
          numeroPagina === 1 ? dados : [...anterior, ...dados]
        )
        setPagina(numeroPagina)
        setTemMais(dados.length === POR_PAGINA)
      }
    } catch (error) {
      console.log("Erro ao buscar negócios", error)
    }

    setCarregando(false)
    setCarregandoMais(false)
  }

  async function buscarFavoritos() {
    const usuarioStorage = localStorage.getItem("usuario")

    if (!usuarioStorage) return

    const usuario = JSON.parse(usuarioStorage)

    try {
      const resposta = await fetch(
        `/api/favoritos?id_usuario=${usuario.id_usuario}`
      )

      const dados = await resposta.json()

      if (resposta.ok) {
        setFavoritos(
          dados.map((favorito: any) => favorito.id_negocio)
        )
      }
    } catch (error) {
      console.log("Erro ao buscar favoritos", error)
    }
  }

  async function toggleFavorito(id_negocio: string) {
    const usuarioStorage = localStorage.getItem("usuario")

    if (!usuarioStorage) {
      window.location.href = "/login"
      return
    }

    const usuario = JSON.parse(usuarioStorage)

    try {
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
        setFavoritos((anterior) => [
          ...anterior,
          id_negocio
        ])

        toast.success("Adicionado aos favoritos ❤️")
      } else {
        setFavoritos((anterior) =>
          anterior.filter((id) => id !== id_negocio)
        )

        toast.success("Removido dos favoritos")
      }
    } catch (error) {
      toast.error("Erro de conexão")
    }
  }

  return (
    <main className="text-slate-950 dark:text-white min-h-screen">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-label">Marketplace local</span>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              Negócios cadastrados
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
              Conheça lojas e profissionais da sua região.
            </p>
          </div>

          <Link
            href="/cadastrar-negocio"
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black shadow-lg transition"
          >
            Cadastrar negócio
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
              Nenhum negócio cadastrado ainda
            </h3>

            <p className="text-gray-500 dark:text-gray-300 mt-3">
              Seja o primeiro empreendedor da plataforma.
            </p>

            <Link
              href="/cadastrar-negocio"
              className="mt-6 inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-black"
            >
              Cadastrar meu negócio
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {negocios.map((negocio) => (
            <div
              key={negocio.id_negocio}
              className="future-card flex h-full flex-col overflow-hidden rounded-[30px] transition duration-300 hover:-translate-y-1"
            >

              <div className="relative aspect-[16/10] overflow-hidden">
                {negocio.fotos?.length > 0 ? (
                  <img
                    src={negocio.fotos[0].url}
                    alt={negocio.nome}
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = "/categorias/alimentacao-futuro-v2.png"
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-8xl">
                    🏪
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    toggleFavorito(negocio.id_negocio)
                  }
                  aria-label={favoritos.includes(negocio.id_negocio) ? `Remover ${negocio.nome} dos favoritos` : `Adicionar ${negocio.nome} aos favoritos`}
                  aria-pressed={favoritos.includes(negocio.id_negocio)}
                  className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 text-2xl font-black shadow-xl transition hover:scale-105"
                >
                  {favoritos.includes(negocio.id_negocio)
                    ? "❤️"
                    : "🤍"}
                </button>

                <div className="absolute left-4 bottom-4 bg-white/95 text-orange-600 px-4 py-2 rounded-2xl font-black shadow-lg">
                  ⭐ {negocio.media_avaliacao || "0.0"}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">

                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  {negocio.nome}
                </h3>

                <p className="text-orange-600 font-semibold mt-2">
                  {negocio.categoria?.nome || "Negócio local"} • {negocio.status || "ativo"}
                </p>

                <p className="text-gray-500 dark:text-gray-300 mt-4 line-clamp-3">
                  {negocio.descricao || "Negócio local cadastrado na plataforma."}
                </p>

                {negocio.endereco && (
                  <p className="text-gray-400 dark:text-gray-500 mt-3 text-sm">
                    📍 {negocio.endereco.bairro}, {negocio.endereco.cidade}
                  </p>
                )}

                <Link
                  href={`/negocio/${negocio.id_negocio}`}
                  className="mt-auto flex min-h-12 items-center justify-center rounded-2xl bg-orange-600 px-5 py-3 font-black text-white transition hover:bg-orange-700"
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
              onClick={() => buscarNegocios(pagina + 1)}
              disabled={carregandoMais}
              className="press min-h-12 rounded-2xl border-2 border-orange-600 px-8 font-black text-orange-700 transition hover:bg-orange-50 dark:text-orange-300 dark:hover:bg-slate-800 disabled:opacity-60"
            >
              {carregandoMais ? "Carregando..." : "Carregar mais negócios"}
            </button>
          </div>
        )}

      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[36px] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-6 py-12 text-center text-white shadow-2xl sm:p-14">
          <h2 className="text-3xl font-black sm:text-5xl">
            Divulgue seu negócio hoje mesmo
          </h2>

          <p className="mt-6 text-xl text-orange-100">
            Entre para a plataforma de negócios locais da região.
          </p>

          <Link
            href="/cadastrar-negocio"
            className="mt-10 inline-block bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-lg"
          >
            Cadastrar meu negócio
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}