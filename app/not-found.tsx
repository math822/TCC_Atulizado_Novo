import Link from "next/link"

export default function NaoEncontrada() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="w-full max-w-lg rounded-[32px] border border-cyan-900/10 bg-white p-10 text-center shadow-2xl dark:border-cyan-300/10 dark:bg-slate-900">
        <div className="text-6xl">🧭</div>

        <p className="mt-6 text-6xl font-black text-orange-600">404</p>

        <h1 className="mt-2 text-2xl font-black">Página não encontrada</h1>

        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          O endereço que você abriu não existe ou o negócio saiu do ar.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="press min-h-12 rounded-2xl bg-orange-600 px-6 font-black text-white transition hover:bg-orange-700"
          >
            Ir para o início
          </Link>

          <Link
            href="/negocio"
            className="press min-h-12 rounded-2xl border-2 border-cyan-900/10 px-6 font-black text-slate-700 transition hover:bg-slate-50 dark:border-cyan-300/10 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Ver negócios
          </Link>
        </div>
      </div>
    </main>
  )
}
