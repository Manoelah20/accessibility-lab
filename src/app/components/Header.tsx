"use client";

import Link from "next/link";

export default function Header() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        Pular para o conteúdo principal
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            aria-label="Accessibility Lab - Início"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-slate-100 dark:text-slate-900"
              aria-hidden="true"
            >
              A11Y
            </span>

            <span>
              <span className="block text-base font-semibold tracking-tight text-[var(--foreground)]">
                Accessibility Lab
              </span>
              <span className="hidden text-xs text-[var(--text-muted)] sm:block">
                Auditoria de acessibilidade web (WCAG / Axe)
              </span>
            </span>
          </Link>

          <nav
            aria-label="Navegação secundária"
            className="flex items-center gap-3"
          >
            <Link
              href="/test-page"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
            >
              Demo: Com falhas
            </Link>

            <Link
              href="/test-page-ok"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
            >
              Demo: Acessível
            </Link>

            <div
              className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 sm:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              aria-label="Motor de regras: Axe-core"
            >
              <span
                className="h-2 w-2 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              Axe-core + Playwright
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}