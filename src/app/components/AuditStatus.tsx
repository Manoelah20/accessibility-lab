"use client";

import { useState } from "react";
import type { AuditResult } from "../../types/audit";
import { generateMarkdownReport, calculateAccessibilityScore } from "../../lib/audit-utils";

interface AuditStatusProps {
  auditResult: AuditResult;
  violationsCount: number;
  criticalCount: number;
  seriousCount: number;
}

export default function AuditStatus({
  auditResult,
  violationsCount,
  criticalCount,
  seriousCount,
}: AuditStatusProps) {
  const [copied, setCopied] = useState(false);

  const isApproved = violationsCount === 0;
  const isCritical = criticalCount > 0 || seriousCount > 0;
  const score = auditResult.score ?? calculateAccessibilityScore(auditResult.violations);

  const handleCopyMarkdown = async () => {
    try {
      const markdown = generateMarkdownReport(auditResult);
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditResult, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `auditoria-acessibilidade-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getScoreColor = (value: number) => {
    if (value >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-300";
    if (value >= 70) return "text-yellow-700 bg-yellow-50 border-yellow-300";
    return "text-red-700 bg-red-50 border-red-300";
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Detalhes da Página e Score */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <span className="inline-block rounded-md bg-[var(--surface-muted)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Página auditada
          </span>
          <h3 className="text-xl font-bold text-[var(--foreground)]">
            {auditResult.title || "Sem título"}
          </h3>
          <p className="break-all font-mono text-xs text-[var(--text-muted)]">
            {auditResult.url}
          </p>
        </div>

        {/* Score de Acessibilidade */}
        <div className="flex items-center gap-4 border-t border-[var(--border)] pt-4 sm:border-t-0 sm:pt-0">
          <div
            className={`flex flex-col items-center justify-center rounded-2xl border px-5 py-3 text-center shadow-xs ${getScoreColor(
              score,
            )}`}
            aria-label={`Score de acessibilidade: ${score} de 100`}
          >
            <span className="text-3xl font-extrabold tracking-tight">
              {score}
              <span className="text-sm font-semibold opacity-70">/100</span>
            </span>
            <span className="mt-0.5 text-xs font-bold uppercase tracking-wider">
              Score A11Y
            </span>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-xs transition hover:bg-[var(--surface-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
              title="Copiar relatório em Markdown para issues ou PRs"
            >
              {copied ? (
                <>
                  <span aria-hidden="true">✓</span>
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">📋</span>
                  <span>Copiar Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-xs transition hover:bg-[var(--surface-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
              title="Baixar dados completos da auditoria em formato JSON"
            >
              <span aria-hidden="true">💾</span>
              <span>Baixar JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Banner de Status */}
      <div
        className={`rounded-2xl border p-5 ${isApproved
          ? "border-emerald-200 bg-emerald-50/80"
          : isCritical
            ? "border-red-200 bg-red-50/80"
            : "border-yellow-200 bg-yellow-50/80"
          }`}
        role="status"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden="true">
            {isApproved ? "✅" : isCritical ? "🚨" : "⚠️"}
          </span>
          <div>
            <h4
              className={`text-base font-bold ${isApproved
                ? "text-emerald-900"
                : isCritical
                  ? "text-red-900"
                  : "text-yellow-900"
                }`}
            >
              {isApproved
                ? "Auditoria concluída sem violações"
                : isCritical
                  ? "Correção prioritária necessária"
                  : "Atenção necessária"}
            </h4>
            <p
              className={`mt-1 text-sm leading-relaxed ${isApproved
                ? "text-emerald-800"
                : isCritical
                  ? "text-red-800"
                  : "text-yellow-800"
                }`}
            >
              {isApproved
                ? "A análise com axe-core não encontrou violações automatizadas nesta página. Ainda assim, testes manuais com teclado e leitores de tela são importantes para avaliar a acessibilidade de forma mais completa."
                : isCritical
                  ? `Foram encontradas ${violationsCount} violações, incluindo ${criticalCount} críticas e ${seriousCount} sérias. Comece por essas falhas, pois elas podem criar barreiras importantes para o uso da página.`
                  : `Foram encontradas ${violationsCount} violações de menor impacto. Elas também devem ser corrigidas para melhorar a experiência e a acessibilidade da página.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}