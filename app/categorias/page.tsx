"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const imagens: Record<string, string> = {
  Artesanato: "/categorias/artesanato-futuro-v2.png",
  Beleza: "/categorias/beleza-futuro-v2.png",
  Alimentação: "/categorias/alimentacao-futuro-v2.png",
  Informática: "/categorias/informatica-futuro-v2.png",
  Moda: "/categorias/moda-futuro-v2.png",
  Serviços: "/categorias/servicos-futuro-v2.png",
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
    <main className="min-h-screen text-slate-950 transition-colors dark:text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-cyan-900/10 px-4 py-12 dark:border-cyan-300/10 sm:px-6 sm:py-16">
        <div className="future-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-2xl border border-cyan-900/10 bg-white/80 px-5 font-bold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white dark:border-cyan-300/10 dark:bg-slate-900/80 dark:text-white"
          >
            ← Voltar para o início
          </Link>
          <span className="section-label mt-8 flex w-fit">Encontre por atividade</span>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Categorias</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
            Imagens claras e opções organizadas para você chegar rapidamente ao negócio certo.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {carregando && (
          <div role="status" className="future-surface rounded-3xl py-10 text-center text-lg font-black text-orange-700 dark:text-orange-300">
            Carregando categorias...
          </div>
        )}

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id_categoria}
              href={`/categorias/${encodeURIComponent(categoria.nome)}`}
              className="future-card group overflow-hidden rounded-[30px] transition duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={imagens[categoria.nome] || "/categorias/alimentacao-futuro-v2.png"}
                  alt={`Categoria ${categoria.nome}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-2xl border border-white/30 bg-white/90 px-3 py-2 text-3xl shadow-xl backdrop-blur dark:bg-slate-950/85">
                  {categoria.icone || "🏪"}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black text-slate-950 group-hover:text-orange-700 dark:text-white dark:group-hover:text-orange-300">
                    {categoria.nome}
                  </h2>
                  <span aria-hidden="true" className="text-2xl font-black text-cyan-700 transition-transform group-hover:translate-x-1 dark:text-cyan-300">→</span>
                </div>
                <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  {categoria.descricao || "Veja os negócios disponíveis nesta categoria."}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
