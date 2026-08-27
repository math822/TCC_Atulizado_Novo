"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-28 h-8 rounded-full bg-orange-100 dark:bg-slate-800 animate-pulse" />
  }

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark"

  const alternarTema = () => {
    const novoTema = isDark ? "light" : "dark"
    setTheme(novoTema)

    // Força a aplicação da classe no HTML para alterar as cores do site
    if (novoTema === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <button
      type="button"
      onClick={alternarTema}
      className="relative flex items-center w-28 h-8 p-1 rounded-full bg-orange-100 dark:bg-slate-800 border border-orange-200 dark:border-slate-700 cursor-pointer select-none transition-colors duration-300 shadow-inner"
      aria-label="Alternar tema"
    >
      {/* Botão Deslizante que corre pros lados */}
      <span
        className={`absolute top-1 bottom-1 w-[50px] bg-orange-600 dark:bg-orange-500 rounded-full shadow-md transition-transform duration-300 ease-in-out ${
          isDark ? "translate-x-[52px]" : "translate-x-0"
        }`}
      />

      {/* Opção CLARO */}
      <span
        className={`flex-1 text-center text-[10px] font-black z-10 transition-colors duration-300 ${
          !isDark ? "text-white" : "text-gray-400 dark:text-gray-500"
        }`}
      >
        Claro
      </span>

      {/* Opção ESCURO */}
      <span
        className={`flex-1 text-center text-[10px] font-black z-10 transition-colors duration-300 ${
          isDark ? "text-white" : "text-gray-400"
        }`}
      >
        Escuro
      </span>
    </button>
  )
}