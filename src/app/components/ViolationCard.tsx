"use client";

import { useState } from "react";
import type { Violation } from "../../types/audit";
import {
  getImpactClasses,
  getWcagCriteria,
  getFixGuidance,
  getCategory,
} from "../../lib/audit-utils";

interface ViolationCardProps {
  violation: Violation;
}

export default function ViolationCard({ violation }: ViolationCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedSelectorIndex, setCopiedSelectorIndex] = useState<number | null>(null);
  const [showAllNodes, setShowAllNodes] = useState(false);

  const wcagCriteria = getWcagCriteria(violation.tags);
  const category = getCategory(violation);

  const handleCopyHtml = async (html: string, index: number) => {
    try {
      await navigator.clipboard.writeText(html);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopySelector = async (selector: string, index: number) => {
    try {
      await navigator.clipboard.writeText(selector);
      setCopiedSelectorIndex(index);
      setTimeout(() => setCopiedSelectorIndex(null), 2500);
    } catch {
      // Fallback
    }
  };

  const visibleNodes = showAllNodes
    ? violation.nodes
    : violation.nodes.slice(0, 3);

  return (
    <article
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs transition-shadow hover:shadow-md"
      aria-labelledby={`violation-${violation.id}`}
    >
      {/* Cabeçalho da Violação */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-semibold text-[var(--text-muted)]">
              {violation.id}
            </span>
            <span className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--text-muted)]">
              {category}
            </span>
          </div>

          <h4
            id={`violation-${violation.id}`}
            className="mt-1.5 text-lg font-bold text-[var(--foreground)]"
          >
            {violation.help}
          </h4>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${getImpactClasses(
            violation.impact,
          )}`}
        >
          <span
            className="h-2 w-2 rounded-full bg-current opacity-80"
            aria-hidden="true"
          />
          {violation.impact ?? "unknown"}
        </span>
      </div>

      {/* Descrição e Critérios */}
      <div className="mt-4 space-y-3">
        <p className="text-sm leading-relaxed text-[var(--text-muted)]">
          {violation.description}
        </p>

        {/* Critérios WCAG */}
        {wcagCriteria.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-[var(--foreground)]">
              WCAG:
            </span>
            {wcagCriteria.map((criterion) => (
              <span
                key={criterion}
                className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)]"
              >
                {criterion}
              </span>
            ))}
          </div>
        )}

        {/* Tags adicionais */}
        {violation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {violation.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] font-mono text-[var(--text-muted)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        {/* Guia de Como Corrigir */}
        <div className="mt-4 rounded-xl border border-blue-200/70 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
          <div className="flex items-center gap-2">
            <span aria-hidden="true">🛠️</span>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">
              Como corrigir
            </p>
          </div>

          <p className="mt-1.5 text-sm leading-relaxed text-blue-900 dark:text-blue-200">
            {getFixGuidance(violation)}
          </p>
        </div>
      </div>

      {/* Elementos Afetados */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
            Elementos afetados ({violation.nodes.length})
          </p>
        </div>

        {visibleNodes.map((node, index) => {
          const selectorText = node.target.join(", ");

          return (
            <div
              key={`${violation.id}-${index}`}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/70 p-4"
            >
              {/* Trecho HTML com botão copiar */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  Elemento #{index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopyHtml(node.html, index)}
                  className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-medium text-[var(--text-muted)] transition hover:text-[var(--foreground)] cursor-pointer"
                  title="Copiar código HTML do elemento"
                >
                  {copiedIndex === index ? "✓ HTML Copiado" : "📋 Copiar HTML"}
                </button>
              </div>

              <pre className="mt-2 overflow-x-auto rounded-lg bg-[var(--foreground)] p-3 text-xs leading-relaxed text-[var(--background)]">
                <code>{node.html}</code>
              </pre>

              {/* Seletor CSS com botão copiar */}
              <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1.5 overflow-hidden text-xs">
                  <span className="font-semibold text-[var(--foreground)]">
                    Seletor:
                  </span>
                  <code className="truncate rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                    {selectorText}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopySelector(selectorText, index)}
                  className="inline-flex w-fit items-center gap-1 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] font-medium text-[var(--text-muted)] transition hover:text-[var(--foreground)] cursor-pointer"
                  title="Copiar seletor CSS"
                >
                  {copiedSelectorIndex === index
                    ? "✓ Seletor Copiado"
                    : "📋 Copiar Seletor"}
                </button>
              </div>

              {/* Evidência da falha */}
              {node.failureSummary && (
                <div className="mt-3 rounded-lg border border-red-200/50 bg-red-50/50 p-2.5 text-xs text-red-900 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
                  <span className="font-semibold">Evidência:</span> {node.failureSummary}
                </div>
              )}
            </div>
          );
        })}

        {/* Ver mais elementos se houver > 3 */}
        {violation.nodes.length > 3 && (
          <button
            type="button"
            onClick={() => setShowAllNodes(!showAllNodes)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2 text-xs font-semibold text-[var(--primary)] transition hover:bg-[var(--surface-muted)] cursor-pointer"
          >
            {showAllNodes
              ? "Mostrar menos elementos"
              : `Ver todos os ${violation.nodes.length} elementos afetados`}
          </button>
        )}
      </div>

      {/* Link para Documentação Oficial */}
      <div className="mt-5 border-t border-[var(--border)] pt-4">
        <a
          href={violation.helpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--primary)] underline underline-offset-4 transition hover:text-[var(--primary-hover)]"
        >
          <span>Documentação oficial da regra (Deque / Axe)</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}