"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const imagens: Record<string, string> = {
  Artesanato: "/categorias/Artesanato.png",
  Beleza: "/categorias/Beleza.png",
  Alimentação: "/categorias/Comida.png",
  Informática: "/categorias/Informatica.png",
  Moda: "/categorias/Moda.png",
  Serviços: "/categorias/Servico.png",
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await fetch("/api/categorias")
        const dados = await resposta.json()
        if (resposta.ok) setCategorias(dados)
      } catch (error) {
        console.log(error)
      }
      setCarregando(false)
    }
    carregar()
  }, [])

  return (
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 transition-colors">
      <Navbar />

      <section className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-block bg-white/20 px-5 py-2.5 rounded-2xl font-bold mb-8 hover:bg-white/30 transition"
          >
            ← Voltar para início
          </Link>
          <h1 className="text-5xl md:text-6xl font-black">Categorias</h1>
          <p className="text-orange-100 text-lg mt-3 max-w-2xl">
            Encontre exatamente o que você procura navegando por tipo de negócio.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-12">
        {carregando && (
          <div className="text-center text-orange-600 font-black py-10">
            Carregando categorias...
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id_categoria}
              href={`/categorias/${encodeURIComponent(categoria.nome)}`}
              className="group bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-slate-700"
            >
              <div className="relative w-full h-52 bg-gray-50 dark:bg-slate-800 overflow-hidden">
                <Image
                  src={imagens[categoria.nome] || "/categorias/Comida.png"}
                  alt={categoria.nome}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-3xl flex-shrink-0">
                  {categoria.icone || "🏪"}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                    {categoria.nome}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
                    {categoria.descricao}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
