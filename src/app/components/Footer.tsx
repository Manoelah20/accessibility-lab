"use client";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900"
              aria-hidden="true"
            >
              A11Y
            </span>
            <span className="text-sm font-bold text-[var(--foreground)]">
              Accessibility Lab
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Laboratório prático de auditoria e correção de acessibilidade digital.
          </p>
        </div>

        <nav
          aria-label="Links de referência de acessibilidade"
          className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[var(--text-muted)]"
        >
          <a
            href="https://www.w3.org/WAI/standards-guidelines/wcag/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--foreground)] hover:underline"
          >
            Diretrizes WCAG 2.2
          </a>
          <span>•</span>
          <a
            href="https://github.com/dequelabs/axe-core"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--foreground)] hover:underline"
          >
            Axe-core
          </a>
          <span>•</span>
          <a
            href="https://playwright.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-[var(--foreground)] hover:underline"
          >
            Playwright
          </a>
        </nav>
      </div>
    </footer>
  );
}
