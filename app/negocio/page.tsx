"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function NegociosPage() {
  const [negocios, setNegocios] = useState<any[]>([])
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    buscarNegocios()
    buscarFavoritos()
  }, [])

  async function buscarNegocios() {
    try {
      const resposta = await fetch("/api/negocios")
      const dados = await resposta.json()

      if (resposta.ok) {
        setNegocios(dados)
      }
    } catch (error) {
      console.log("Erro ao buscar negócios", error)
    }

    setCarregando(false)
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
    <main className="bg-[#fff7ed] dark:bg-slate-950 min-h-screen">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl text-center">
            <h2 className="text-5xl font-black text-orange-600">
              {negocios.length}
            </h2>

            <p className="text-gray-500 dark:text-gray-300 mt-2">
              Negócios cadastrados
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl text-center">
            <h2 className="text-5xl font-black text-orange-600">
              +12k
            </h2>

            <p className="text-gray-500 dark:text-gray-300 mt-2">
              Usuários ativos
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl text-center">
            <h2 className="text-5xl font-black text-orange-600">
              4.9 ⭐
            </h2>

            <p className="text-gray-500 dark:text-gray-300 mt-2">
              Avaliação média
            </p>
          </div>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-orange-600 font-black">
              Marketplace local
            </p>

            <h2 className="text-4xl font-black text-gray-900 dark:text-white">
              Negócios cadastrados
            </h2>
          </div>

          <a
            href="/cadastrar-negocio"
            className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black shadow-lg transition"
          >
            Cadastrar negócio
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
              Nenhum negócio cadastrado ainda
            </h3>

            <p className="text-gray-500 dark:text-gray-300 mt-3">
              Seja o primeiro empreendedor da plataforma.
            </p>

            <a
              href="/cadastrar-negocio"
              className="mt-6 inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-2xl font-black"
            >
              Cadastrar meu negócio
            </a>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {negocios.map((negocio) => (
            <div
              key={negocio.id_negocio}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >

              <div className="h-52 overflow-hidden relative">
                {negocio.fotos?.length > 0 ? (
                  <img
                    src={negocio.fotos[0].url}
                    alt={negocio.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-8xl">
                    🏪
                  </div>
                )}

                <button
                  onClick={() =>
                    toggleFavorito(negocio.id_negocio)
                  }
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/95 shadow-xl text-3xl font-black flex items-center justify-center transition hover:scale-110"
                >
                  {favoritos.includes(negocio.id_negocio)
                    ? "❤️"
                    : "🤍"}
                </button>

                <div className="absolute left-4 bottom-4 bg-white/95 text-orange-600 px-4 py-2 rounded-2xl font-black shadow-lg">
                  ⭐ {negocio.media_avaliacao || "0.0"}
                </div>
              </div>

              <div className="p-6">

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

                <a
                  href={`/negocio/${negocio.id_negocio}`}
                  className="mt-6 inline-block bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black transition"
                >
                  Ver negócio
                </a>

              </div>

            </div>
          ))}
        </div>

      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-orange-600 to-orange-400 rounded-[40px] p-14 text-white text-center shadow-2xl">
          <h2 className="text-5xl font-black">
            Divulgue seu negócio hoje mesmo
          </h2>

          <p className="mt-6 text-xl text-orange-100">
            Entre para a plataforma de negócios locais da região.
          </p>

          <a
            href="/cadastrar-negocio"
            className="mt-10 inline-block bg-white text-orange-600 px-8 py-4 rounded-2xl font-black text-lg"
          >
            Cadastrar meu negócio
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}