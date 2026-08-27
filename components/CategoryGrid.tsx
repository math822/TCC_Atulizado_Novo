"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

type Props = {
  categoriaSelecionada: string
  setCategoriaSelecionada: (valor: string) => void
}

const imagens: Record<string, string> = {
  Artesanato: "/categorias/Artesanato.png",
  Beleza: "/categorias/Beleza.png",
  Alimentação: "/categorias/Comida.png",
  Informática: "/categorias/Informatica.png",
  Moda: "/categorias/Moda.png",
  Serviços: "/categorias/Servico.png"
}

export default function CategoryGrid({
  categoriaSelecionada,
  setCategoriaSelecionada
}: Props) {

  const [categorias, setCategorias] = useState<any[]>([])

  useEffect(() => {

    async function carregar() {

      try {

        const resposta = await fetch("/api/categorias")
        const dados = await resposta.json()

        if (resposta.ok) {
          setCategorias(dados)
        }

      } catch (error) {
        console.log(error)
      }

    }

    carregar()

  }, [])

  return (

    <section
      id="categorias"
      className="max-w-7xl mx-auto px-6 py-12"
    >

      <div className="flex justify-between items-center mb-10">

        <h2 className="text-3xl font-black text-gray-900 dark:text-white">
          Categorias
        </h2>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

        {categorias.map((categoria) => (

          <button
            key={categoria.id_categoria}
            onClick={() => setCategoriaSelecionada(categoria.nome)}
            className={`
              overflow-hidden
              rounded-3xl
              bg-white
              dark:bg-slate-900
              shadow-lg
              hover:shadow-2xl
              transition-all
              duration-300
              hover:-translate-y-2
              border

              ${
                categoriaSelecionada === categoria.nome
                  ? "border-orange-500 ring-2 ring-orange-300"
                  : "border-gray-100 dark:border-slate-700"
              }
            `}
          >

            <div className="relative w-full h-56 bg-gray-50 dark:bg-slate-800">

              <Image
                src={imagens[categoria.nome] || "/categorias/Comida.png"}
                alt={categoria.nome}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />

            </div>

            <div className="py-5 px-3 bg-white dark:bg-slate-900">

              <h3 className="text-xl font-black text-center text-gray-900 dark:text-white">
                {categoria.nome}
              </h3>

            </div>

          </button>

        ))}

      </div>

    </section>

  )

}