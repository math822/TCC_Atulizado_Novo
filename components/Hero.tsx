"use client"

type Props = {
  busca: string
  setBusca: (valor: string) => void
}

export default function Hero({
  busca,
  setBusca
}: Props) {
  return (

    <section className="bg-white dark:bg-slate-950">

      <div className="max-w-7xl mx-auto px-6 py-14">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <h1 className="text-6xl font-black leading-tight text-gray-900 dark:text-white">

              Encontre os

              <br />

              <span className="text-orange-600">

                melhores negócios

              </span>

              <br />

              na sua região

            </h1>

            <p className="mt-8 text-xl text-gray-600 dark:text-gray-300 max-w-xl">

              Apoie o comércio local e descubra produtos e serviços incríveis perto de você.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <a
                href="#negocios"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black shadow-lg transition"
              >
                Explorar negócios →
              </a>

              <a
                href="#categorias"
                className="border-2 border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white px-8 py-4 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              >
                Ver categorias
              </a>

            </div>

          </div>

          <div className="relative">

            <div className="absolute right-0 top-10 w-40 h-72 bg-orange-400 rounded-[40px] opacity-90"></div>

            <img
              src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1200"
              alt="Empreendedora"
              className="relative z-10 rounded-[40px] shadow-2xl w-full h-[450px] object-cover"
            />

          </div>

        </div>

      </div>

    </section>

  )
}