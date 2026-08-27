"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Logo from "../../components/Logo"

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
    buscarProdutos()
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

  async function buscarProdutos() {
    try {
      const resposta = await fetch("/api/produtos")
      const dados = await resposta.json()

      if (resposta.ok) {
        setProdutos(dados)
      }
    } catch (error) {
      toast.error("Erro ao carregar produtos")
    }
  }

  async function apagarProduto(id_produto: string) {
    const confirmar = confirm("Deseja apagar este produto?")

    if (!confirmar) return

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
      <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 flex items-center justify-center">
        <h1 className="text-4xl font-black text-orange-600">
          Carregando dashboard...
        </h1>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 py-10 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-6">
          <Logo />
        </div>

        <section className="bg-white dark:bg-slate-900 rounded-[40px] shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-3">

            <div className="lg:col-span-2 p-10">
              <p className="text-orange-600 font-black">
                Painel do empreendedor
              </p>

              <h1 className="text-5xl font-black text-gray-900 dark:text-white mt-3">
                Olá, {usuario?.nome}
              </h1>

              <p className="text-gray-500 dark:text-gray-300 text-lg mt-4 max-w-2xl">
                Gerencie seus negócios, produtos e acompanhe sua presença na plataforma Lá da Vendinha.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <a
                  href="/cadastrar-negocio"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-2xl font-black shadow-lg"
                >
                  + Cadastrar negócio
                </a>

                <a
                  href="/produtos"
                  className="border-2 border-orange-200 text-orange-600 px-6 py-4 rounded-2xl font-black hover:bg-orange-50"
                >
                  + Cadastrar produto
                </a>

                <a
                  href="/"
                  className="border-2 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white px-6 py-4 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Ver site
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-400 p-10 text-white flex flex-col justify-center">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-5xl font-black">
                {usuario?.foto_perfil ? (
                  <img
                    src={usuario.foto_perfil}
                    alt={usuario.nome}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  usuario?.nome?.charAt(0).toUpperCase()
                )}
              </div>

              <h2 className="text-3xl font-black mt-6">
                {usuario?.tipo}
              </h2>

              <p className="text-orange-100 mt-2">
                Conta ativa na plataforma
              </p>
            </div>

          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
            <p className="text-gray-500 dark:text-gray-300 font-bold">
              Negócios cadastrados
            </p>
            <h2 className="text-6xl font-black text-orange-600 mt-4">
              {negocios.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
            <p className="text-gray-500 dark:text-gray-300 font-bold">
              Produtos cadastrados
            </p>
            <h2 className="text-6xl font-black text-orange-600 mt-4">
              {produtos.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl">
            <p className="text-gray-500 dark:text-gray-300 font-bold">
              Status
            </p>
            <h2 className="text-4xl font-black text-green-600 mt-4">
              Ativo
            </h2>
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-8 mt-8">

          <div className="bg-white dark:bg-slate-900 rounded-[35px] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                Meus negócios
              </h2>

              <a
                href="/cadastrar-negocio"
                className="text-orange-600 font-black"
              >
                + Novo
              </a>
            </div>

            {negocios.length === 0 && (
              <p className="text-gray-500 dark:text-gray-300">
                Nenhum negócio cadastrado ainda.
              </p>
            )}

            <div className="space-y-5">
              {negocios.map((negocio) => (
                <div
                  key={negocio.id_negocio}
                  className="border border-orange-100 dark:border-slate-700 rounded-3xl overflow-hidden"
                >
                  <div className="h-44 overflow-hidden">
                    {negocio.fotos?.length > 0 ? (
                      <img
                        src={negocio.fotos[0].url}
                        alt={negocio.nome}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-7xl">
                        🏪
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                      {negocio.nome}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                      {negocio.descricao || "Sem descrição"}
                    </p>

                    <div className="flex gap-3 mt-5 flex-wrap">
                      <a
                        href={`/negocio/${negocio.id_negocio}`}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black"
                      >
                        Ver
                      </a>

                      <a
                        href={`/editar-negocio/${negocio.id_negocio}`}
                        className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-5 py-3 rounded-2xl font-black"
                      >
                        Editar
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[35px] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                Produtos
              </h2>

              <a href="/produtos" className="text-orange-600 font-black">
                + Novo
              </a>
            </div>

            {produtos.length === 0 && (
              <p className="text-gray-500 dark:text-gray-300">
                Nenhum produto cadastrado ainda.
              </p>
            )}

            <div className="space-y-4">
              {produtos.map((produto) => (
                <div
                  key={produto.id_produto}
                  className="border border-orange-100 dark:border-slate-700 rounded-3xl p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                      {produto.nome}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
                      {produto.descricao || "Sem descrição"}
                    </p>

                    <p className="text-orange-600 font-black mt-2">
                      R$ {produto.preco}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`/editar-produto/${produto.id_produto}`}
                      className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-3 rounded-2xl font-black"
                    >
                      Editar
                    </a>

                    <button
                      onClick={() => apagarProduto(produto.id_produto)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-2xl font-black"
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
    </main>
  )
}