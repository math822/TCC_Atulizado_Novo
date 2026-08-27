"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function AdminPage() {
  const [usuario, setUsuario] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)

  const [usuarios, setUsuarios] = useState<any[]>([])
  const [negocios, setNegocios] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])

  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const salvo = localStorage.getItem("usuario")

    if (!salvo) {
      window.location.href = "/login"
      return
    }

    const usuarioLogado = JSON.parse(salvo)

    if (usuarioLogado.tipo !== "admin") {
      window.location.href = "/dashboard"
      return
    }

    setUsuario(usuarioLogado)
    carregarDados()
  }, [])

  async function carregarDados() {
    try {
      const [statsRes, usuariosRes, negociosRes, produtosRes] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/usuarios"),
          fetch("/api/negocios"),
          fetch("/api/produtos")
        ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (usuariosRes.ok) setUsuarios(await usuariosRes.json())
      if (negociosRes.ok) setNegocios(await negociosRes.json())
      if (produtosRes.ok) setProdutos(await produtosRes.json())
    } catch (error) {
      console.log(error)
    }

    setCarregando(false)
  }

  if (!usuario || carregando) {
    return (
      <main className="min-h-screen bg-blue-50 dark:bg-slate-950 flex items-center justify-center">
        <h1 className="text-4xl font-black text-blue-700 dark:text-cyan-400">
          Carregando painel admin...
        </h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-blue-50 dark:bg-slate-950 transition-colors duration-300 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-12">
          <h1 className="text-5xl font-black text-blue-700 dark:text-cyan-400">
            Painel Administrativo
          </h1>

          <p className="text-gray-500 dark:text-gray-300 mt-4 text-xl">
            Controle geral da plataforma Lá da Vendinha
          </p>
        </div>

        {stats && (
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-blue-700 dark:text-cyan-400 mb-8">
                Estatísticas gerais
              </h2>

              <div className="grid grid-cols-2 gap-5">
                <div className="bg-blue-50 dark:bg-slate-800 rounded-3xl p-6 text-center">
                  <h3 className="text-5xl font-black text-blue-700 dark:text-cyan-400">
                    {stats.usuarios}
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-300">
                    Usuários
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-slate-800 rounded-3xl p-6 text-center">
                  <h3 className="text-5xl font-black text-blue-700 dark:text-cyan-400">
                    {stats.negocios}
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-300">
                    Negócios
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-slate-800 rounded-3xl p-6 text-center">
                  <h3 className="text-5xl font-black text-blue-700 dark:text-cyan-400">
                    {stats.produtos}
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-300">
                    Produtos
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-slate-800 rounded-3xl p-6 text-center">
                  <h3 className="text-5xl font-black text-blue-700 dark:text-cyan-400">
                    {stats.favoritos}
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-300">
                    Favoritos
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-blue-700 dark:text-cyan-400 mb-8">
                Crescimento da plataforma
              </h2>

              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { nome: "Usuários", valor: stats.usuarios },
                      { nome: "Negócios", valor: stats.negocios },
                      { nome: "Produtos", valor: stats.produtos },
                      { nome: "Favoritos", valor: stats.favoritos }
                    ]}
                  >
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="valor" fill="#2563eb" radius={[20, 20, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          <section className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-blue-700 dark:text-cyan-400 mb-6">
              Usuários
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-auto pr-2">
              {usuarios.map((item) => (
                <div
                  key={item.id_usuario}
                  className="border border-gray-100 dark:border-slate-700 rounded-3xl p-5"
                >
                  <h3 className="text-xl font-black text-gray-800 dark:text-white">
                    {item.nome}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
                    {item.email}
                  </p>

                  <span className="inline-block mt-3 bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-cyan-400 px-4 py-2 rounded-2xl font-bold text-sm">
                    {item.tipo}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-blue-700 dark:text-cyan-400 mb-6">
              Negócios
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-auto pr-2">
              {negocios.map((item) => (
                <div
                  key={item.id_negocio}
                  className="border border-gray-100 dark:border-slate-700 rounded-3xl p-5"
                >
                  <h3 className="text-xl font-black text-gray-800 dark:text-white">
                    {item.nome}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                    {item.descricao || "Sem descrição"}
                  </p>

                  <a
                    href={`/negocio/${item.id_negocio}`}
                    className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold"
                  >
                    Ver negócio
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-blue-700 dark:text-cyan-400 mb-6">
              Produtos
            </h2>

            <div className="space-y-4 max-h-[600px] overflow-auto pr-2">
              {produtos.map((item) => (
                <div
                  key={item.id_produto}
                  className="border border-gray-100 dark:border-slate-700 rounded-3xl p-5"
                >
                  <h3 className="text-xl font-black text-gray-800 dark:text-white">
                    {item.nome}
                  </h3>

                  <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                    {item.descricao || "Sem descrição"}
                  </p>

                  <p className="text-blue-700 dark:text-cyan-400 font-black text-xl mt-3">
                    R$ {item.preco}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}