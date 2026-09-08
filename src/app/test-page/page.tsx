import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página de teste de acessibilidade | Accessibility Lab",
  description: "Página contendo violações intencionais para fins de teste de acessibilidade.",
};

export default function TestPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-800"
          >
            ← Voltar ao Accessibility Lab
          </Link>
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
            ⚠️ Demonstração de Violações
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl flex-1 p-8">
        <div>
          <h1 className="text-3xl font-bold">
            Página de teste de acessibilidade
          </h1>

          <p className="mt-4 text-gray-600">
            Esta página contém violações propositalmente inseridas para validar
            a capacidade de detecção do Accessibility Lab.
          </p>

          <section className="mt-8 rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">
              1. Imagem sem texto alternativo (image-alt)
            </h2>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/test-image.jpg"
              className="mt-4 h-32 w-32 object-cover rounded bg-gray-100"
            />
          </section>

          <section className="mt-8 rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">
              2. Formulário sem label acessível (label)
            </h2>

            <div className="mt-4">
              <input
                type="text"
                placeholder="Digite seu nome (sem label associada)"
                className="w-full rounded border border-gray-300 p-3"
              />
            </div>
          </section>

          <section className="mt-8 rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">
              3. Botão sem nome acessível (button-name)
            </h2>

            <button
              type="button"
              className="mt-4 rounded bg-gray-200 px-4 py-2"
            >
              <span aria-hidden="true">→</span>
            </button>
          </section>

          <section className="mt-8 rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">
              4. Link sem contexto (link-name / ambiguous link)
            </h2>

            <a href="#" className="mt-4 block text-blue-600">
              Clique aqui
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
