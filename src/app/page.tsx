"use client";

import { useState } from "react";
import type { AuditResult, Violation } from "@/types/audit";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AuditStatus from "./components/AuditStatus";
import ImpactSummary from "./components/ImpactSummary";
import ImpactFilters from "./components/ImpactFilters";
import ViolationSection from "./components/ViolationSection";
import Footer from "./components/Footer";

export default function Page() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [impactFilter, setImpactFilter] = useState<Violation["impact"] | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredViolations = violations.filter((violation) => {
    const matchesImpact =
      impactFilter === "all" || violation.impact === impactFilter;

    if (!matchesImpact) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    return (
      violation.id.toLowerCase().includes(q) ||
      violation.help.toLowerCase().includes(q) ||
      violation.description.toLowerCase().includes(q) ||
      violation.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

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

  async function handleSubmit(url: string) {
    setMessage("");
    setError("");
    setViolations([]);
    setAuditResult(null);
    setSearchQuery("");
    setImpactFilter("all");
    setLoading(true);
    setMessage("Analisando página com Playwright e Axe-core...");

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
      setMessage(`✓ ${data.message || "Análise concluída com sucesso."}`);
    } catch {
      setMessage("");
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero
          onSubmit={handleSubmit}
          loading={loading}
          message={message}
          error={error}
        />

        {auditResult && (
          <section
            aria-labelledby="results-title"
            className="mx-auto max-w-4xl px-6 pb-20"
          >
            <div className="border-b border-[var(--border)] pb-4">
              <h2
                id="results-title"
                className="text-2xl font-extrabold tracking-tight text-[var(--foreground)]"
              >
                Relatório de Auditoria
              </h2>
            </div>

            <AuditStatus
              auditResult={auditResult}
              violationsCount={violations.length}
              criticalCount={criticalCount}
              seriousCount={seriousCount}
            />

            <ImpactSummary
              criticalCount={criticalCount}
              seriousCount={seriousCount}
              moderateCount={moderateCount}
              minorCount={minorCount}
              violationsCount={violations.length}
            />

            {violations.length > 0 && (
              <>
                <ImpactFilters
                  impactFilter={impactFilter}
                  filteredViolationsCount={filteredViolations.length}
                  totalViolations={violations}
                  searchQuery={searchQuery}
                  onFilterChange={setImpactFilter}
                  onSearchChange={setSearchQuery}
                />

                <div
                  className="mt-4 flex items-center justify-between text-xs text-[var(--text-muted)]"
                  aria-live="polite"
                >
                  <p>
                    Exibindo{" "}
                    <span className="font-bold text-[var(--foreground)]">
                      {filteredViolations.length}
                    </span>{" "}
                    de{" "}
                    <span className="font-bold text-[var(--foreground)]">
                      {violations.length}
                    </span>{" "}
                    {violations.length === 1 ? "violação" : "violações"}
                    {impactFilter !== "all" && (
                      <span>
                        {" "}• impacto:{" "}
                        <strong className="text-[var(--foreground)]">
                          {impactFilter}
                        </strong>
                      </span>
                    )}
                    {searchQuery.trim() && (
                      <span>
                        {" "}• busca:{" "}
                        <strong className="text-[var(--foreground)]">
                          &quot;{searchQuery}&quot;
                        </strong>
                      </span>
                    )}
                  </p>
                </div>

                <ViolationSection
                  violations={violations}
                  impactFilter={impactFilter}
                  searchQuery={searchQuery}
                />
              </>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}