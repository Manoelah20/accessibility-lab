import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página de teste sem violações",
  description: "Exemplo de página sem violações de acessibilidade em conformidade com as diretrizes WCAG 2.1 AA.",
};

export default function TestPageOk() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-800"
          >
            ← Voltar ao Accessibility Lab
          </Link>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            ✓ 100% Acessível (WCAG AA)
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl flex-1 px-6 py-12">
        <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs sm:p-12">
          <span className="inline-block rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            Demonstração de Boas Práticas
          </span>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Página de teste sem violações
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Esta página foi estruturada especificamente para demonstrar a conformidade completa com os critérios de sucesso do <strong>Axe-core</strong> e da <strong>WCAG 2.1 / 2.2 nível AA</strong>.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                1. Imagens e Mídias Acessíveis
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Imagens informativas possuem texto alternativo claro e imagens decorativas possuem <code>alt=&quot;&quot;</code>.
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-white p-3 border border-slate-200">
                <span className="text-3xl" role="img" aria-label="Ícone de acessibilidade universal">
                  ♿
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Ícone com rótulo semântico</p>
                  <p className="text-xs text-slate-500">Rótulo fornecido via <code>aria-label</code></p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                2. Contraste de Cores Elevado
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Todas as fontes e elementos gráficos excedem a taxa mínima de contraste de 4.5:1 recomendada.
              </p>
              <div className="mt-4 rounded-lg bg-slate-900 p-3 text-white">
                <p className="text-sm font-semibold">Texto Branco sobre Fundo Escuro</p>
                <p className="text-xs text-slate-300">Taxa de contraste superior a 14:1</p>
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              3. Formulário Totalmente Acessível
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Labels associadas explicitamente com <code>htmlFor</code> e instruções vinculadas por <code>aria-describedby</code>.
            </p>

            <form className="mt-6 space-y-5" action="#" method="get">
              <div>
                <label htmlFor="fullname" className="block text-sm font-bold text-slate-800">
                  Nome Completo <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <p id="name-desc" className="mt-0.5 text-xs text-slate-500">
                  Informe seu nome civil completo.
                </p>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  required
                  aria-required="true"
                  aria-describedby="name-desc"
                  placeholder="Ex: Maria da Silva"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div>
                <label htmlFor="user-email" className="block text-sm font-bold text-slate-800">
                  E-mail institucional <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <p id="email-desc" className="mt-0.5 text-xs text-slate-500">
                  Utilizado apenas para confirmação.
                </p>
                <input
                  id="user-email"
                  name="user-email"
                  type="email"
                  required
                  aria-required="true"
                  aria-describedby="email-desc"
                  placeholder="exemplo@organizacao.com"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-900 px-6 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 cursor-pointer"
              >
                Enviar Formulário Acessível
              </button>
            </form>
          </section>
        </article>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        Página de validação técnica do Accessibility Lab • Sem violações registradas
      </footer>
    </div>
  );
}