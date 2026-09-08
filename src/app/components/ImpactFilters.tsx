"use client";

import type { Violation } from "../../types/audit";
import { IMPACT_FILTERS } from "../../lib/audit-utils";

interface ImpactFiltersProps {
  impactFilter: Violation["impact"] | "all";
  filteredViolationsCount: number;
  totalViolations: Violation[];
  searchQuery: string;
  onFilterChange: (filter: Violation["impact"] | "all") => void;
  onSearchChange: (query: string) => void;
}

export default function ImpactFilters({
  impactFilter,
  totalViolations,
  searchQuery,
  onFilterChange,
  onSearchChange,
}: ImpactFiltersProps) {
  const getFilterCount = (filterValue: Violation["impact"] | "all") => {
    if (filterValue === "all") return totalViolations.length;
    return totalViolations.filter((v) => v.impact === filterValue).length;
  };

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Botões de Filtro por Impacto */}
      <div
        className="flex flex-wrap items-center gap-1.5"
        role="group"
        aria-label="Filtrar violações por impacto"
      >
        {IMPACT_FILTERS.map((filter) => {
          const count = getFilterCount(filter.value as Violation["impact"] | "all");
          const isActive = impactFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onFilterChange(filter.value as Violation["impact"] | "all")}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-xs dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-slate-300 hover:text-[var(--foreground)]"
              }`}
              aria-pressed={isActive}
            >
              <span>{filter.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white dark:bg-black/20 dark:text-slate-900"
                    : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Campo de Busca Textual */}
      <div className="relative w-full sm:w-64">
        <label htmlFor="search-violations" className="sr-only">
          Buscar regras ou palavras-chave
        </label>
        <input
          id="search-violations"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por regra, tag..."
          className="h-9 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-8 pr-3 text-xs text-[var(--foreground)] placeholder-[var(--text-muted)] shadow-xs outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
        />
        <span
          className="pointer-events-none absolute left-2.5 top-2.5 text-xs text-[var(--text-muted)]"
          aria-hidden="true"
        >
          🔍
        </span>
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-2 text-xs text-[var(--text-muted)] hover:text-[var(--foreground)] cursor-pointer"
            aria-label="Limpar busca"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}