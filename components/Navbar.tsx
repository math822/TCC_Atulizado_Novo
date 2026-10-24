"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

interface NavbarProps {
    busca?: string
    setBusca?: (valor: string) => void
}

export default function Navbar({
    busca = "",
    setBusca
}: NavbarProps) {

    const [usuario, setUsuario] = useState<any>(null)
    const [temNotificacao, setTemNotificacao] = useState(true)
    const [naoLidas, setNaoLidas] = useState(0)

    const { resolvedTheme, setTheme } = useTheme()
    const [montado, setMontado] = useState(false)

    const temaEscuro = resolvedTheme === "dark"

    // Carrega usuário ao iniciar
    useEffect(() => {
        setMontado(true)

        const salvo = localStorage.getItem("usuario")

        if (salvo) {
            try {
                setUsuario(JSON.parse(salvo))
            } catch (e) {
                console.error("Erro ao ler usuário", e)
                localStorage.removeItem("usuario")
            }
        }
    }, [])

    // Busca contador de mensagens não lidas quando há usuário logado
    useEffect(() => {
        if (!usuario?.id_usuario) {
            setNaoLidas(0)
            return
        }
        fetch(`/api/chat/conversas?id_usuario=${usuario.id_usuario}`)
            .then((r) => (r.ok ? r.json() : []))
            .then((dados) => {
                if (Array.isArray(dados)) {
                    setNaoLidas(dados.reduce((s: number, c: any) => s + (c.nao_lidas || 0), 0))
                }
            })
            .catch(() => {})
    }, [usuario])

    // Alterna o tema usando o next-themes
    function alternarTema() {
        setTheme(temaEscuro ? "light" : "dark")
    }

    // Sair da conta
    function sair() {
        localStorage.removeItem("usuario")
        setUsuario(null)
        window.location.href = "/"
    }

    return (
        <header className="sticky top-0 z-50 border-b border-cyan-900/10 bg-white/85 shadow-[0_8px_35px_-28px_rgba(8,145,178,0.8)] backdrop-blur-xl transition-colors dark:border-cyan-300/10 dark:bg-slate-950/85">

            <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-x-3 px-4 py-3 sm:flex-nowrap sm:px-6 lg:px-8">

                {/* LOGO */}
                <a
                    href="/"
                    aria-label="Lá da Vendinha — página inicial"
                    className="group flex flex-shrink-0 items-center gap-3 rounded-2xl"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-xl font-black text-white shadow-lg shadow-orange-600/20 transition-transform group-hover:scale-105">
                        LV
                    </div>

                    <span className="hidden text-xl font-black tracking-tight text-slate-950 dark:text-white sm:inline-block">
                        Lá da <span className="text-orange-600">Vendinha</span>
                    </span>
                </a>

                {/* BUSCA */}
                {setBusca && (
                    <div className="order-3 mt-3 basis-full sm:order-none sm:mx-2 sm:mt-0 sm:max-w-md sm:basis-auto flex-1">
                        <div className="relative">
                            <label htmlFor="busca-navegacao" className="sr-only">
                                Buscar lojas, serviços ou produtos
                            </label>
                            <input
                                id="busca-navegacao"
                                type="search"
                                value={busca}
                                onChange={(e) =>
                                    setBusca(e.target.value)
                                }
                                placeholder="Buscar no site..."
                                className="min-h-12 w-full rounded-2xl border border-cyan-900/10 bg-slate-50/90 py-3 pl-12 pr-4 text-base font-semibold text-slate-900 placeholder-slate-500 transition-all focus:border-cyan-600 focus:bg-white focus:outline-none dark:border-cyan-300/10 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400 dark:focus:bg-slate-900"
                            />

                            <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-cyan-700 dark:text-cyan-300">
                                ⌕
                            </span>
                        </div>
                    </div>
                )}

                {/* ÍCONES */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

                    {/* MENSAGENS */}
                    <a
                        href="/mensagens"
                        title="Mensagens"
                        aria-label={naoLidas > 0 ? `Abrir mensagens, ${naoLidas} não lidas` : "Abrir mensagens"}
                        className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-xl text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-cyan-200"
                    >
                        💬
                        {naoLidas > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-[11px] font-black text-white ring-2 ring-white dark:ring-slate-950">
                                {naoLidas > 9 ? "9+" : naoLidas}
                            </span>
                        )}
                    </a>

                    {/* FAVORITOS */}
                    <a
                        href="/#negocios"
                        title="Meus Favoritos"
                        className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-cyan-200"
                    >
                        ❤️
                    </a>

                    {/* NOTIFICAÇÕES */}
                    <button
                        type="button"
                        title="Notificações"
                        aria-label={temNotificacao ? "Abrir notificações, há novidades" : "Abrir notificações"}
                        onClick={() =>
                            setTemNotificacao(false)
                        }
                        className="relative flex h-11 w-11 items-center justify-center rounded-2xl text-xl text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-cyan-200"
                    >
                        🔔

                        {temNotificacao && (
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                        )}
                    </button>

                    {/* TEMA */}
                    <button
                        type="button"
                        onClick={alternarTema}
                        title={
                            !montado
                                ? "Alternar tema"
                                : temaEscuro
                                ? "Mudar para Modo Claro"
                                : "Mudar para Modo Escuro"
                        }
                        aria-label={
                            !montado
                                ? "Alternar entre tema claro e escuro"
                                : temaEscuro
                                ? "Mudar para modo claro"
                                : "Mudar para modo escuro"
                        }
                        className="flex h-11 w-11 items-center justify-center rounded-2xl text-xl text-slate-700 transition hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-cyan-200"
                    >
                        {montado ? (temaEscuro ? "☀️" : "🌙") : ""}
                    </button>

                    {/* DIVISÓRIA */}
                    <div className="h-6 w-[1px] bg-gray-200 dark:bg-slate-700 hidden sm:block" />

                    {/* USUÁRIO LOGADO */}
                    {usuario ? (

                        <div className="flex items-center gap-2">

                            {/* PAINEL DO EMPREENDEDOR */}
                            {(usuario.tipo === "empreendedor" || usuario.tipo === "admin") && (
                                <a
                                    href="/dashboard"
                                    title="Painel do empreendedor"
                                    className="press hidden items-center rounded-full bg-cyan-600 px-4 py-2.5 text-sm font-black text-white transition hover:bg-cyan-700 sm:inline-flex"
                                >
                                    📊 Painel
                                </a>
                            )}

                            {/* PERFIL */}
                            <a
                                href="/perfil"
                                title="Meu perfil"
                                className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-orange-50 dark:bg-slate-800 border border-orange-200 dark:border-slate-700 hover:border-orange-400 transition"
                            >

                                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 max-w-[100px] truncate hidden md:inline-block">
                                    {usuario.nome || "Minha Conta"}
                                </span>

                                {/* FOTO DO PERFIL / GOOGLE */}
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-600 text-white font-black text-sm flex items-center justify-center">

                                    {usuario.foto_perfil ? (

                                        <img
                                            src={usuario.foto_perfil}
                                            alt={`Foto de ${usuario.nome || "usuário"}`}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        usuario.nome
                                            ? usuario.nome[0].toUpperCase()
                                            : "👤"

                                    )}

                                </div>

                            </a>

                            {/* SAIR */}
                            <button
                                type="button"
                                onClick={sair}
                                title="Sair da conta"
                                className="hidden sm:inline-flex items-center bg-white dark:bg-slate-900 text-red-600 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 px-4 py-2.5 rounded-full text-sm font-bold transition-all"
                            >
                                Sair
                            </button>

                        </div>

                    ) : (

                        /* USUÁRIO NÃO LOGADO */
                        <div className="flex items-center gap-2">

                            {/* CRIAR CONTA */}
                            <a
                                href="/cadastro"
                                className="press hidden min-h-11 items-center rounded-2xl border-2 border-orange-600 bg-white px-5 py-2.5 text-base font-bold text-orange-700 transition-all hover:bg-orange-50 dark:bg-slate-950 dark:text-orange-300 dark:hover:bg-slate-800 sm:inline-flex"
                            >
                                Criar conta
                            </a>

                            {/* ENTRAR */}
                            <a
                                href="/login"
                                className="press flex min-h-11 items-center rounded-2xl bg-orange-600 px-5 py-2.5 text-base font-black text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-700"
                            >
                                Entrar
                            </a>

                        </div>
                    )}

                </div>
            </div>
        </header>
    )
}