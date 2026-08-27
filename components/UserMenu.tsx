"use client"

import { useEffect, useState } from "react"

export default function UserMenu() {
  const [usuario, setUsuario] = useState<any>(null)
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const salvo = localStorage.getItem("usuario")
    if (salvo) setUsuario(JSON.parse(salvo))
  }, [])

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("usuario")
    window.location.href = "/login"
  }

  if (!usuario) {
    return (
      <div className="flex items-center gap-3">
        <a
          href="/login"
          className="px-5 py-3 rounded-2xl border-2 border-orange-200 text-orange-600 font-black hover:bg-orange-50 transition"
        >
          Entrar
        </a>

        <a
          href="/cadastro"
          className="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-lg transition"
        >
          Criar conta
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <a
        href="/perfil"
        className="hidden md:flex items-center gap-2 font-black text-gray-900 hover:text-orange-600 transition"
      >
        <span className="text-3xl leading-none">♡</span>
        Favoritos
      </a>

      <button className="relative text-3xl">
        🔔
        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-black">
          3
        </span>
      </button>

      <div className="relative">
        <button
          onClick={() => setAberto(!aberto)}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 border-2 border-orange-200">
            {usuario.foto_perfil ? (
              <img
                src={usuario.foto_perfil}
                alt={usuario.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-orange-600 font-black text-xl">
                {usuario.nome?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="hidden md:block text-left">
            <p className="font-black text-gray-900">
              Olá, {usuario.nome?.split(" ")[0]}
            </p>
          </div>

          <span className="text-gray-800 font-black">
            ˅
          </span>
        </button>

        {aberto && (
          <div className="absolute right-0 mt-4 w-72 bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden z-50">
            <div className="p-5 bg-orange-600 text-white">
              <h3 className="text-xl font-black">
                {usuario.nome}
              </h3>
              <p className="text-orange-100 text-sm">
                {usuario.email}
              </p>
            </div>

            <div className="p-3 grid gap-2">
              <a href="/perfil" className="p-3 rounded-2xl hover:bg-orange-50 font-bold">
                👤 Meu perfil
              </a>

              <a href="/dashboard" className="p-3 rounded-2xl hover:bg-orange-50 font-bold">
                📊 Dashboard
              </a>

              {usuario.tipo === "admin" && (
                <a href="/admin" className="p-3 rounded-2xl hover:bg-orange-50 font-bold text-orange-600">
                  🛡️ Painel admin
                </a>
              )}

              <button
                onClick={sair}
                className="p-3 rounded-2xl hover:bg-red-50 text-left font-black text-red-600"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}