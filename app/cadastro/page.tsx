"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import Logo from "../../components/Logo"

export default function Cadastro() {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [telefone, setTelefone] = useState("")
    const [senha, setSenha] = useState("")
    const [cnpj, setCnpj] = useState("")

    const [verSenha, setVerSenha] = useState(false)
    const [tipo, setTipo] = useState("cliente")
    const [carregando, setCarregando] = useState(false)

    // Google
    const [mostrarEscolhaGoogle, setMostrarEscolhaGoogle] = useState(false)
    const [tipoGoogle, setTipoGoogle] = useState("cliente")
    const [carregandoGoogle, setCarregandoGoogle] = useState(false)

    function formatarCNPJ(valor: string) {
        const numeros = valor.replace(/\D/g, "").slice(0, 14)

        if (numeros.length <= 2) {
            return numeros
        }

        if (numeros.length <= 5) {
            return `${numeros.slice(0, 2)}.${numeros.slice(2)}`
        }

        if (numeros.length <= 8) {
            return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5)}`
        }

        if (numeros.length <= 12) {
            return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8)}`
        }

        return `${numeros.slice(0, 2)}.${numeros.slice(2, 5)}.${numeros.slice(5, 8)}/${numeros.slice(8, 12)}-${numeros.slice(12, 14)}`
    }

    function alterarTipo(novoTipo: string) {
        setTipo(novoTipo)

        if (novoTipo !== "empreendedor") {
            setCnpj("")
        }
    }

    async function cadastrar(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (tipo === "empreendedor") {
            const cnpjNumeros = cnpj.replace(/\D/g, "")

            if (cnpjNumeros.length !== 14) {
                toast.error("Informe um CNPJ válido com 14 dígitos.")
                return
            }
        }

        setCarregando(true)

        try {
            const cnpjNumeros = cnpj.replace(/\D/g, "")

            const resposta = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    email: email.trim(),
                    telefone,
                    senha,
                    tipo,
                    cnpj: tipo === "empreendedor" ? cnpjNumeros : null,
                }),
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                toast.error(dados.error || "Erro ao criar conta")
                setCarregando(false)
                return
            }

            if (dados.usuario) {
                localStorage.setItem(
                    "usuario",
                    JSON.stringify(dados.usuario)
                )
            }

            toast.success(
                tipo === "empreendedor"
                    ? "Conta criada! CNPJ enviado para verificação."
                    : "Conta criada com sucesso!"
            )

            setTimeout(() => {
                window.location.href =
                    tipo === "empreendedor" ? "/dashboard" : "/login"
            }, 1000)
        } catch {
            toast.error("Erro de conexão")
            setCarregando(false)
        }
    }

    function cadastrarComGoogle() {
        setMostrarEscolhaGoogle(true)
    }

    function continuarComGoogle() {
        setCarregandoGoogle(true)

        window.location.href =
            `/api/auth/google?origem=cadastro&tipo=${tipoGoogle}`
    }

    return (
        <main className="min-h-screen bg-[#fff7ed] dark:bg-slate-950 flex items-center justify-center px-6 py-12">

            <div className="max-w-6xl w-full grid lg:grid-cols-2 bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden">

                {/* LADO ESQUERDO */}
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

                {/* LADO DIREITO */}
                <div className="p-10 lg:p-16">

                    <div className="lg:hidden mb-10">
                        <Logo />
                    </div>

                    <h2 className="text-5xl font-black text-gray-900 dark:text-white">
                        Criar conta
                    </h2>

                    <p className="text-gray-500 dark:text-gray-300 mt-4">
                        Crie sua conta rapidamente e comece a usar a plataforma.
                    </p>

                    {/* GOOGLE */}
                    <button
                        type="button"
                        onClick={cadastrarComGoogle}
                        className="w-full mt-8 flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 rounded-2xl transition shadow-sm"
                    >
                        <svg
                            width="21"
                            height="21"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                fill="#4285F4"
                                d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.22a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.39Z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 21.77c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.51A9.74 9.74 0 0 0 12 21.77Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M6.54 13.89A5.86 5.86 0 0 1 6.23 12c0-.66.11-1.3.31-1.89V7.6H3.3A9.76 9.76 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.4l3.24-2.51Z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 6.08c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.17 14.63 2.23 12 2.23a9.74 9.74 0 0 0-8.7 5.37l3.24 2.51C7.31 7.8 9.46 6.08 12 6.08Z"
                            />
                        </svg>

                        Criar conta com Google
                    </button>

                    {/* DIVISOR */}
                    <div className="flex items-center gap-4 my-7">

                        <div className="h-px bg-gray-200 flex-1" />

                        <span className="text-sm text-gray-400 font-medium">
                            ou cadastre com email
                        </span>

                        <div className="h-px bg-gray-200 flex-1" />

                    </div>

                    {/* FORMULÁRIO */}
                    <form onSubmit={cadastrar} className="space-y-5">

                        {/* NOME */}
                        <div>

                            <label
                                htmlFor="nome"
                                className="font-black text-gray-800 dark:text-white"
                            >
                                Nome completo
                            </label>

                            <input
                                id="nome"
                                required
                                autoComplete="name"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Digite seu nome"
                                className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                            />

                        </div>

                        {/* EMAIL */}
                        <div>

                            <label
                                htmlFor="email"
                                className="font-black text-gray-800 dark:text-white"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                required
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Digite seu email"
                                className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                            />

                        </div>

                        {/* TELEFONE */}
                        <div>

                            <label
                                htmlFor="telefone"
                                className="font-black text-gray-800 dark:text-white"
                            >
                                Telefone
                            </label>

                            <input
                                id="telefone"
                                type="tel"
                                autoComplete="tel"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                placeholder="(19) 99999-9999"
                                className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                            />

                        </div>

                        {/* TIPO */}
                        <div>

                            <label
                                htmlFor="tipo"
                                className="font-black text-gray-800 dark:text-white"
                            >
                                Tipo de conta
                            </label>

                            <select
                                id="tipo"
                                value={tipo}
                                onChange={(e) => alterarTipo(e.target.value)}
                                className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                            >
                                <option value="cliente">
                                    Cliente
                                </option>

                                <option value="empreendedor">
                                    Empreendedor
                                </option>
                            </select>

                        </div>

                        {/* CNPJ - SOMENTE EMPREENDEDOR */}
                        {tipo === "empreendedor" && (
                            <div>

                                <label
                                    htmlFor="cnpj"
                                    className="font-black text-gray-800 dark:text-white"
                                >
                                    CNPJ
                                </label>

                                <input
                                    id="cnpj"
                                    required
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    maxLength={18}
                                    value={cnpj}
                                    onChange={(e) =>
                                        setCnpj(formatarCNPJ(e.target.value))
                                    }
                                    placeholder="00.000.000/0000-00"
                                    className="w-full mt-2 border border-orange-100 dark:border-slate-700 bg-orange-50/60 dark:bg-slate-800 rounded-2xl p-4 outline-none focus:border-orange-500 text-gray-900 dark:text-white"
                                />

                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    O CNPJ será enviado para verificação.
                                </p>

                            </div>
                        )}

                        {/* SENHA */}
                        <div>

                            <label
                                htmlFor="senha"
                                className="font-black text-gray-800 dark:text-white"
                            >
                                Senha
                            </label>

                            <div className="relative">

                                <input
                                    id="senha"
                                    required
                                    type={verSenha ? "text" : "password"}
                                    autoComplete="new-password"
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

                        {/* CRIAR CONTA */}
                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-black py-5 rounded-2xl text-xl shadow-xl transition"
                        >
                            {carregando
                                ? "Criando conta..."
                                : "Criar conta"}
                        </button>

                    </form>

                    {/* LOGIN */}
                    <p className="text-center text-gray-500 dark:text-gray-300 mt-8">

                        Já tem conta?

                        <a
                            href="/login"
                            className="text-orange-600 font-black ml-2"
                        >
                            Entrar
                        </a>

                    </p>

                    {/* INÍCIO */}
                    <a
                        href="/"
                        className="block text-center mt-6 text-gray-400 hover:text-orange-600 font-bold"
                    >
                        Voltar para início
                    </a>

                </div>
            </div>

            {/* MODAL ESCOLHA GOOGLE */}
            {mostrarEscolhaGoogle && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">

                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[30px] shadow-2xl p-8">

                        <div className="text-center">

                            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-3xl">
                                👤
                            </div>

                            <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-5">
                                Qual tipo de conta?
                            </h3>

                            <p className="text-gray-500 dark:text-gray-300 mt-3">
                                Escolha como você deseja utilizar a La Davendinha.
                            </p>

                        </div>

                        <div className="grid gap-4 mt-7">

                            {/* CLIENTE */}
                            <button
                                type="button"
                                onClick={() => setTipoGoogle("cliente")}
                                className={`w-full text-left p-5 rounded-2xl border-2 transition ${
                                    tipoGoogle === "cliente"
                                        ? "border-orange-600 bg-orange-50 dark:bg-orange-950/30"
                                        : "border-gray-200 dark:border-slate-700 hover:border-orange-300"
                                }`}
                            >

                                <div className="flex items-center gap-4">

                                    <div className="text-3xl">
                                        👤
                                    </div>

                                    <div>

                                        <p className="font-black text-gray-900 dark:text-white">
                                            Cliente
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Encontrar negócios, produtos e serviços.
                                        </p>

                                    </div>

                                </div>

                            </button>

                            {/* EMPREENDEDOR */}
                            <button
                                type="button"
                                onClick={() => setTipoGoogle("empreendedor")}
                                className={`w-full text-left p-5 rounded-2xl border-2 transition ${
                                    tipoGoogle === "empreendedor"
                                        ? "border-orange-600 bg-orange-50 dark:bg-orange-950/30"
                                        : "border-gray-200 dark:border-slate-700 hover:border-orange-300"
                                }`}
                            >

                                <div className="flex items-center gap-4">

                                    <div className="text-3xl">
                                        🏪
                                    </div>

                                    <div>

                                        <p className="font-black text-gray-900 dark:text-white">
                                            Empreendedor
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Divulgar e gerenciar seu negócio.
                                        </p>

                                    </div>

                                </div>

                            </button>

                        </div>

                        {tipoGoogle === "empreendedor" && (
                            <div className="mt-6 p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">

                                <p className="text-sm text-orange-800 dark:text-orange-200 font-bold">
                                    🔐 O cadastro de empreendedor pelo Google também exigirá um CNPJ para verificação.
                                </p>

                            </div>
                        )}

                        <div className="flex gap-3 mt-7">

                            <button
                                type="button"
                                onClick={() => setMostrarEscolhaGoogle(false)}
                                disabled={carregandoGoogle}
                                className="flex-1 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-200 font-bold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                            >
                                Cancelar
                            </button>

                            <button
                                type="button"
                                onClick={continuarComGoogle}
                                disabled={carregandoGoogle}
                                className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-black py-4 rounded-2xl transition"
                            >
                                {carregandoGoogle
                                    ? "Abrindo Google..."
                                    : "Continuar"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </main>
    )
}