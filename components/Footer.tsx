"use client"

export default function Footer() {
  function voltarAoTopo() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="mt-16 text-white">

      {/* MENU SUPERIOR */}
      <div className="bg-gray-100 text-gray-900 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-3 py-4 text-sm font-bold">
            <a href="/" className="hover:text-orange-600 transition">
              INÍCIO
            </a>

            <a href="/negocio" className="hover:text-orange-600 transition">
              NEGÓCIOS
            </a>

            <a href="/produtos" className="hover:text-orange-600 transition">
              PRODUTOS
            </a>

            <a
              href="/cadastrar-negocio"
              className="hover:text-orange-600 transition"
            >
              CADASTRE SEU NEGÓCIO
            </a>

            <a href="/perfil" className="hover:text-orange-600 transition">
              MEU PERFIL
            </a>
          </nav>
        </div>
      </div>

      {/* REDES SOCIAIS */}
      <div className="bg-orange-600">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="font-black text-sm">
              Acompanhe o Lá da Vendinha
            </p>

            <div className="flex items-center gap-4">

              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-black text-lg hover:bg-white hover:text-orange-600 hover:scale-110 transition"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-black text-lg hover:bg-white hover:text-orange-600 hover:scale-110 transition"
              >
                ◎
              </a>

              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-black text-lg hover:bg-white hover:text-orange-600 hover:scale-110 transition"
              >
                ▶
              </a>

              <a
                href="#"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center font-black text-lg hover:bg-white hover:text-orange-600 hover:scale-110 transition"
              >
                ◉
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="bg-orange-800">
        <div className="max-w-7xl mx-auto px-6 py-14">

          {/* APRESENTAÇÃO */}
          <div className="grid md:grid-cols-2 gap-10 pb-12 border-b border-orange-600/40">

            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-white text-orange-700 flex items-center justify-center font-black text-xl">
                  LV
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    LÁ DA VENDINHA
                  </h2>

                  <p className="text-orange-200 text-sm">
                    Comércio local mais perto de você
                  </p>
                </div>
              </div>

              <p className="text-orange-100 leading-relaxed max-w-xl">
                Uma plataforma criada para aproximar consumidores,
                empreendedores e negócios locais, facilitando a descoberta
                de produtos e serviços da região.
              </p>

              <p className="text-orange-200 mt-4">
                📍 Campinas - SP
              </p>
            </div>

            <div>
              <h3 className="font-black text-xl mb-4">
                FALE CONOSCO
              </h3>

              <p className="text-orange-100 leading-relaxed">
                Tem alguma dúvida, sugestão ou encontrou algum problema?
                Entre em contato com a equipe do projeto.
              </p>

              <a
                href="mailto:contato@ladavendinha.com"
                className="inline-block mt-5 font-bold text-white hover:text-orange-200 transition"
              >
                ✉ contato@ladavendinha.com
              </a>
            </div>

          </div>

          {/* LINKS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 py-12">

            {/* NAVEGAÇÃO */}
            <div>
              <h4 className="font-black mb-5">
                Navegação
              </h4>

              <div className="space-y-3 text-sm text-orange-100">
                <a
                  href="/"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Início
                </a>

                <a
                  href="/negocio"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Negócios
                </a>

                <a
                  href="/produtos"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Produtos
                </a>
              </div>
            </div>

            {/* CONTA */}
            <div>
              <h4 className="font-black mb-5">
                Minha conta
              </h4>

              <div className="space-y-3 text-sm text-orange-100">
                <a
                  href="/login"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Entrar
                </a>

                <a
                  href="/cadastro"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Criar conta
                </a>

                <a
                  href="/perfil"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Meu perfil
                </a>
              </div>
            </div>

            {/* NEGÓCIOS */}
            <div>
              <h4 className="font-black mb-5">
                Para negócios
              </h4>

              <div className="space-y-3 text-sm text-orange-100">
                <a
                  href="/cadastrar-negocio"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Cadastre seu negócio
                </a>

                <a
                  href="/dashboard"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Dashboard
                </a>
              </div>
            </div>

            {/* INSTITUCIONAL */}
            <div>
              <h4 className="font-black mb-5">
                Institucional
              </h4>

              <div className="space-y-3 text-sm text-orange-100">
                <a
                  href="/sobre"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Sobre o projeto
                </a>

                <a
                  href="/politica-privacidade"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Política de privacidade
                </a>

                <a
                  href="/termos"
                  className="block hover:text-white hover:translate-x-1 transition"
                >
                  Termos de uso
                </a>
              </div>
            </div>

            {/* SENAI */}
            <div>
              <h4 className="font-black mb-5">
                Projeto SENAI
              </h4>

              <p className="text-sm text-orange-100 leading-relaxed">
                Projeto desenvolvido no contexto educacional do SENAI,
                com foco em tecnologia, desenvolvimento de sistemas e
                valorização do comércio local.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* RODAPÉ FINAL */}
      <div className="bg-orange-600">
        <div className="max-w-7xl mx-auto px-6 py-5">

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-center md:text-left">

            <p>
              © 2026 Lá da Vendinha. Todos os direitos reservados.
            </p>

            <p className="font-bold">
              Projeto desenvolvido no SENAI
            </p>

          </div>

        </div>
      </div>

      {/* VOLTAR AO TOPO */}
      <button
        type="button"
        onClick={voltarAoTopo}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-xl font-black text-xl transition hover:scale-110"
        aria-label="Voltar ao topo"
        title="Voltar ao topo"
      >
        ↑
      </button>

    </footer>
  )
}