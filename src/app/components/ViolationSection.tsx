"use client";

import type { Violation } from "../../types/audit";
import {
  CATEGORIES,
  getImpactPriority,
  getCategory,
  getCategoryDescription,
} from "../../lib/audit-utils";
import ViolationCard from "./ViolationCard";

interface ViolationSectionProps {
  violations: Violation[];
  impactFilter: Violation["impact"] | "all";
  searchQuery: string;
}

export default function ViolationSection({
  violations,
  impactFilter,
  searchQuery,
}: ViolationSectionProps) {
  const query = searchQuery.toLowerCase().trim();

  // Filtra por impacto e por busca de texto
  const filteredViolations = violations.filter((violation) => {
    const matchesImpact =
      impactFilter === "all" || violation.impact === impactFilter;

    if (!matchesImpact) return false;
    if (!query) return true;

    const inId = violation.id.toLowerCase().includes(query);
    const inHelp = violation.help.toLowerCase().includes(query);
    const inDesc = violation.description.toLowerCase().includes(query);
    const inCategory = getCategory(violation).toLowerCase().includes(query);
    const inTags = violation.tags.some((tag) => tag.toLowerCase().includes(query));
    const inNodes = violation.nodes.some(
      (n) =>
        n.html.toLowerCase().includes(query) ||
        n.target.some((t) => t.toLowerCase().includes(query)),
    );

    return inId || inHelp || inDesc || inCategory || inTags || inNodes;
  });

  if (filteredViolations.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-xs">
        <span className="text-3xl" aria-hidden="true">🔍</span>
        <h3 className="mt-2 text-base font-bold text-[var(--foreground)]">
          Nenhuma violação encontrada com os filtros atuais
        </h3>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Tente alterar o filtro de impacto ou ajustar o termo digitado na busca.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-12">
      {CATEGORIES.map((category) => {
        const categoryViolations = filteredViolations
          .filter((violation) => getCategory(violation) === category)
          .sort(
            (a, b) =>
              getImpactPriority(a.impact) - getImpactPriority(b.impact),
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
            className="space-y-4"
          >
            <div className="border-b border-[var(--border)] pb-3">
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3
                    id={categoryId}
                    className="text-xl font-bold tracking-tight text-[var(--foreground)]"
                  >
                    {category}
                  </h3>

                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {getCategoryDescription(category)}
                  </p>
                </div>

                <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                  {categoryViolations.length}{" "}
                  {categoryViolations.length === 1
                    ? "violação"
                    : "violações"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {categoryViolations.map((violation) => (
                <ViolationCard key={violation.id} violation={violation} />
              ))}
            </div>
          </section>
        );
      })}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/50 p-5 text-center">
        <p className="text-xs leading-relaxed text-[var(--text-muted)]">
          <strong>Atenção:</strong> a auditoria automatizada encontra muitas barreiras
          comuns de acessibilidade, mas não identifica todos os problemas.
          Para uma avaliação mais completa, combine os resultados com testes manuais
          usando teclado, leitores de tela e ampliação de tela.
        </p>
      </div>
    </div>
  );
}