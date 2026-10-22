"use client"

type Props = {
  busca: string
  setBusca: (valor: string) => void
}

export default function Hero({ busca, setBusca }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-[#fff7ed] to-[#fff7ed] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
      {/* Blobs decorativos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-300/40 dark:bg-orange-600/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-20 -right-24 w-96 h-96 bg-amber-300/40 dark:bg-amber-600/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-orange-200/50 dark:bg-orange-700/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Coluna de texto */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 border border-orange-200 dark:border-slate-700 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
              🧡 Apoiando o comércio local
            </span>

            <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-gray-900 dark:text-white">
              Encontre os
              <br />
              <span className="text-gradient">melhores negócios</span>
              <br />
              na sua região
            </h1>

            <p className="mt-7 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              Apoie o comércio local e descubra produtos e serviços incríveis
              perto de você — tudo em um só lugar.
            </p>

            {/* Busca inline */}
            <div className="mt-8 flex items-center gap-3 bg-white dark:bg-slate-900 rounded-full p-2 shadow-soft max-w-xl border border-orange-100 dark:border-slate-800">
              <span className="pl-4 text-gray-400 text-xl">🔍</span>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar lojas, serviços ou produtos..."
                className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 py-2"
              />
              <a
                href="#negocios"
                className="bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3 rounded-full transition shadow-md hover:shadow-lg"
              >
                Buscar
              </a>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="#negocios"
                className="group bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-soft transition hover:-translate-y-0.5"
              >
                Explorar negócios
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#categorias"
                className="border-2 border-orange-200 dark:border-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-50 dark:hover:bg-slate-800 transition hover:-translate-y-0.5"
              >
                Ver categorias
              </a>
            </div>
          </div>

          {/* Coluna da imagem */}
          <div className="relative animate-fade-up">
            <div className="absolute right-6 -top-6 w-40 h-72 bg-gradient-to-br from-orange-400 to-amber-400 rounded-[40px] rotate-6 opacity-90" />
            <div className="absolute -left-6 bottom-6 w-32 h-32 bg-orange-200/70 dark:bg-orange-500/20 rounded-[32px] -rotate-12" />

            <img
              src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1200"
              alt="Empreendedora local"
              className="relative z-10 rounded-[40px] shadow-2xl w-full h-[460px] object-cover animate-float"
            />

            {/* Card flutuante: avaliação */}
            <div className="absolute z-20 -bottom-5 -left-5 bg-white dark:bg-slate-900 rounded-2xl shadow-card px-5 py-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-slate-800 flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <p className="text-lg font-black text-gray-900 dark:text-white leading-none">
                  4.9
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                  bem avaliado
                </p>
              </div>
            </div>

            {/* Card flutuante: verificado */}
            <div className="absolute z-20 -top-5 right-5 bg-white dark:bg-slate-900 rounded-2xl shadow-card px-5 py-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-lg">
                ✓
              </span>
              <p className="text-sm font-black text-gray-900 dark:text-white">
                Negócio verificado
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
