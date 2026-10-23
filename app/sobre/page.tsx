import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Reveal from "../../components/Reveal"

export default function SobrePage() {
  return (
    <main className="min-h-screen text-slate-950 dark:text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-cyan-900/10 px-4 py-16 dark:border-cyan-300/10 sm:px-6 sm:py-20">
        <div className="future-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <span className="section-label">● Institucional</span>
          <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Sobre o <span className="text-gradient">Lá da Vendinha</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">
            Uma plataforma criada para aproximar pessoas e negócios,
            facilitando o acesso ao comércio local.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="future-card hover-rise h-full rounded-3xl p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl font-black text-orange-600 dark:bg-slate-800">
                🎯
              </div>
              <h2 className="text-2xl font-black">Nosso objetivo</h2>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                O Lá da Vendinha busca facilitar a descoberta de negócios,
                produtos e serviços locais, criando uma experiência simples
                para consumidores e empreendedores.
              </p>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="future-card hover-rise h-full rounded-3xl p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-2xl font-black text-orange-600 dark:bg-slate-800">
                🏪
              </div>
              <h2 className="text-2xl font-black">Comércio local</h2>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                A plataforma foi pensada para dar visibilidade aos negócios
                da região e aproximá-los das pessoas que procuram produtos
                e serviços próximos.
              </p>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="future-card hover-rise h-full rounded-3xl p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-2xl font-black text-cyan-700 dark:bg-slate-800 dark:text-cyan-300">
                💻
              </div>
              <h2 className="text-2xl font-black">Tecnologia</h2>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                O projeto utiliza tecnologias de desenvolvimento web para
                oferecer recursos de cadastro, pesquisa, avaliação,
                gerenciamento de negócios, produtos e mensagens.
              </p>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="future-card hover-rise h-full rounded-3xl p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-2xl font-black text-cyan-700 dark:bg-slate-800 dark:text-cyan-300">
                🎓
              </div>
              <h2 className="text-2xl font-black">Projeto educacional</h2>
              <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
                O Lá da Vendinha é desenvolvido no contexto educacional
                do SENAI, colocando em prática conhecimentos de análise,
                desenvolvimento e engenharia de software.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="animate-gradient mt-12 rounded-3xl bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-900 p-8 text-white shadow-lg md:p-10">
            <h2 className="text-3xl font-black">Lá da Vendinha</h2>
            <p className="mt-4 max-w-4xl leading-relaxed text-slate-200">
              A proposta é utilizar a tecnologia como uma ferramenta para
              conectar a comunidade ao comércio local, tornando mais fácil
              encontrar, conhecer e valorizar os negócios da região.
            </p>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  )
}
