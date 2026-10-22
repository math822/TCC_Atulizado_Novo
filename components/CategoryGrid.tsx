"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

const imagens: Record<string, string> = {
  Artesanato: "/categorias/Artesanato.png",
  Beleza: "/categorias/Beleza.png",
  Alimentação: "/categorias/Comida.png",
  Informática: "/categorias/Informatica.png",
  Moda: "/categorias/Moda.png",
  Serviços: "/categorias/Servico.png",
}

export default function CategoryGrid() {
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
    <section id="categorias" className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Categorias
          </h2>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Explore os negócios por tipo de atividade.
          </p>
        </div>
        <Link
          href="/categorias"
          className="hidden sm:inline-block text-orange-600 font-bold hover:underline"
        >
          Ver todas →
        </Link>
      </div>

      {carregando && (
        <div className="text-center text-orange-600 font-black py-10">
          Carregando categorias...
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categorias.map((categoria) => (
          <Link
            key={categoria.id_categoria}
            href={`/categorias/${encodeURIComponent(categoria.nome)}`}
            className="group overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-slate-700"
          >
            <div className="relative w-full h-40 bg-gray-50 dark:bg-slate-800 overflow-hidden">
              <Image
                src={imagens[categoria.nome] || "/categorias/Comida.png"}
                alt={categoria.nome}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-xl">
                {categoria.icone || "🏪"}
              </div>
            </div>
            <div className="py-4 px-3 bg-white dark:bg-slate-900">
              <h3 className="text-lg font-black text-center text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                {categoria.nome}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
