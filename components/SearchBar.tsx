"use client"

import { useEffect, useRef, useState } from "react"

type SugestaoNegocio = {
  id_negocio: string
  nome: string
  endereco?: { cidade: string | null; bairro: string | null } | null
  categoria?: { nome: string } | null
}
type SugestaoCategoria = { id_categoria: string; nome: string }

type Props = {
  busca?: string
  setBusca?: (valor: string) => void
  className?: string
  inputClassName?: string
  placeholder?: string
  id?: string
}

export default function SearchBar({
  busca,
  setBusca,
  className = "",
  inputClassName = "",
  placeholder = "Buscar no site...",
  id = "busca-navegacao"
}: Props) {
  const [q, setQ] = useState(busca ?? "")
  const [negocios, setNegocios] = useState<SugestaoNegocio[]>([])
  const [categorias, setCategorias] = useState<SugestaoCategoria[]>([])
  const [aberto, setAberto] = useState(false)
  const [destaque, setDestaque] = useState(-1)
  const caixaRef = useRef<HTMLDivElement>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Mantém sincronizado com o estado da home (se houver)
  useEffect(() => {
    if (busca !== undefined) setQ(busca)
  }, [busca])

  // Fecha ao clicar fora
  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (caixaRef.current && !caixaRef.current.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener("mousedown", aoClicarFora)
    return () => document.removeEventListener("mousedown", aoClicarFora)
  }, [])

  function aoDigitar(valor: string) {
    setQ(valor)
    setBusca?.(valor)
    setDestaque(-1)

    if (temporizador.current) clearTimeout(temporizador.current)

    if (valor.trim().length < 2) {
      setNegocios([])
      setCategorias([])
      setAberto(false)
      return
    }

    temporizador.current = setTimeout(async () => {
      try {
        const r = await fetch(`/api/busca?q=${encodeURIComponent(valor.trim())}`)
        if (!r.ok) return
        const dados = await r.json()
        setNegocios(Array.isArray(dados.negocios) ? dados.negocios : [])
        setCategorias(Array.isArray(dados.categorias) ? dados.categorias : [])
        setAberto(true)
      } catch {
        /* ignora */
      }
    }, 250)
  }

  const total = negocios.length + categorias.length

  function irParaNegocio(id: string) {
    setAberto(false)
    window.location.href = `/negocio/${id}`
  }

  function irParaCategoria(nome: string) {
    setAberto(false)
    window.location.href = `/categorias/${encodeURIComponent(nome)}`
  }

  function enviar() {
    setAberto(false)
    if (setBusca) {
      setBusca(q)
      if (typeof document !== "undefined") {
        document.getElementById("negocios")?.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      window.location.href = `/?busca=${encodeURIComponent(q)}`
    }
  }

  function aoPressionarTecla(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setAberto(true)
      setDestaque((d) => Math.min(d + 1, total - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setDestaque((d) => Math.max(d - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (destaque >= 0 && destaque < negocios.length) {
        irParaNegocio(negocios[destaque].id_negocio)
      } else if (destaque >= negocios.length) {
        const cat = categorias[destaque - negocios.length]
        if (cat) irParaCategoria(cat.nome)
      } else {
        enviar()
      }
    } else if (e.key === "Escape") {
      setAberto(false)
    }
  }

  return (
    <div ref={caixaRef} className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Buscar lojas, serviços ou produtos
      </label>
      <input
        id={id}
        type="search"
        role="combobox"
        aria-expanded={aberto && total > 0}
        aria-autocomplete="list"
        autoComplete="off"
        value={q}
        onChange={(e) => aoDigitar(e.target.value)}
        onKeyDown={aoPressionarTecla}
        onFocus={() => total > 0 && setAberto(true)}
        placeholder={placeholder}
        className={inputClassName}
      />

      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-cyan-700 dark:text-cyan-300">
        ⌕
      </span>

      {aberto && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-cyan-900/10 bg-white text-slate-900 shadow-2xl dark:border-cyan-300/10 dark:bg-slate-900 dark:text-white">
          {total === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
              Nenhuma sugestão encontrada.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {negocios.map((n, i) => (
                <li key={n.id_negocio}>
                  <button
                    type="button"
                    onMouseEnter={() => setDestaque(i)}
                    onClick={() => irParaNegocio(n.id_negocio)}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                      destaque === i ? "bg-orange-50 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span aria-hidden="true" className="text-lg">🏪</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-bold">{n.nome}</span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {n.categoria?.nome ? `${n.categoria.nome} · ` : ""}
                        {n.endereco?.cidade || "Negócio local"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}

              {categorias.map((c, i) => {
                const idx = negocios.length + i
                return (
                  <li key={c.id_categoria}>
                    <button
                      type="button"
                      onMouseEnter={() => setDestaque(idx)}
                      onClick={() => irParaCategoria(c.nome)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                        destaque === idx ? "bg-cyan-50 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <span aria-hidden="true" className="text-lg">#</span>
                      <span className="min-w-0 flex-1 truncate font-bold text-cyan-800 dark:text-cyan-200">
                        {c.nome}
                      </span>
                      <span className="text-xs text-slate-400">categoria</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
