"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { confirmar } from "../../components/Confirmar"
import { moedaBR } from "../lib/formatar"

export default function Dashboard() {
  const [usuario, setUsuario] = useState<any>(null)
  const [negocios, setNegocios] = useState<any[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const salvo = localStorage.getItem("usuario")

    if (!salvo) {
      window.location.href = "/login?redirect=/dashboard"
      return
    }

    const usuarioLogado = JSON.parse(salvo)
    setUsuario(usuarioLogado)

    buscarNegocios(usuarioLogado.id_usuario)
    buscarProdutos(usuarioLogado.id_usuario)
  }, [])

  async function buscarNegocios(id_usuario: string) {
    try {
      const resposta = await fetch("/api/meus-negocios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id_usuario })
      })

      const dados = await resposta.json()

      if (resposta.ok) {
        setNegocios(dados)
      }
    } catch (error) {
      toast.error("Erro ao carregar negócios")
    }

    setCarregando(false)
  }

  async function buscarProdutos(id_usuario: string) {
    try {
      const resposta = await fetch(`/api/produtos?id_usuario=${id_usuario}`)
      const dados = await resposta.json()

      if (resposta.ok) {
        setProdutos(dados)
      }
    } catch (error) {
      toast.error("Erro ao carregar produtos")
    }
  }

  async function apagarProduto(id_produto: string) {
    const aceitou = await confirmar({ titulo: "Apagar este produto?", texto: "O anúncio sai do ar e não pode ser recuperado.", rotuloConfirmar: "Apagar", perigoso: true })

    if (!aceitou) return

    const resposta = await fetch(`/api/produtos/${id_produto}`, {
      method: "DELETE"
    })

    if (resposta.ok) {
      setProdutos((old) =>
        old.filter((produto) => produto.id_produto !== id_produto)
      )

      toast.success("Produto apagado com sucesso")
    } else {
      toast.error("Erro ao apagar produto")
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen text-slate-950 dark:text-white flex items-center justify-center">
        <h1 className="text-4xl font-black text-orange-600">
          Carregando dashboard...
        </h1>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col text-slate-950 dark:text-white">
      <Navbar />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">

        <section className="future-card overflow-hidden rounded-[40px]">
          <div className="grid lg:grid-cols-3">

            <div className="p-10 lg:col-span-2">
              <span className="section-label">● Painel do empreendedor</span>

              <h1 className="mt-4 text-5xl font-black tracking-tight">
                Olá, {usuario?.nome}
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                Gerencie seus negócios, produtos, mensagens e acompanhe sua presença na plataforma Lá da Vendinha.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/cadastrar-negocio"
                  className="press rounded-2xl bg-orange-600 px-6 py-4 font-black text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
                >
                  + Cadastrar negócio
                </Link>

                <Link
                  href="/produtos"
                  className="press rounded-2xl border-2 border-cyan-600/30 px-6 py-4 font-black text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-slate-800"
                >
                  + Cadastrar produto
                </Link>

                <Link
                  href="/mensagens"
                  className="press rounded-2xl border-2 border-cyan-600/30 px-6 py-4 font-black text-cyan-700 transition hover:bg-cyan-50 dark:text-cyan-300 dark:hover:bg-slate-800"
                >
                  💬 Mensagens
                </Link>

                <Link
                  href="/"
                  className="press rounded-2xl border-2 border-cyan-900/10 px-6 py-4 font-black text-slate-800 transition hover:bg-slate-50 dark:border-cyan-300/10 dark:text-white dark:hover:bg-slate-800"
                >
                  Ver site
                </Link>
              </div>
            </div>

            <div className="animate-gradient flex flex-col justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 p-10 text-white">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white/15 text-5xl font-black">
                {usuario?.foto_perfil ? (
                  <img
                    src={usuario.foto_perfil}
                    alt={usuario.nome}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  usuario?.nome?.charAt(0).toUpperCase()
                )}
              </div>

              <h2 className="mt-6 text-3xl font-black capitalize">
                {usuario?.tipo}
              </h2>

              <p className="mt-2 text-slate-300">
                Conta ativa na plataforma
              </p>
            </div>

          </div>
        </section>

        {usuario?.tipo === "empreendedor" && usuario?.status_verificacao === "pendente" && (
          <section className="mt-6 rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-900 dark:border-amber-700/50 dark:bg-amber-950/30 dark:text-amber-200">
            <p className="font-black">⏳ Verificação pendente</p>
            <p className="mt-2 text-sm font-semibold">
              Seu CNPJ está em análise pela equipe da Vendinha. Você já pode cadastrar negócios,
              mas sua conta será destacada como verificada assim que a análise for concluída.
            </p>
          </section>
        )}

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="future-card rounded-3xl p-8">
            <p className="font-bold text-slate-600 dark:text-slate-300">
              Negócios cadastrados
            </p>
            <h2 className="mt-4 text-6xl font-black text-orange-600">
              {negocios.length}
            </h2>
          </div>

          <div className="future-card rounded-3xl p-8">
            <p className="font-bold text-slate-600 dark:text-slate-300">
              Produtos cadastrados
            </p>
            <h2 className="mt-4 text-6xl font-black text-orange-600">
              {produtos.length}
            </h2>
          </div>

          <div className="future-card rounded-3xl p-8">
            <p className="font-bold text-slate-600 dark:text-slate-300">
              Status
            </p>
            <h2 className="mt-4 text-4xl font-black text-green-600">
              Ativo
            </h2>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">

          <div className="future-card rounded-[35px] p-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-black">Meus negócios</h2>

              <Link href="/cadastrar-negocio" className="link-underline font-black text-orange-600">
                + Novo
              </Link>
            </div>

            {negocios.length === 0 && (
              <p className="text-slate-600 dark:text-slate-300">
                Nenhum negócio cadastrado ainda.
              </p>
            )}

            <div className="space-y-5">
              {negocios.map((negocio) => (
                <div
                  key={negocio.id_negocio}
                  className="overflow-hidden rounded-3xl border border-cyan-900/10 dark:border-cyan-300/10"
                >
                  <div className="h-44 overflow-hidden">
                    {negocio.fotos?.length > 0 ? (
                      <img
                        src={negocio.fotos[0].url}
                        alt={negocio.nome}
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = "/categorias/alimentacao-futuro-v2.png"
                        }}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-300 to-cyan-300 text-7xl dark:from-slate-800 dark:to-slate-700">
                        🏪
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-2xl font-black">{negocio.nome}</h3>

                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {negocio.descricao || "Sem descrição"}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        href={`/negocio/${negocio.id_negocio}`}
                        className="press rounded-2xl bg-orange-600 px-5 py-3 font-black text-white transition hover:bg-orange-700"
                      >
                        Ver
                      </Link>

                      <Link
                        href={`/editar-negocio/${negocio.id_negocio}`}
                        className="press rounded-2xl bg-cyan-500/15 px-5 py-3 font-black text-cyan-700 transition hover:bg-cyan-500/25 dark:text-cyan-200"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="future-card rounded-[35px] p-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-black">Produtos</h2>

              <Link href="/produtos" className="link-underline font-black text-orange-600">
                + Novo
              </Link>
            </div>

            {produtos.length === 0 && (
              <p className="text-slate-600 dark:text-slate-300">
                Nenhum produto cadastrado ainda.
              </p>
            )}

            <div className="space-y-4">
              {produtos.map((produto) => (
                <div
                  key={produto.id_produto}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-cyan-900/10 p-5 dark:border-cyan-300/10"
                >
                  <div>
                    <h3 className="text-xl font-black">{produto.nome}</h3>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {produto.descricao || "Sem descrição"}
                    </p>

                    <p className="mt-2 font-black text-orange-600">
                      {moedaBR(produto.preco)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/editar-produto/${produto.id_produto}`}
                      className="press rounded-2xl bg-cyan-500/15 px-4 py-3 font-black text-cyan-700 transition hover:bg-cyan-500/25 dark:text-cyan-200"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => apagarProduto(produto.id_produto)}
                      className="press rounded-2xl bg-red-500 px-4 py-3 font-black text-white transition hover:bg-red-600"
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

      </div>

      <Footer />
    </main>
  )
}