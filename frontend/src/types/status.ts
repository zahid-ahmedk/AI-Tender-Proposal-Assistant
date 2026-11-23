/** Status vocabularies shared with the backend API contract (docs/API_CONTRACT.md). */
export type ComplianceStatus =
  | "Compliant"
  | "Partially Compliant"
  | "Non-Compliant"
  | "Not Assessed"
  | "Needs Human Review";

export type AnalysisJobStatus = "queued" | "running" | "completed" | "failed";
