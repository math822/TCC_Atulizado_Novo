"use client"
import ThemeToggle from "./ThemeToggle"


import { useEffect, useState } from "react"

interface NavbarProps {
  busca?: string
  setBusca?: (valor: string) => void
}

export default function Navbar({ busca = "", setBusca }: NavbarProps) {
  const [usuario, setUsuario] = useState<any>(null)
  const [temNotificacao, setTemNotificacao] = useState(true)
  const [temaEscuro, setTemaEscuro] = useState(false)

  // 1. Carrega usuário e tema salvo ao iniciar
  useEffect(() => {
    const salvo = localStorage.getItem("usuario")
    if (salvo) {
      try {
        setUsuario(JSON.parse(salvo))
      } catch (e) {
        console.error("Erro ao ler usuário", e)
      }
    }

    // Verifica se o tema escuro está ativado no localStorage ou no sistema
    const temaSalvo = localStorage.getItem("tema")
    if (
      temaSalvo === "dark" ||
      (!temaSalvo && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTemaEscuro(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // 2. Função para alternar o tema
  function alternarTema() {
    if (temaEscuro) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("tema", "light")
      setTemaEscuro(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("tema", "dark")
      setTemaEscuro(true)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-orange-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. LOGO COM TEXTO E ÍCONE */}
<a href="/" className="flex items-center gap-2 flex-shrink-0 group">
  <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
    📍
  </div>
  <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white hidden sm:inline-block">
    La <span className="text-orange-600">Davendinha</span>
  </span>
</a>

        {/* BUSCA ÚNICA */}
        {setBusca && (
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar lojas, serviços ou produtos..."
                className="w-full bg-orange-50/60 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 pl-11 pr-4 py-2.5 rounded-full border border-orange-100 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>
            </div>
          </div>
        )}

        {/* ÍCONES DE AÇÃO */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Favoritos */}
          <a
            href="/#negocios"
            title="Meus Favoritos"
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-100/50 dark:hover:bg-slate-800 transition text-xl"
          >
            ❤️
          </a>

          {/* Notificações */}
          <button
            title="Notificações"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-100/50 dark:hover:bg-slate-800 transition text-xl"
            onClick={() => setTemNotificacao(false)}
          >
            🔔
            {temNotificacao && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* 🌙 / ☀️ BOTÃO DE TEMA ESCURO */}
          <button
            onClick={alternarTema}
            title={temaEscuro ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-orange-100/50 dark:hover:bg-slate-800 transition text-xl"
          >
            {temaEscuro ? "☀️" : "🌙"}
          </button>

          {/* Divisória discreta */}
          <div className="h-6 w-[1px] bg-gray-200 dark:bg-slate-700 hidden sm:block" />

          {/* PERFIL / ENTRAR */}
          {usuario ? (
            <a
              href="/perfil"
              className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-orange-50 dark:bg-slate-800 border border-orange-200 dark:border-slate-700 hover:border-orange-400 transition"
            >
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[100px] truncate hidden md:inline-block">
                {usuario.nome || "Minha Conta"}
              </span>
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-black text-sm flex items-center justify-center">
                {usuario.nome ? usuario.nome[0].toUpperCase() : "👤"}
              </div>
            </a>
          ) : (
            <a
              href="/login"
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              Entrar
            </a>
          )}

        </div>

      </div>
    </header>
  )
}