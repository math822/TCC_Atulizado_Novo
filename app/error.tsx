"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function ErrorPagina({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("ERRO NA PÁGINA:", error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="w-full max-w-lg rounded-[32px] border border-cyan-900/10 bg-white p-10 text-center shadow-2xl dark:border-cyan-300/10 dark:bg-slate-900">
        <div className="text-6xl">😵</div>

        <h1 className="mt-6 text-3xl font-black">Algo deu errado</h1>

        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
          Não foi possível carregar esta página. Tente de novo — se o problema continuar,
          volte para o início.
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Código do erro: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="press min-h-12 rounded-2xl bg-orange-600 px-6 font-black text-white transition hover:bg-orange-700"
          >
            Tentar novamente
          </button>

          <Link
            href="/"
            className="press min-h-12 rounded-2xl border-2 border-cyan-900/10 px-6 font-black text-slate-700 transition hover:bg-slate-50 dark:border-cyan-300/10 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </main>
  )
}
