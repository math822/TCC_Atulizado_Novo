"use client"

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

  useEffect(() => {
    buscarNegocios()
    buscarFavoritos()
  }, [busca])

  async function buscarNegocios() {
    try {
      setCarregando(true)

      const resposta = await fetch(
        `/api/negocios?busca=${encodeURIComponent(busca)}&ordenar=avaliacao&destaques=true`
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

      <CategoryGrid />

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
            className="hidden md:inline-block bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-6 py-4 rounded-2xl font-black shadow-soft transition hover:-translate-y-0.5"
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
          {negocios.map((negocio, i) => (
            <Reveal key={negocio.id_negocio} delay={i * 60}>
            <div
              className="lift group h-full bg-white dark:bg-slate-900 rounded-[30px] overflow-hidden shadow-card hover:shadow-2xl transition duration-300 border border-orange-50 dark:border-slate-800"
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                {negocio.imagem || negocio.fotos?.length > 0 ? (
                  <img
                    src={negocio.imagem || negocio.fotos[0].url}
                    alt={negocio.nome}
                    onError={(event) => {
                      event.currentTarget.onerror = null
                      event.currentTarget.src = "/categorias/Comida.png"
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
                  onClick={() => favoritar(negocio.id_negocio)}
                  className={`absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 shadow-lg text-2xl flex items-center justify-center transition hover:scale-110 ${
                    favoritos.includes(negocio.id_negocio)
                      ? "text-red-500"
                      : "text-gray-300"
                  }`}
                >
                  ♥
                </button>

                <div className="absolute left-4 bottom-4 bg-white/95 text-orange-600 px-3.5 py-1.5 rounded-full font-black shadow-lg text-sm">
                  ⭐ {negocio.media_avaliacao || "0.0"}
                </div>
              </div>

              <div className="p-5">
                <span className="inline-block bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-400 text-xs font-black px-3 py-1 rounded-full">
                  {negocio.categoria?.nome || "Negócio local"}
                </span>

                <h3 className="text-xl font-black text-gray-900 dark:text-white line-clamp-1 mt-3">
                  {negocio.nome}
                </h3>

                <p className="text-gray-500 dark:text-gray-300 text-sm mt-2 line-clamp-2">
                  {negocio.descricao || "Conheça este negócio local da sua região."}
                </p>

                {negocio.endereco && (
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-3">
                    📍 {negocio.endereco.bairro}, {negocio.endereco.cidade}
                  </p>
                )}

                <a
                  href={`/negocio/${negocio.id_negocio}`}
                  className="mt-5 block text-center bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black transition shadow-md hover:shadow-lg"
                >
                  Ver negócio
                </a>
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Seção de benefícios */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Por que usar o{" "}
            <span className="text-gradient">Lá da Vendinha</span>?
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
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
            <Reveal key={b.titulo} delay={i * 90}>
            <div
              className="lift h-full bg-white dark:bg-slate-900 rounded-3xl p-7 shadow-card hover:shadow-2xl transition duration-300 border border-orange-50 dark:border-slate-800"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-3xl">
                {b.icone}
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mt-5">
                {b.titulo}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm mt-2 leading-relaxed">
                {b.texto}
              </p>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Chamada para cadastro */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <Reveal>
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-14 text-center shadow-soft">
          <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          <h2 className="relative text-3xl md:text-4xl font-black text-white">
            Tem um negócio local?
          </h2>
          <p className="relative text-orange-50 mt-3 text-lg max-w-xl mx-auto">
            Cadastre-se grátis e seja encontrado por centenas de clientes da sua
            região.
          </p>
          <a
            href="/cadastrar-negocio"
            className="relative inline-block mt-8 bg-white text-orange-600 px-9 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition"
          >
            Cadastrar meu negócio →
          </a>
        </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  )
}