"use client";

import { FormEvent, useState } from "react";

type Violation = {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor" | null;
  help: string;
  description: string;
  helpUrl: string;
  tags: string[];
  nodes: {
    html: string;
    target: string[];
  }[];
};

type AuditResult = {
  title: string;
  url: string;
  violations: Violation[];
  message?: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const criticalCount = violations.filter(
    (violation) => violation.impact === "critical",
  ).length;

  const seriousCount = violations.filter(
    (violation) => violation.impact === "serious",
  ).length;

  const moderateCount = violations.filter(
    (violation) => violation.impact === "moderate",
  ).length;

  const minorCount = violations.filter(
    (violation) => violation.impact === "minor",
  ).length;

function getCategory(violation: Violation): string {
  const tags = violation.tags.map((tag) => tag.toLowerCase());

  // Boas práticas têm prioridade sobre outras categorias.
  if (tags.some((tag) => tag.startsWith("best-practice"))) {
    return "Boas práticas";
  }

  // Perceptível
  if (
    tags.some(
      (tag) =>
        tag.includes("perceivable") ||
        tag.includes("non-text-content") ||
        tag.includes("text-alternatives") ||
        tag.includes("contrast") ||
        tag.includes("adaptable"),
    )
  ) {
    return "Perceptível";
  }

  // Operável
  if (
    tags.some(
      (tag) =>
        tag.includes("operable") ||
        tag.includes("keyboard") ||
        tag.includes("navigation") ||
        tag.includes("timing") ||
        tag.includes("focus"),
    )
  ) {
    return "Operável";
  }

  // Compreensível
  if (
    tags.some(
      (tag) =>
        tag.includes("understandable") ||
        tag.includes("language") ||
        tag.includes("predictable") ||
        tag.includes("input"),
    )
  ) {
    return "Compreensível";
  }

  // Robusto
  if (
    tags.some(
      (tag) =>
        tag.includes("robust") ||
        tag.includes("name-role-value") ||
        tag.includes("aria"),
    )
  ) {
    return "Robusto";
  }

  return "Outros";
}

  function getCategoryDescription(category: string): string {
    switch (category) {
      case "Perceptível":
        return "Informações e componentes que precisam ser apresentados de forma que diferentes pessoas possam percebê-los.";

      case "Operável":
        return "Componentes e navegação precisam ser utilizáveis por diferentes formas de interação.";

      case "Compreensível":
        return "Informações e comportamentos da interface precisam ser claros e previsíveis.";

      case "Robusto":
        return "O conteúdo precisa funcionar de forma confiável com diferentes tecnologias assistivas.";

      case "Boas práticas":
        return "Recomendações que ajudam a melhorar a qualidade e a acessibilidade da implementação.";

      default:
        return "Outros problemas identificados pela análise automatizada.";
    }
  }

  function getWcagCriteria(tags: string[]): string[] {
  return tags
    .filter((tag) => /^wcag\d+$/.test(tag))
    .map((tag) => {
      const number = tag.replace("wcag", "");

      if (number === "111") {
        return "WCAG 1.1.1 — Conteúdo não textual";
      }

      if (number === "121") {
        return "WCAG 1.2.1 — Apenas áudio e apenas vídeo";
      }

      if (number === "131") {
        return "WCAG 1.3.1 — Informações e relações";
      }

      if (number === "132") {
        return "WCAG 1.3.2 — Sequência com significado";
      }

      if (number === "141") {
        return "WCAG 1.4.1 — Uso da cor";
      }

      if (number === "143") {
        return "WCAG 1.4.3 — Contraste mínimo";
      }

      if (number === "211") {
        return "WCAG 2.1.1 — Teclado";
      }

      if (number === "212") {
        return "WCAG 2.1.2 — Sem bloqueio de teclado";
      }

      if (number === "241") {
        return "WCAG 2.4.1 — Ignorar blocos";
      }

      if (number === "242") {
        return "WCAG 2.4.2 — Título da página";
      }

      if (number === "243") {
        return "WCAG 2.4.3 — Ordem do foco";
      }

      if (number === "244") {
        return "WCAG 2.4.4 — Finalidade do link";
      }

      if (number === "412") {
        return "WCAG 4.1.2 — Nome, função e valor";
      }

      return `WCAG ${number} — Critério relacionado`;
    });
}

  function getImpactClasses(impact: Violation["impact"]): string {
    switch (impact) {
      case "critical":
        return "border-red-200 bg-red-50 text-red-700";

      case "serious":
        return "border-orange-200 bg-orange-50 text-orange-700";

      case "moderate":
        return "border-yellow-200 bg-yellow-50 text-yellow-700";

      case "minor":
        return "border-blue-200 bg-blue-50 text-blue-700";

      default:
        return "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setViolations([]);
    setAuditResult(null);
    setLoading(true);
    setMessage("Analisando...");

    try {
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
        setError(data.error || "Não foi possível analisar essa página.");
        setViolations([]);
        return;
      }

      setViolations(data.violations || []);
      setAuditResult(data);
      setMessage(`✓ ${data.message || "Análise concluída."}`);
    } catch {
      setMessage("");
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  const categories = [
    "Perceptível",
    "Operável",
    "Compreensível",
    "Robusto",
    "Boas práticas",
    "Outros",
  ];

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
              disabled={loading}
              className="h-12 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--foreground)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 self-end rounded-lg bg-[var(--primary)] px-6 font-medium text-white transition hover:bg-[var(--primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Analisando..." : "Analisar página"}
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

        {auditResult && (
          <section
            aria-labelledby="results-title"
            className="mt-12 w-full max-w-4xl text-left"
          >
            <h2
              id="results-title"
              className="text-2xl font-semibold text-[var(--foreground)]"
            >
              Resultados da auditoria
            </h2>

            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                Página auditada
              </p>

              <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
                {auditResult.title || "Sem título"}
              </p>

              <p className="mt-1 break-all text-sm text-[var(--text-muted)]">
                {auditResult.url}
              </p>
            </div>

            <p className="mt-4 text-[var(--text-muted)]">
              Foram encontradas {violations.length} violações de acessibilidade.
            </p>

            {violations.length === 0 && (
              <div
                className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6"
                role="status"
              >
                <p className="text-lg font-semibold text-green-800">
                  ✓ Nenhuma violação de acessibilidade foi encontrada
                </p>

                <p className="mt-2 text-sm leading-6 text-green-700">
                  A análise automatizada não identificou problemas de
                  acessibilidade nesta página.
                </p>
              </div>
            )}

            {violations.length > 0 && (
              <>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-2xl font-semibold text-red-700">
                      {criticalCount}
                    </p>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-red-700">
                      Critical
                    </p>
                  </div>

                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <p className="text-2xl font-semibold text-orange-700">
                      {seriousCount}
                    </p>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                      Serious
                    </p>
                  </div>

                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-2xl font-semibold text-yellow-700">
                      {moderateCount}
                    </p>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-yellow-700">
                      Moderate
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-2xl font-semibold text-blue-700">
                      {minorCount}
                    </p>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      Minor
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-10">
                  {categories.map((category) => {
                    const categoryViolations = violations.filter(
                      (violation) => getCategory(violation) === category,
                    );

                    if (categoryViolations.length === 0) {
                      return null;
                    }

                    const categoryId = `category-${category
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`;

                    return (
                      <section
                        key={category}
                        aria-labelledby={categoryId}
                      >
                        <div className="mb-4 border-b border-[var(--border)] pb-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                              <h3
                                id={categoryId}
                                className="text-xl font-semibold text-[var(--foreground)]"
                              >
                                {category}
                              </h3>

                              <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                                {getCategoryDescription(category)}
                              </p>
                            </div>

                            <span className="text-sm font-medium text-[var(--text-muted)]">
                              {categoryViolations.length}{" "}
                              {categoryViolations.length === 1
                                ? "violação"
                                : "violações"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {categoryViolations.map((violation) => (
                            <article
                              key={violation.id}
                              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6"
                            >
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                                    Regra
                                  </p>

                                  <h4 className="mt-1 text-lg font-semibold text-[var(--foreground)]">
                                    {violation.help}
                                  </h4>
                                </div>

                                <span
                                  className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase ${getImpactClasses(
                                    violation.impact,
                                  )}`}
                                >
                                  {violation.impact ?? "unknown"}
                                </span>
                              </div>

  <div className="mt-5">
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-sm font-semibold text-[var(--foreground)]">
      Categoria:
    </span>

    <span className="rounded-full border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
      {getCategory(violation)}
    </span>
  </div>

  {violation.tags.length > 0 && (
    <div className="mt-3">
      <p className="text-sm font-semibold text-[var(--foreground)]">
        Tags
      </p>
      
<div className="mt-2 flex flex-wrap gap-2">
  {violation.tags.map((tag) => (
    <span
      key={tag}
      className="inline-flex rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--text-muted)]"
    >
      {tag}
    </span>
  ))}
</div> 
    </div>
  )}

{getWcagCriteria(violation.tags).length > 0 && (
  <div className="mt-4">
    <p className="text-sm font-semibold text-[var(--foreground)]">
      Critérios WCAG relacionados
    </p>

    <div className="mt-2 space-y-2">
      {getWcagCriteria(violation.tags).map((criterion) => (
        <div
          key={criterion}
          className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--text-muted)]"
        >
          {criterion}
        </div>
      ))}
    </div>
  </div>
)}

  <div className="mt-5">
    <p className="text-sm font-semibold text-[var(--foreground)]">
      Descrição
    </p>

    <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">
      {violation.description}
    </p>
  </div>
</div>                                

                              {violation.nodes.map((node, index) => (
                                <div
                                  key={`${violation.id}-${index}`}
                                  className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4"
                                >
                                  <p className="text-sm font-semibold text-[var(--foreground)]">
                                    Elemento afetado
                                  </p>

                                  <pre className="mt-2 overflow-x-auto rounded-md bg-[var(--background)] p-3 text-xs leading-5 text-[var(--foreground)]">
                                    <code>{node.html}</code>
                                  </pre>

                                  <p className="mt-4 text-sm font-semibold text-[var(--foreground)]">
                                    Seletor
                                  </p>

                                  <code className="mt-1 block overflow-x-auto text-xs text-[var(--text-muted)]">
                                    {node.target.join(", ")}
                                  </code>
                                </div>
                              ))}

                              <div className="mt-5">
                                <a
                                  href={violation.helpUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sm font-semibold text-[var(--primary)] underline underline-offset-4 hover:text-[var(--primary-hover)]"
                                >
                                  Como corrigir esta violação →
                                </a>
                              </div>
                            </article>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </>
            )}

            <p className="mt-8 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
              A análise automatizada é um apoio técnico e não substitui uma
              avaliação humana de acessibilidade.
            </p>
          </section>
        )}
      </section>
    </main>
  );
}

