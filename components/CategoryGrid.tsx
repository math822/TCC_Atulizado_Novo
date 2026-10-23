"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Reveal from "./Reveal"

const imagens: Record<string, string> = {
  Artesanato: "/categorias/artesanato-futuro-v2.png",
  Beleza: "/categorias/beleza-futuro-v2.png",
  Alimentação: "/categorias/alimentacao-futuro-v2.png",
  Informática: "/categorias/informatica-futuro-v2.png",
  Moda: "/categorias/moda-futuro-v2.png",
  Serviços: "/categorias/servicos-futuro-v2.png",
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
    <section id="categorias" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="section-label">Explore com facilidade</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            O que você está procurando?
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Escolha uma categoria para encontrar negócios e profissionais da sua região.
          </p>
        </div>
        <Link
          href="/categorias"
          className="press link-underline inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-cyan-700 px-5 font-black text-cyan-800 transition hover:bg-cyan-50 dark:border-cyan-300 dark:text-cyan-200 dark:hover:bg-cyan-950/30"
        >
          Ver todas as categorias →
        </Link>
      </div>

      {carregando && (
        <div role="status" className="future-surface rounded-3xl py-10 text-center text-lg font-black text-orange-700 dark:text-orange-300">
          Carregando categorias...
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((categoria, i) => (
          <Reveal key={categoria.id_categoria} delay={i * 60} variant="scale">
            <Link
              href={`/categorias/${encodeURIComponent(categoria.nome)}`}
              className="future-card shine hover-rise group block h-full overflow-hidden rounded-[28px]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={imagens[categoria.nome] || "/categorias/alimentacao-futuro-v2.png"}
                  alt={`Categoria ${categoria.nome}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/30 bg-white/90 text-3xl shadow-xl backdrop-blur dark:bg-slate-950/85">
                  {categoria.icone || "🏪"}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-2xl font-black text-slate-950 transition-colors group-hover:text-orange-700 dark:text-white dark:group-hover:text-orange-300">
                    {categoria.nome}
                  </h3>
                  <span aria-hidden="true" className="text-2xl font-black text-cyan-700 transition-transform group-hover:translate-x-1 dark:text-cyan-300">→</span>
                </div>
                <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {categoria.descricao || "Veja os negócios disponíveis nesta categoria."}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
