import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function TermosPage() {
  return (
    <main className="min-h-screen text-slate-950 dark:text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-cyan-900/10 px-4 py-16 dark:border-cyan-300/10 sm:px-6">
        <div className="future-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <span className="section-label">● Institucional</span>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Termos de Uso</h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
            Regras gerais para utilização da plataforma Lá da Vendinha.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="future-card space-y-10 rounded-3xl p-8 md:p-12">
          <section>
            <h2 className="text-2xl font-black">1. Sobre a plataforma</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              O Lá da Vendinha é uma plataforma desenvolvida para facilitar
              a descoberta de negócios, produtos e serviços locais.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">2. Cadastro</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              O usuário deve fornecer informações verdadeiras e atualizadas
              ao realizar seu cadastro e utilizar os recursos disponíveis
              na plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">3. Cadastro de negócios</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              Usuários responsáveis por negócios devem fornecer informações
              corretas sobre seus estabelecimentos, produtos e serviços.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">4. Conteúdo dos usuários</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              Avaliações, comentários, mensagens, imagens e demais conteúdos enviados
              pelos usuários devem respeitar as regras de utilização da
              plataforma e não devem conter conteúdo ilegal ou inadequado.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">5. Uso adequado</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              A plataforma deve ser utilizada de maneira responsável,
              respeitando os demais usuários e os negócios cadastrados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">6. Alterações</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              Os recursos e funcionalidades da plataforma podem ser
              modificados durante o desenvolvimento do projeto.
            </p>
          </section>

          <div className="border-t border-cyan-900/10 pt-6 dark:border-cyan-300/10">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Última atualização: 2026.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
