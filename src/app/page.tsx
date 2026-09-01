"use client";
import {FormEvent, useState} from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setMessage("Enviando...");

    const response = await fetch("/api/audit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage("");
      setError(data.error);
      return;
    }

    setMessage(`✓ ${data.message}`);
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center px-6">
<a
  href="/"
  className="text-lg font-semibold tracking-tight text-[var(--foreground)]"
  aria-label="Accessibility Lab - início"
>
  Accessibility Lab
</a>
        </div>
      </header>
      <section
        aria-labelledby="hero-title"
        className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center sm:py-28"
      >
        <span className="mb-5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm font-medium text-[var(--text-muted)]">
          Auditoria de acessibilidade para a web
        </span>

        <h1
          id="hero-title"
          className="max-w-3xl text-4xl font-semibold tracking-tight text-[var(--foreground)] sm:text-5xl"
        >
          Analise uma página. Entenda os problemas. Decida como corrigir.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
          O Accessibility Lab ajuda desenvolvedores a identificar problemas
          de acessibilidade, entender as evidências e explorar possíveis
          caminhos de correção.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
          aria-label="Iniciar auditoria de acessibilidade"
        >
          <div className="flex-1 text-left">
            <label
              htmlFor="url"
              className="mb-2 block text-sm font-medium text-[var(--foreground)]"
            >
              URL da página
            </label>

            <input
              id="url"
              name="url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://exemplo.com"
              required
              className="h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>

          <button
            type="submit"
            className="h-12 self-end rounded-lg bg-[var(--primary)] px-6 font-medium text-white transition hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
          >
            Analisar página
          </button>
        </form>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className="mt-5 text-sm font-medium text-[var(--success)]"
          >
            {message}
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="mt-5 text-sm font-medium text-[var(--danger)]"
          >
            {error}
          </p>
        )}

        <p className="mt-5 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
          A análise automatizada é um apoio técnico e não substitui uma
          avaliação humana de acessibilidade.
        </p>
      </section>
    </main>
  );
}
