"use client";

interface ImpactSummaryProps {
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  violationsCount: number;
}

export default function ImpactSummary({
  criticalCount,
  seriousCount,
  moderateCount,
  minorCount,
  violationsCount,
}: ImpactSummaryProps) {
  if (violationsCount === 0) return null;

  return (
    <div className="mt-6 space-y-4">
      {/* Grade de Impacto */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Critical */}
        <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 transition-all hover:shadow-xs dark:border-red-900/30 dark:bg-red-950/30">
          <div className="flex items-center justify-between">
            <span className="text-2xl" aria-hidden="true">🔴</span>
            <span className="text-2xl font-extrabold text-red-700 dark:text-red-400">
              {criticalCount}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
            Crítico (Critical)
          </p>
          <p className="mt-1 text-xs font-medium text-red-700 dark:text-red-400">
            Bloqueia o uso
          </p>
        </div>

        {/* Serious */}
        <div className="rounded-2xl border border-orange-200 bg-orange-50/60 p-4 transition-all hover:shadow-xs dark:border-orange-900/30 dark:bg-orange-950/30">
          <div className="flex items-center justify-between">
            <span className="text-2xl" aria-hidden="true">🟠</span>
            <span className="text-2xl font-extrabold text-orange-700 dark:text-orange-400">
              {seriousCount}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">
            Sério (Serious)
          </p>
          <p className="mt-1 text-xs font-medium text-orange-700 dark:text-orange-400">
            Grande barreira
          </p>
        </div>

        {/* Moderate */}
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50/60 p-4 transition-all hover:shadow-xs dark:border-yellow-900/30 dark:bg-yellow-950/30">
          <div className="flex items-center justify-between">
            <span className="text-2xl" aria-hidden="true">🟡</span>
            <span className="text-2xl font-extrabold text-yellow-700 dark:text-yellow-400">
              {moderateCount}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-yellow-700 dark:text-yellow-400">
            Moderado (Moderate)
          </p>
          <p className="mt-1 text-xs font-medium text-yellow-700 dark:text-yellow-400">
            Dificulta o acesso
          </p>
        </div>

        {/* Minor */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 transition-all hover:shadow-xs dark:border-blue-900/30 dark:bg-blue-950/30">
          <div className="flex items-center justify-between">
            <span className="text-2xl" aria-hidden="true">🔵</span>
            <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">
              {minorCount}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            Menor (Minor)
          </p>
          <p className="mt-1 text-xs font-medium text-blue-700 dark:text-blue-400">
            Pode melhorar o uso
          </p>
        </div>
      </div>

      {/* Caixa de Prioridade */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xs">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
          💡 Prioridade de correção
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
          {criticalCount > 0
            ? "Comece pelas violações críticas. Elas podem impedir o acesso a partes importantes da página."
            : seriousCount > 0
              ? "Depois, corrija as violações sérias. Elas podem criar barreiras importantes para navegar e usar a página."
              : moderateCount > 0
                ? "Em seguida, corrija as violações moderadas. Elas dificultam o acesso e ajudam a melhorar a experiência."
                : "Por fim, corrija as violações menores para deixar a experiência mais completa e acessível."}
        </p>
      </div>
    </div>
  );
}