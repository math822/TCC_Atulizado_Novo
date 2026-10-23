import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

export default function PoliticaPrivacidadePage() {
  return (
    <main className="min-h-screen text-slate-950 dark:text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-cyan-900/10 px-4 py-16 dark:border-cyan-300/10 sm:px-6">
        <div className="future-grid pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl">
          <span className="section-label">● Institucional</span>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Política de Privacidade</h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
            Informações sobre o tratamento de dados na plataforma Lá da Vendinha.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="future-card space-y-10 rounded-3xl p-8 md:p-12">
          <section>
            <h2 className="text-2xl font-black">1. Objetivo</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              Esta política apresenta, de forma geral, como as informações
              fornecidas pelos usuários podem ser utilizadas dentro da
              plataforma Lá da Vendinha.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">2. Informações cadastradas</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              Durante o uso da plataforma, podem ser fornecidas informações
              necessárias para criação de conta, gerenciamento de perfil,
              cadastro de negócios, produtos, avaliações, mensagens e outras
              funcionalidades disponíveis.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">3. Utilização das informações</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              As informações são utilizadas para permitir o funcionamento
              dos recursos da plataforma, como autenticação, gerenciamento
              de contas, cadastro de negócios e interação entre usuários.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">4. Segurança</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              O projeto busca aplicar boas práticas de desenvolvimento e
              segurança para proteger as informações armazenadas e reduzir
              riscos relacionados ao acesso indevido.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">5. Compartilhamento</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              As informações dos usuários não devem ser utilizadas para
              finalidades diferentes das necessárias ao funcionamento
              da plataforma, observadas as regras aplicáveis ao projeto.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black">6. Alterações</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">
              Esta política pode ser atualizada conforme o desenvolvimento
              do projeto e a evolução das funcionalidades da plataforma.
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
