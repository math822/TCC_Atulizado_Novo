"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function PerfilPage() {
    const [usuario, setUsuario] = useState<any>(null)

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senhaAtual, setSenhaAtual] = useState("")
    const [novaSenha, setNovaSenha] = useState("")
    const [imagem, setImagem] = useState<File | null>(null)

    const [negocios, setNegocios] = useState<any[]>([])
    const [favoritos, setFavoritos] = useState<any[]>([])
    const [editarAberto, setEditarAberto] = useState(false)
    const [carregando, setCarregando] = useState(false)

    // Estados para o processo de exclusão de conta
    const [mostrarModalDelete, setMostrarModalDelete] = useState(false)
    const [deletando, setDeletando] = useState(false)

    useEffect(() => {
        const salvo = localStorage.getItem("usuario")

        if (!salvo) {
            window.location.href = "/login"
            return
        }

        const usuarioLogado = JSON.parse(salvo)

        setUsuario(usuarioLogado)
        setNome(usuarioLogado.nome)
        setEmail(usuarioLogado.email)

        buscarNegocios(usuarioLogado.id_usuario)
        buscarFavoritos(usuarioLogado.id_usuario)
    }, [])

    async function buscarNegocios(id_usuario: string) {
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
    }

    async function buscarFavoritos(id_usuario: string) {
        const resposta = await fetch(`/api/favoritos?id_usuario=${id_usuario}`)
        const dados = await resposta.json()

        if (resposta.ok) {
            setFavoritos(dados)
        }
    }

    async function uploadImagem() {
        if (!imagem) return ""

        const formData = new FormData()
        formData.append("arquivo", imagem)

        const resposta = await fetch("/api/upload", {
            method: "POST",
            body: formData
        })

        const dados = await resposta.json()

        if (resposta.ok) {
            return dados.url
        }

        return ""
    }

    async function salvarPerfil(e: React.FormEvent) {
        e.preventDefault()
        setCarregando(true)

        try {
            const fotoPerfil = await uploadImagem()

            const resposta = await fetch("/api/perfil", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    nome,
                    email,
                    senhaAtual,
                    novaSenha,
                    foto_perfil: fotoPerfil
                })
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                toast.error(dados.error || "Erro ao atualizar perfil")
                setCarregando(false)
                return
            }

            localStorage.setItem("usuario", JSON.stringify(dados.usuario))
            setUsuario(dados.usuario)
            setImagem(null)
            setSenhaAtual("")
            setNovaSenha("")
            setEditarAberto(false)

            toast.success("Perfil atualizado com sucesso!")
        } catch (error) {
            toast.error("Erro de conexão")
        }

        setCarregando(false)
    }

    // Função de Logout
    function sairDaConta() {
        localStorage.removeItem("usuario")
        toast.success("Sessão encerrada!")
        window.location.href = "/login"
    }

    // Função para Excluir Conta
    async function apagarConta() {
        if (!usuario?.id_usuario) return
        setDeletando(true)

        try {
            const resposta = await fetch(`/api/perfil?id=${usuario.id_usuario}`, {
                method: "DELETE"
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                toast.error(dados.error || "Erro ao excluir conta")
                setDeletando(false)
                return
            }

            localStorage.removeItem("usuario")
            toast.success("Conta excluída com sucesso.")
            window.location.href = "/"
        } catch (error) {
            toast.error("Erro de conexão ao excluir conta")
            setDeletando(false)
        }
    }

    if (!usuario) return null

    return (
        <main className="flex min-h-screen flex-col text-slate-950 transition-colors dark:text-white">
            <Navbar />

            <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">

                <section className="future-card overflow-hidden rounded-[45px]">
                    <div className="animate-gradient relative overflow-hidden bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900 px-10 py-14 text-white">
                        <div className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />

                        <div className="relative flex flex-col items-center gap-10 lg:flex-row">

                            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-white/30 bg-white/15 shadow-2xl">
                                {usuario.foto_perfil ? (
                                    <img
                                        src={usuario.foto_perfil}
                                        alt={usuario.nome}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-7xl font-black">
                                        {usuario.nome?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 text-center lg:text-left">
                                <p className="mb-4 inline-block rounded-2xl bg-white/15 px-5 py-2 font-black capitalize">
                                    {usuario.tipo}
                                </p>

                                <h1 className="text-5xl font-black">
                                    {usuario.nome}
                                </h1>

                                <p className="mt-3 text-xl text-slate-300">
                                    {usuario.email}
                                </p>

                                <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
                                    <button
                                        onClick={() => setEditarAberto(!editarAberto)}
                                        className="press rounded-2xl bg-white px-6 py-4 font-black text-slate-900 shadow-lg transition hover:bg-slate-100"
                                    >
                                        {editarAberto ? "Fechar edição" : "Editar perfil"}
                                    </button>

                                    {(usuario.tipo === "empreendedor" || usuario.tipo === "admin") && (
                                        <a
                                            href="/dashboard"
                                            className="press rounded-2xl bg-white/15 px-6 py-4 font-black transition hover:bg-white/25"
                                        >
                                            Dashboard
                                        </a>
                                    )}

                                    <a
                                        href="/mensagens"
                                        className="press rounded-2xl bg-white/15 px-6 py-4 font-black transition hover:bg-white/25"
                                    >
                                        💬 Mensagens
                                    </a>

                                    {usuario.tipo === "admin" && (
                                        <a
                                            href="/admin"
                                            className="press rounded-2xl bg-black/20 px-6 py-4 font-black transition hover:bg-black/30"
                                        >
                                            Painel admin
                                        </a>
                                    )}

                                    <button
                                        onClick={sairDaConta}
                                        className="press rounded-2xl bg-red-500/20 px-6 py-4 font-black text-white transition hover:bg-red-500/40"
                                    >
                                        🚪 Sair
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="grid gap-6 p-8 md:grid-cols-3">
                        <div className="rounded-3xl bg-cyan-500/10 p-6">
                            <p className="font-bold text-slate-600 dark:text-slate-300">
                                Meus negócios
                            </p>
                            <h2 className="mt-2 text-5xl font-black text-orange-600">
                                {negocios.length}
                            </h2>
                        </div>

                        <div className="rounded-3xl bg-cyan-500/10 p-6">
                            <p className="font-bold text-slate-600 dark:text-slate-300">
                                Favoritos
                            </p>
                            <h2 className="mt-2 text-5xl font-black text-red-500">
                                {favoritos.length}
                            </h2>
                        </div>

                        <div className="rounded-3xl bg-cyan-500/10 p-6">
                            <p className="font-bold text-slate-600 dark:text-slate-300">
                                Status da conta
                            </p>
                            <h2 className="mt-3 text-3xl font-black text-green-600">
                                Ativa
                            </h2>
                        </div>
                    </div>
                </section>

                {/* FORMULÁRIO DE EDIÇÃO + ZONA DE PERIGO */}
                {editarAberto && (
                    <section className="future-card rounded-[40px] p-10 mt-8 space-y-12">
                        <div>
                            <h2 className="text-4xl font-black text-orange-600 mb-8">
                                Editar dados da conta
                            </h2>

                            <form onSubmit={salvarPerfil} className="space-y-6">

                                <div>
                                    <label className="font-black text-gray-800 dark:text-white">
                                        Foto de perfil
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImagem(e.target.files?.[0] || null)}
                                        className="w-full mt-2 rounded-2xl border border-cyan-900/10 bg-slate-50/90 p-4 font-medium dark:border-cyan-300/10 dark:bg-slate-800 text-gray-900 dark:text-white"
                                    />

                                    {imagem && (
                                        <p className="text-orange-600 font-bold mt-2">
                                            Imagem selecionada: {imagem.name}
                                        </p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="font-black text-gray-800 dark:text-white">
                                            Nome
                                        </label>

                                        <input
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            className="w-full mt-2 border border-cyan-900/10 bg-slate-50/90 dark:bg-slate-800 rounded-2xl p-4 min-h-12 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-black text-gray-800 dark:text-white">
                                            Email
                                        </label>

                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full mt-2 border border-cyan-900/10 bg-slate-50/90 dark:bg-slate-800 rounded-2xl p-4 min-h-12 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="font-black text-gray-800 dark:text-white">
                                            Senha atual
                                        </label>

                                        <input
                                            type="password"
                                            value={senhaAtual}
                                            onChange={(e) => setSenhaAtual(e.target.value)}
                                            placeholder="Somente se for trocar senha"
                                            className="w-full mt-2 border border-cyan-900/10 bg-slate-50/90 dark:bg-slate-800 rounded-2xl p-4 min-h-12 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="font-black text-gray-800 dark:text-white">
                                            Nova senha
                                        </label>

                                        <input
                                            type="password"
                                            value={novaSenha}
                                            onChange={(e) => setNovaSenha(e.target.value)}
                                            placeholder="Nova senha"
                                            className="w-full mt-2 border border-cyan-900/10 bg-slate-50/90 dark:bg-slate-800 rounded-2xl p-4 min-h-12 font-medium outline-none transition focus:border-cyan-600 focus:bg-white dark:border-cyan-300/10 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={carregando}
                                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-black py-5 rounded-2xl text-xl shadow-xl transition"
                                >
                                    {carregando ? "Salvando..." : "Salvar alterações"}
                                </button>

                            </form>
                        </div>

                        {/* ZONA DE PERIGO */}
                        <div className="border-t border-gray-100 dark:border-slate-800 pt-8">
                            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-3xl p-6">
                                <h3 className="text-2xl font-black text-red-600 dark:text-red-400">
                                    Zona de Perigo
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 font-semibold">
                                    Ao apagar sua conta, todos os seus dados, anúncios e favoritos cadastrados serão permanentemente excluídos.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setMostrarModalDelete(true)}
                                    className="mt-6 bg-red-600 hover:bg-red-700 text-white font-black px-6 py-4 rounded-2xl shadow-lg transition"
                                >
                                    🗑️ Excluir minha conta
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                <section className="grid lg:grid-cols-2 gap-8 mt-8">

                    <div className="future-card rounded-[40px] p-8">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-8">
                            Meus negócios
                        </h2>

                        {negocios.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-300">
                                Nenhum negócio cadastrado.
                            </p>
                        )}

                        <div className="space-y-5">
                            {negocios.map((negocio) => (
                                <div
                                    key={negocio.id_negocio}
                                    className="rounded-3xl border border-cyan-900/10 dark:border-cyan-300/10 p-6"
                                >
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                        {negocio.nome}
                                    </h3>

                                    <p className="text-gray-500 dark:text-gray-300 mt-2">
                                        {negocio.descricao || "Sem descrição"}
                                    </p>

                                    <a
                                        href={`/negocio/${negocio.id_negocio}`}
                                        className="mt-5 inline-block bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-2xl font-black"
                                    >
                                        Ver negócio
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="future-card rounded-[40px] p-8">
                        <h2 className="text-4xl font-black text-red-500 mb-8">
                            ♥ Favoritos
                        </h2>

                        {favoritos.length === 0 && (
                            <p className="text-gray-500 dark:text-gray-300">
                                Nenhum favorito salvo.
                            </p>
                        )}

                        <div className="space-y-5">
                            {favoritos.map((favorito) => (
                                <div
                                    key={favorito.id_favorito}
                                    className="rounded-3xl border border-cyan-900/10 dark:border-cyan-300/10 overflow-hidden"
                                >
                                    <div className="h-44 overflow-hidden">
                                        {favorito.negocio?.fotos?.length > 0 ? (
                                            <img
                                                src={favorito.negocio.fotos[0].url}
                                                alt={favorito.negocio.nome}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-7xl">
                                                ♥
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                            {favorito.negocio?.nome}
                                        </h3>

                                        <p className="text-gray-500 dark:text-gray-300 mt-2">
                                            {favorito.negocio?.descricao || "Sem descrição"}
                                        </p>

                                        <a
                                            href={`/negocio/${favorito.negocio?.id_negocio}`}
                                            className="mt-5 inline-block bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-black"
                                        >
                                            Ver favorito
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </section>

            </div>

            {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
            {mostrarModalDelete && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-[35px] p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-slate-800 text-center">
                        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 text-4xl flex items-center justify-center mx-auto mb-4">
                            ⚠️
                        </div>

                        <h3 className="text-3xl font-black text-gray-900 dark:text-white">
                            Excluir conta?
                        </h3>

                        <p className="text-gray-500 dark:text-gray-300 font-semibold text-base mt-3">
                            Tem certeza de que deseja apagar a conta de <strong className="text-gray-800 dark:text-white">{usuario?.nome}</strong>? Esta ação é irreversível.
                        </p>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => setMostrarModalDelete(false)}
                                disabled={deletando}
                                className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 text-gray-700 dark:text-gray-200 font-black py-4 rounded-2xl transition"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={apagarConta}
                                disabled={deletando}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
                            >
                                {deletando ? "Excluindo..." : "Sim, excluir"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    )
}