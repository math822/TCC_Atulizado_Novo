"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import CategoryGrid from "../components/CategoryGrid"
import Footer from "../components/Footer"

export default function Home() {
  const [negocios, setNegocios] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [busca, setBusca] = useState("")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("")
  const [favoritos, setFavoritos] = useState<string[]>([])

  useEffect(() => {
    buscarNegocios()
    buscarFavoritos()
  }, [busca, categoriaSelecionada])

  async function buscarNegocios() {
    try {
      setCarregando(true)

      const resposta = await fetch(
        `/api/negocios?busca=${busca}&categoria=${categoriaSelecionada}`
      )

      const dados = await resposta.json()

      if (resposta.ok) {
        setNegocios(dados)
      } else {
        setNegocios([])
      }
    } catch (error) {
      setNegocios([])
    }

    setCarregando(false)
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
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 transition-colors">
      <Navbar busca={busca} setBusca={setBusca} />

      <Hero busca={busca} setBusca={setBusca} />

      <CategoryGrid
        categoriaSelecionada={categoriaSelecionada}
        setCategoriaSelecionada={setCategoriaSelecionada}
      />

      <section id="negocios" className="max-w-7xl mx-auto px-6 py-12">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
              Destaques da região
            </h2>

            <p className="text-gray-500 dark:text-gray-300 mt-2">
              Encontre lojas, serviços e produtos perto de você.
            </p>
          </div>

          <a
            href="/cadastrar-negocio"
            className="hidden md:inline-block bag-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-2xl font-black shadow-lg"
          >
            + Cadastrar
          </a>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {negocios.map((negocio) => (
            <div
              key={negocio.id_negocio}
              className="group bg-white dark:bg-slate-900 rounded-[30px] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              {/* Contêiner ajustado com fundo mesclado */}
              <div className="relative h-48 overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center">
                {negocio.imagem || negocio.fotos?.length > 0 ? (
                  <img
                    src={negocio.imagem || negocio.fotos[0].url}
                    alt={negocio.nome}
                    className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-7xl">
                    🏪
                  </div>
                )}

                <button
                  onClick={() => favoritar(negocio.id_negocio)}
                  className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-white/95 shadow-xl text-4xl font-black flex items-center justify-center transition hover:scale-110 ${
                    favoritos.includes(negocio.id_negocio)
                      ? "text-red-500"
                      : "text-gray-300"
                  }`}
                >
                  ♥
                </button>

                <div className="absolute left-4 bottom-4 bg-white/95 text-orange-600 px-4 py-2 rounded-2xl font-black shadow-lg">
                  ⭐ {negocio.media_avaliacao || "0.0"}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1">
                  {negocio.nome}
                </h3>

                <p className="text-orange-600 font-bold mt-1">
                  {negocio.categoria?.nome || "Negócio local"}
                </p>

                <p className="text-gray-500 dark:text-gray-300 text-sm mt-3 line-clamp-2">
                  {negocio.descricao || "Conheça este negócio local da sua região."}
                </p>

                {negocio.endereco && (
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-3">
                    📍 {negocio.endereco.bairro}, {negocio.endereco.cidade}
                  </p>
                )}

                <a
                  href={`/negocio/${negocio.id_negocio}`}
                  className="mt-5 block text-center bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black transition"
                >
                  Ver negócio
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}