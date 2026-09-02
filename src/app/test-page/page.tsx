import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página de teste de acessibilidade",
};

export default function TestPage() {
  return (
    <main className="min-h-screen bg-white p-8 text-gray-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">
          Página de teste de acessibilidade
        </h1>

        <p className="mt-4">
          Esta página contém violações propositalmente inseridas para validar
          o funcionamento do Accessibility Lab.
        </p>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Imagem sem texto alternativo
          </h2>

          <img
            src="/test-image.jpg"
            className="mt-4 h-40 w-40 object-cover"
          />
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Formulário com problema de acessibilidade
          </h2>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Digite seu nome"
              className="rounded border border-gray-300 p-3"
            />
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Botão sem nome acessível
          </h2>

          <button
            type="button"
            className="mt-4 rounded bg-gray-200 px-4 py-2"
          >
            <span aria-hidden="true">→</span>
          </button>
        </section>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">
            Link sem contexto
          </h2>

          <a href="#" className="mt-4 block text-blue-600">
            Clique aqui
          </a>
        </section>
      </div>
    </main>
  );
}

