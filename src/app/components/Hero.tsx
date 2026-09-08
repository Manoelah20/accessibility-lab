"use client";

import { FormEvent, useState } from "react";

interface HeroProps {
  onSubmit: (url: string) => Promise<void>;
  loading: boolean;
  message: string;
  error: string;
}

export default function Hero({ onSubmit, loading, message, error }: HeroProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!url.trim()) return;
    await onSubmit(url.trim());
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrl(presetUrl);
    onSubmit(presetUrl);
  };

  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center sm:py-24"
    >
      <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] shadow-xs">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" aria-hidden="true" />
        Auditoria de acessibilidade - WCAG 2.1 / 2.2
      </span>

      <h1
        id="hero-title"
        className="max-w-3xl text-4xl font-extrabold tracking-tight text-[var(--foreground)] sm:text-4xl sm:leading-tight"
      >
        Analise páginas. Entenda os problemas. <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Aprenda a corrigir.
        </span>
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
        O <strong>Accessibility Lab</strong> usa <strong>Axe-core</strong> e <strong>Playwright</strong> para encontrar problemas de acessibilidade, mostrar o impacto de cada violação e indicar como corrigi-la.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
        aria-label="Iniciar auditoria de acessibilidade"
      >
        <div className="flex-1 text-left">
          <label
            htmlFor="url"
            className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
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
            disabled={loading}
            className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--foreground)] shadow-xs outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="inline-flex h-12 items-center justify-center gap-2 self-end rounded-xl bg-[var(--primary)] px-6 font-semibold text-white shadow-sm transition hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
        >
          {loading ? (
            <>
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Analisando...</span>
            </>
          ) : (
            <>
              <span>Analisar página</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </form>

      {/* Atalhos Rápidos / Presets */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="font-medium text-[var(--text-muted)]">Testar uma página:</span>
        <button
          type="button"
          onClick={() => handleSelectPreset("http://localhost:3000/test-page")}
          disabled={loading}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 font-medium text-[var(--foreground)] transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 cursor-pointer"
        >🧪 Página com problemas
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset("http://localhost:3000/test-page-ok")}
          disabled={loading}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 font-medium text-[var(--foreground)] transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-50 cursor-pointer"
        >
          ✨ Páginas sem violaçõess
        </button>

        <button
          type="button"
          onClick={() => handleSelectPreset("https://example.com")}
          disabled={loading}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 font-medium text-[var(--foreground)] transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50 cursor-pointer"
        >✨ Página de exemplo
        </button>
      </div>

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800"
        >
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800"
        >
          <span aria-hidden="true">⚠️</span>
          <span>{error}</span>
        </div>
      )}
    </section>
  );
}