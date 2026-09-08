export type Violation = {
  id: string;
  impact?: "critical" | "serious" | "moderate" | "minor" | null;
  description: string;
  help: string;
  helpUrl: string;
  tags: string[];
  nodes: {
    html: string;
    target: string[];
    failureSummary?: string;
  }[];
};

export type AuditResult = {
  title: string;
  url: string;
  violations: Violation[];
  passesCount?: number;
  incompleteCount?: number;
  score?: number;
  timestamp?: string;
  message?: string;
};

export type ViolationImpact = Violation["impact"];
export type ImpactFilter = "critical" | "serious" | "moderate" | "minor" | "all";