"use client"

import { useEffect, useRef, useState } from "react"

interface OpcaoConfirmacao {
  titulo: string
  texto: string
  rotuloConfirmar?: string
  perigoso?: boolean
}

let abrirDialogo: ((opcao: OpcaoConfirmacao) => Promise<boolean>) | null = null

// Uso: if (!(await confirmar({ titulo: "Apagar produto?", texto: "..." }))) return
export function confirmar(opcao: OpcaoConfirmacao): Promise<boolean> {
  if (!abrirDialogo) {
    return Promise.resolve(window.confirm(`${opcao.titulo}\n\n${opcao.texto}`))
  }
  return abrirDialogo(opcao)
}

export default function Confirmar() {
  const [opcao, setOpcao] = useState<OpcaoConfirmacao | null>(null)
  const resolver = useRef<((valor: boolean) => void) | null>(null)

  useEffect(() => {
    abrirDialogo = (novaOpcao) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve
        setOpcao(novaOpcao)
      })

    return () => {
      abrirDialogo = null
    }
  }, [])

  function responder(valor: boolean) {
    resolver.current?.(valor)
    resolver.current = null
    setOpcao(null)
  }

  useEffect(() => {
    if (!opcao) return

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") responder(false)
    }

    document.addEventListener("keydown", aoTeclar)
    return () => document.removeEventListener("keydown", aoTeclar)
  }, [opcao])

  if (!opcao) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmar-titulo"
      onClick={() => responder(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl border border-cyan-900/10 bg-white p-7 shadow-2xl dark:border-cyan-300/10 dark:bg-slate-900"
      >
        <h2 id="confirmar-titulo" className="text-2xl font-black text-slate-950 dark:text-white">
          {opcao.titulo}
        </h2>

        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{opcao.texto}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            autoFocus
            onClick={() => responder(true)}
            className={
              opcao.perigoso
                ? "press min-h-12 flex-1 rounded-2xl bg-red-600 px-5 font-black text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700"
                : "press min-h-12 flex-1 rounded-2xl bg-orange-600 px-5 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
            }
          >
            {opcao.rotuloConfirmar || "Confirmar"}
          </button>

          <button
            type="button"
            onClick={() => responder(false)}
            className="press min-h-12 rounded-2xl border-2 border-cyan-900/10 px-5 font-bold text-slate-700 transition hover:bg-slate-50 dark:border-cyan-300/10 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
