import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { AnalysisJobStatus, ComplianceStatus } from "@/types/status";

const COMPLIANCE: Record<ComplianceStatus, { tone: BadgeTone; icon: string }> = {
  Compliant: { tone: "success", icon: "check_circle" },
  "Partially Compliant": { tone: "warning", icon: "timelapse" },
  "Non-Compliant": { tone: "danger", icon: "cancel" },
  "Not Assessed": { tone: "neutral", icon: "help" },
  "Needs Human Review": { tone: "primary", icon: "person_search" },
};

/** Compliance status pill. Values match the backend API (see API_CONTRACT.md). */
export function ComplianceBadge({ status }: { status: ComplianceStatus }) {
  const { tone, icon } = COMPLIANCE[status];
  return (
    <Badge tone={tone} icon={icon} bold>
      {status}
    </Badge>
  );
}

const JOB: Record<AnalysisJobStatus, { tone: BadgeTone; label: string; dot: boolean }> = {
  queued: { tone: "neutral", label: "Queued", dot: true },
  running: { tone: "primary", label: "Analyzing", dot: true },
  completed: { tone: "success", label: "Completed", dot: true },
  failed: { tone: "danger", label: "Failed", dot: true },
};

export function JobStatusBadge({ status }: { status: AnalysisJobStatus }) {
  const { tone, label, dot } = JOB[status];
  return (
    <Badge tone={tone} dot={dot} bold>
      {label}
    </Badge>
  );
}
