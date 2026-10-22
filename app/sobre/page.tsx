import Reveal from "../../components/Reveal"

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-orange-50 dark:bg-slate-950 transition-colors">

      <section className="bg-gradient-to-br from-orange-700 to-orange-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">

          <p className="text-orange-200 font-bold uppercase tracking-widest text-sm">
            Institucional
          </p>

          <h1 className="text-5xl md:text-6xl font-black mt-4">
            Sobre o Lá da Vendinha
          </h1>

          <p className="max-w-3xl text-orange-100 text-lg md:text-xl mt-6 leading-relaxed">
            Uma plataforma criada para aproximar pessoas e negócios,
            facilitando o acesso ao comércio local.
          </p>

        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-2 gap-8">

          <Reveal>
          <div className="lift bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-slate-800 text-orange-600 flex items-center justify-center text-2xl font-black mb-6">
              🎯
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Nosso objetivo
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
              O Lá da Vendinha busca facilitar a descoberta de negócios,
              produtos e serviços locais, criando uma experiência simples
              para consumidores e empreendedores.
            </p>
          </div>
          </Reveal>

          <Reveal delay={90}>
          <div className="lift bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-slate-800 text-orange-600 flex items-center justify-center text-2xl font-black mb-6">
              🏪
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Comércio local
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
              A plataforma foi pensada para dar visibilidade aos negócios
              da região e aproximá-los das pessoas que procuram produtos
              e serviços próximos.
            </p>
          </div>
          </Reveal>

          <Reveal delay={60}>
          <div className="lift bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-slate-800 text-orange-600 flex items-center justify-center text-2xl font-black mb-6">
              💻
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Tecnologia
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
              O projeto utiliza tecnologias de desenvolvimento web para
              oferecer recursos de cadastro, pesquisa, avaliação,
              gerenciamento de negócios e produtos.
            </p>
          </div>
          </Reveal>

          <Reveal delay={150}>
          <div className="lift bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-slate-800 text-orange-600 flex items-center justify-center text-2xl font-black mb-6">
              🎓
            </div>

            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              Projeto educacional
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
              O Lá da Vendinha é desenvolvido no contexto educacional
              do SENAI, colocando em prática conhecimentos de análise,
              desenvolvimento e engenharia de software.
            </p>
          </div>
          </Reveal>

        </div>

        <Reveal>
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl p-8 md:p-10 text-white shadow-lg">
          <h2 className="text-3xl font-black">
            Lá da Vendinha
          </h2>

          <p className="mt-4 text-orange-50 leading-relaxed max-w-4xl">
            A proposta é utilizar a tecnologia como uma ferramenta para
            conectar a comunidade ao comércio local, tornando mais fácil
            encontrar, conhecer e valorizar os negócios da região.
          </p>
        </div>
        </Reveal>

      </section>

    </main>
  )
}
