"use client"

import Link from "next/link"

export default function Footer() {
  function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const grupos = [
    {
      titulo: "Encontrar",
      links: [
        ["Categorias", "/categorias"],
        ["Negócios", "/negocio"],
        ["Produtos", "/produtos"],
      ],
    },
    {
      titulo: "Minha conta",
      links: [
        ["Entrar", "/login"],
        ["Criar conta", "/cadastro"],
        ["Meu perfil", "/perfil"],
      ],
    },
    {
      titulo: "Para empreendedores",
      links: [
        ["Cadastrar negócio", "/cadastrar-negocio"],
        ["Painel do negócio", "/dashboard"],
        ["Sobre o projeto", "/sobre"],
      ],
    },
  ]

  return (
    <footer className="mt-16 border-t border-cyan-900/10 bg-slate-950 text-white dark:border-cyan-300/10">
      <div className="relative overflow-hidden">
        <div className="future-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3 rounded-2xl" aria-label="Lá da Vendinha — página inicial">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-lg font-black shadow-lg shadow-orange-700/20">LV</span>
                <span className="text-2xl font-black">Lá da Vendinha</span>
              </Link>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                Um jeito simples e seguro de encontrar produtos, serviços e empreendedores da sua região.
              </p>
              <a
                href="mailto:contato@ladavendinha.com"
                className="mt-6 inline-flex min-h-12 items-center rounded-2xl border border-cyan-300/30 px-5 font-bold text-cyan-100 transition hover:bg-cyan-300/10"
              >
                ✉ contato@ladavendinha.com
              </a>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-lg font-black">Precisa de ajuda?</p>
              <p className="mt-2 text-base leading-relaxed text-slate-300">
                Use as categorias ou a busca no topo para encontrar o que procura. Tudo foi organizado para funcionar bem no celular e no computador.
              </p>
              <Link href="/sobre" className="mt-5 inline-flex min-h-11 items-center font-black text-orange-300 hover:text-orange-200">
                Conheça o projeto →
              </Link>
            </div>
          </div>

          <nav aria-label="Links do rodapé" className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
            {grupos.map((grupo) => (
              <div key={grupo.titulo}>
                <h2 className="text-lg font-black text-white">{grupo.titulo}</h2>
                <ul className="mt-4 space-y-3">
                  {grupo.links.map(([texto, href]) => (
                    <li key={href}>
                      <Link href={href} className="link-underline inline-flex min-h-10 items-center text-base text-slate-300 transition hover:text-cyan-200">
                        {texto}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="grid gap-8 border-t border-white/10 py-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-lg font-black text-white">App para celular</h2>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-slate-300">
                Baixe o Lá da Vendinha no seu Android e tenha o mural da sua região sempre na tela inicial.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  href="/LaDaVendinha.apk"
                  download
                  className="press inline-flex min-h-12 items-center gap-2 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 px-6 font-black text-white shadow-lg shadow-orange-700/20 transition hover:from-orange-600 hover:to-orange-800"
                >
                  ⬇ Baixar para Android
                </a>
                <span className="text-sm text-slate-400">Arquivo .apk · ~5 MB · só para celular Android</span>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-base font-black text-white">Como instalar</p>
              <ol className="mt-3 space-y-2 text-base leading-relaxed text-slate-300">
                <li>1. Toque em <span className="font-bold text-orange-300">Baixar para Android</span> no celular.</li>
                <li>2. Abra o arquivo baixado e autorize <span className="font-bold text-orange-300">instalar apps desconhecidos</span> quando o Android pedir.</li>
                <li>3. Pronto: o app abre direto no mural. Também dá para usar sem instalar, pelo Chrome.</li>
              </ol>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-7 text-base text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Lá da Vendinha.</p>
            <p>Projeto educacional desenvolvido no SENAI.</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={voltarAoTopo}
        className="press fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-xl font-black text-white shadow-xl transition hover:bg-orange-700 sm:bottom-6 sm:right-6"
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
      >
        ↑
      </button>
    </footer>
  )
}
