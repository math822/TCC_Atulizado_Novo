"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import Logo from "../../components/Logo"

export default function Cadastro() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [senha, setSenha] = useState("")
  const [verSenha, setVerSenha] = useState(false)
  const [tipo, setTipo] = useState("cliente")
  const [carregando, setCarregando] = useState(false)

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)

    try {
      const resposta = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          telefone,
          senha,
          tipo
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        toast.error(dados.error || "Erro ao criar conta")
        setCarregando(false)
        return
      }

      toast.success("Conta criada com sucesso!")

      setTimeout(() => {
        window.location.href = "/login"
      }, 800)

    } catch (error) {
      toast.error("Erro de conexão")
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 flex items-center justify-center px-6 py-12">

      <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden">

        <div className="hidden lg:flex flex-col justify-center p-14 bg-gradient-to-br from-orange-600 to-orange-400 text-white">

          <div className="bg-white rounded-[30px] p-6 w-fit mb-10">
            <Logo />
          </div>

          <h1 className="text-6xl font-black leading-tight">
            Crie sua conta na Vendinha
          </h1>

          <p className="text-orange-100 text-xl mt-6 leading-relaxed">
            Entre para a comunidade de clientes e empreendedores locais da sua região.
          </p>

          <div className="grid gap-4 mt-10">
            <div className="bg-white/20 rounded-3xl p-5 font-bold">
              🛒 Encontre negócios perto de você
            </div>

            <div className="bg-white/20 rounded-3xl p-5 font-bold">
              ❤️ Salve seus favoritos
            </div>

            <div className="bg-white/20 rounded-3xl p-5 font-bold">
              🏪 Cadastre seu empreendimento
            </div>
          </div>

        </div>

        <div className="p-10 lg:p-16">

          <div className="lg:hidden mb-10">
            <Logo />
          </div>

          <h2 className="text-5xl font-black text-gray-900 dark:text-white">
            Criar conta
          </h2>

          <p className="text-gray-500 dark:text-gray-300 mt-4">
            Preencha os dados para começar a usar a plataforma.
          </p>

          <form onSubmit={cadastrar} className="mt-10 space-y-5">

            <div>
              <label className="font-black text-gray-800 dark:text-white">
                Nome completo
              </label>

              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
                className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-black text-gray-800 dark:text-white">
                Email
              </label>

              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
                className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-black text-gray-800 dark:text-white">
                Telefone
              </label>

              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(19) 99999-9999"
                className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-black text-gray-800 dark:text-white">
                Tipo de conta
              </label>

              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
              >
                <option value="cliente">Cliente</option>
                <option value="empreendedor">Empreendedor</option>
                <option value="Adimin">Adm</option>
              </select>
            </div>

            <div>
              <label className="font-black text-gray-800 dark:text-white">
                Senha
              </label>

              <div className="relative">
                <input
                  required
                  type={verSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Crie uma senha"
                  className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 pr-24 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => setVerSenha(!verSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-600 font-black"
                >
                  {verSenha ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button
              disabled={carregando}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-black py-5 rounded-2xl text-xl shadow-xl transition"
            >
              {carregando ? "Criando conta..." : "Criar conta"}
            </button>

          </form>

          <p className="text-center text-gray-500 dark:text-gray-300 mt-8">
            Já tem conta?
            <a href="/login" className="text-orange-600 font-black ml-2">
              Entrar
            </a>
          </p>

          <a
            href="/"
            className="block text-center mt-6 text-gray-400 hover:text-orange-600 font-bold"
          >
            Voltar para início
          </a>

        </div>

      </div>

    </main>
  )
}