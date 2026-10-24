"use client"

import SearchBar from "./SearchBar"

type Props = {
  busca: string
  setBusca: (valor: string) => void
}

export default function Hero({ busca, setBusca }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-cyan-900/10 dark:border-cyan-300/10">
      <div className="future-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
        <div className="animate-fade-up">
          <span className="section-label">● Comércio local, simples e perto</span>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Tecnologia para encontrar o que você precisa{" "}
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-cyan-700 bg-clip-text text-transparent dark:to-cyan-300">
              perto de casa.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
            Descubra lojas, profissionais e produtos da sua região com uma busca
            fácil, informações claras e avaliações de outros clientes.
          </p>

          <div className="future-surface mt-8 flex max-w-2xl flex-col gap-3 rounded-[26px] p-3 sm:flex-row sm:items-center">
            <SearchBar
              busca={busca}
              setBusca={setBusca}
              id="busca-principal"
              placeholder="O que você procura?"
              className="min-w-0 flex-1"
              inputClassName="min-h-12 w-full rounded-2xl bg-white/80 py-3 pl-12 pr-4 text-lg font-semibold text-slate-900 outline-none placeholder:text-slate-500 focus:bg-white dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-slate-900"
            />
            <button
              type="button"
              onClick={() => {
                setBusca(busca)
                document.getElementById("negocios")?.scrollIntoView({ behavior: "smooth" })
              }}
              className="press flex min-h-12 items-center justify-center rounded-2xl bg-orange-600 px-7 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
            >
              Buscar agora
            </button>
          </div>

          <div className="mt-7 flex flex-wrap gap-3 text-base font-bold text-slate-700 dark:text-slate-200">
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm dark:bg-slate-900/80">✓ Busca simples</span>
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm dark:bg-slate-900/80">✓ Informações claras</span>
            <span className="rounded-full bg-white/80 px-4 py-2 shadow-sm dark:bg-slate-900/80">✓ Negócios avaliados</span>
          </div>
        </div>

        <div className="relative animate-fade-up lg:pl-6">
          <div className="absolute -inset-3 rounded-[42px] bg-gradient-to-br from-orange-500/30 via-transparent to-cyan-500/30 blur-xl" />
          <div className="future-surface relative overflow-hidden rounded-[34px] p-2">
            <img
              src="/categorias/artesanato-futuro-v2.png"
              alt="Empreendedores locais trabalhando em produtos artesanais"
              className="h-[340px] w-full rounded-[28px] object-cover sm:h-[430px]"
            />
            <div className="absolute inset-x-5 bottom-5 animate-pop rounded-2xl bg-slate-950/75 p-4 text-white backdrop-blur-md">
              <p className="text-lg font-black">Feito por pessoas da sua região</p>
              <p className="mt-1 text-base text-slate-200">Compre local e fortaleça sua comunidade.</p>
            </div>
          </div>

          <div className="absolute -right-2 -top-4 animate-pulse-soft rounded-2xl border border-cyan-200/60 bg-white/95 px-4 py-3 font-black text-cyan-800 shadow-xl dark:border-cyan-700 dark:bg-slate-900 dark:text-cyan-200 sm:right-5">
            Fácil de usar
          </div>
        </div>
      </div>
    </section>
  )
}
