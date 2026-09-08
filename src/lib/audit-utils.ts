import type { AuditResult, Violation } from "../types/audit";

export function getCategory(violation: Violation): string {
  const tags = violation.tags.map((tag) => tag.toLowerCase());

  if (tags.some((tag) => tag.startsWith("best-practice"))) {
    return "Boas práticas";
  }

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

export function getCategoryDescription(category: string): string {
  switch (category) {
    case "Perceptível":
      return "O conteúdo precisa ser fácil de perceber e entender, inclusive para quem usa tecnologias assistivas.";

    case "Operável":
      return "A página deve ser fácil de navegar usando teclado, mouse ou tecnologias assistivas.";

    case "Compreensível":
      return "Textos, formulários e ações devem ser claros, previsíveis e fáceis de entender.";

    case "Robusto":
      return "A interface deve funcionar corretamente com leitores de tela e outras tecnologias assistivas.";

    case "Boas práticas":
      return "Recomendações que ajudam a melhorar a qualidade e a acessibilidade da interface.";

    default:
      return "Outros problemas encontrados durante a auditoria automatizada.";
  }
}

export function getWcagCriteria(tags: string[]): string[] {
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

export function getImpactClasses(impact?: Violation["impact"]): string {
  switch (impact) {
    case "critical":
      return "border-red-300 bg-red-50 text-gray-900 dark:border-red-800 dark:bg-red-950/30 dark:text-gray-100";

    case "serious":
      return "border-orange-300 bg-orange-50 text-gray-900 dark:border-orange-800 dark:bg-orange-950/30 dark:text-gray-100";

    case "moderate":
      return "border-yellow-300 bg-yellow-50 text-gray-900 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-gray-100";

    case "minor":
      return "border-blue-300 bg-blue-50 text-gray-900 dark:border-blue-800 dark:bg-blue-950/30 dark:text-gray-100";

    default:
      return "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)]";
  }
}

export function getFixGuidance(violation: Violation): string {
  switch (violation.id) {
    case "image-alt":
      return "Adicione um atributo alt às imagens. Para imagens informativas, descreva o conteúdo de forma objetiva. Para imagens decorativas, use alt=\"\".";

    case "button-name":
      return "Adicione um nome acessível ao botão, usando texto visível ou um atributo aria-label que descreva claramente sua ação.";

    case "link-name":
      return "Adicione um texto acessível ao link que descreva claramente seu destino. Evite links com textos genéricos como \"clique aqui\".";

    case "color-contrast":
      return "Aumente o contraste entre o texto e o fundo. Verifique se a combinação de cores atende aos critérios de contraste da WCAG.";

    case "heading-order":
      return "Organize os títulos em uma hierarquia lógica. Evite pular níveis de heading, como sair diretamente de h1 para h3.";

    case "label":
      return "Associe cada campo de formulário a um label visível e descritivo. O label deve identificar claramente o propósito do campo.";

    case "html-has-lang":
      return "Adicione o atributo lang ao elemento html para informar o idioma principal da página, por exemplo: lang=\"pt-BR\".";

    case "document-title":
      return "Adicione um elemento title descritivo à página. O título deve identificar de forma clara o conteúdo ou propósito da página.";

    case "landmark-one-main":
      return "Adicione um elemento <main> que envolva o conteúdo principal da página. Deve existir apenas um landmark principal por página.";

    case "region":
      return "Organize o conteúdo da página dentro de landmarks semânticos, como <main>, <header>, <nav>, <aside> e <footer>, conforme a função de cada área.";

    default:
      return "Revise esta violação e consulte a documentação da regra para aplicar a correção recomendada.";
  }
}

export function getImpactPriority(impact?: Violation["impact"]): number {
  switch (impact) {
    case "critical":
      return 1;
    case "serious":
      return 2;
    case "moderate":
      return 3;
    case "minor":
      return 4;
    default:
      return 5;
  }
}

export function calculateAccessibilityScore(violations: { impact?: string | null; nodes: unknown[] }[]): number {
  if (violations.length === 0) return 100;

  const weights: Record<string, number> = {
    critical: 25,
    serious: 15,
    moderate: 8,
    minor: 3,
  };

  let totalPenalty = 0;
  for (const v of violations) {
    const penalty = weights[v.impact ?? "moderate"] ?? 5;
    // Each unique violation type penalizes based on base impact + small increment for multiple affected nodes
    const nodeMultiplier = Math.min(1 + (v.nodes.length - 1) * 0.15, 2.0);
    totalPenalty += penalty * nodeMultiplier;
  }

  const score = Math.max(0, Math.round(100 - totalPenalty));
  return score;
}

export function generateMarkdownReport(auditResult: AuditResult): string {
  const dateStr = auditResult.timestamp
    ? new Date(auditResult.timestamp).toLocaleString("pt-BR")
    : new Date().toLocaleString("pt-BR");

  const critical = auditResult.violations.filter(
    (v) => v.impact === "critical",
  ).length;

  const serious = auditResult.violations.filter(
    (v) => v.impact === "serious",
  ).length;

  const moderate = auditResult.violations.filter(
    (v) => v.impact === "moderate",
  ).length;

  const minor = auditResult.violations.filter(
    (v) => v.impact === "minor",
  ).length;

  const score =
    auditResult.score ??
    calculateAccessibilityScore(auditResult.violations);

  let md = `# Relatório de Auditoria de Acessibilidade\n\n`;

  md += `- **Página auditada:** ${auditResult.title || "Sem título"}\n`;
  md += `- **URL:** ${auditResult.url}\n`;
  md += `- **Data da auditoria:** ${dateStr}\n`;
  md += `- **Score de acessibilidade:** **${score}/100**\n`;
  md += `- **Total de violações:** ${auditResult.violations.length}\n\n`;

  if (auditResult.violations.length === 0) {
    md += `## Resultado\n\n`;
    md += `Nenhuma violação automatizada foi identificada pelo Axe-core.\n\n`;
    md += `> A ausência de violações automatizadas não substitui testes manuais de acessibilidade.\n`;

    return md;
  }

  md += `## Resumo\n\n`;
  md += `Foram encontradas **${auditResult.violations.length} ${auditResult.violations.length === 1
    ? "violação"
    : "violações"
    }** durante a auditoria.\n\n`;

  md += `| Impacto | Quantidade |\n`;
  md += `| --- | ---: |\n`;
  md += `| Critical | ${critical} |\n`;
  md += `| Serious | ${serious} |\n`;
  md += `| Moderate | ${moderate} |\n`;
  md += `| Minor | ${minor} |\n\n`;

  md += `## Violações encontradas\n\n`;

  auditResult.violations.forEach((violation, index) => {
    const impact = violation.impact?.toUpperCase() ?? "UNKNOWN";

    md += `### ${index + 1}. [${impact}] ${violation.help}\n\n`;
    md += `- **Regra:** \`${violation.id}\`\n`;
    md += `- **Categoria:** ${getCategory(violation)}\n`;
    md += `- **Descrição:** ${violation.description}\n`;

    const wcag = getWcagCriteria(violation.tags);

    if (wcag.length > 0) {
      md += `- **Critérios WCAG:** ${wcag.join(", ")}\n`;
    }

    md += `- **Como corrigir:** ${getFixGuidance(violation)}\n`;
    md += `- **Documentação:** [Documentação oficial](${violation.helpUrl})\n\n`;

    if (violation.nodes.length > 0) {
      md += `#### Elementos afetados (${violation.nodes.length})\n\n`;

      violation.nodes.forEach((node, nodeIdx) => {
        md += `**Elemento #${nodeIdx + 1}**\n\n`;

        md += `\`\`\`html\n`;
        md += `${node.html}\n`;
        md += `\`\`\`\n\n`;

        if (node.target.length > 0) {
          md += `**Seletor:** \`${node.target.join(", ")}\`\n\n`;
        }

        if (node.failureSummary) {
          md += `**Evidência:** ${node.failureSummary}\n\n`;
        }
      });
    }

    md += `---\n\n`;
  });

  md += `## Observação\n\n`;
  md += `Este relatório foi gerado automaticamente pelo Accessibility Lab com base nos resultados da auditoria Axe-core.`;

  return md;
}

export const CATEGORIES = [
  "Perceptível",
  "Operável",
  "Compreensível",
  "Robusto",
  "Boas práticas",
  "Outros",
] as const;

export const IMPACT_FILTERS = [
  { label: "Todas", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "Serious", value: "serious" },
  { label: "Moderate", value: "moderate" },
  { label: "Minor", value: "minor" },
] as const;