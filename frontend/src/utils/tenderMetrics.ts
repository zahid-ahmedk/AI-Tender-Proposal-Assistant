import type {
  RequirementItem,
  TenderRecord,
  TenderStage,
} from '../types/tender';

export interface TenderSummaryStats {
  complianceScore: number;
  compliantCount: number;
  pendingCount: number;
  highRiskCount: number;
  processingCount: number;
  totalRequirements: number;
  approvedDraftsCount: number;
  stage: TenderStage;
}

export interface PortfolioMetrics {
  activeTendersCount: number;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  averageComplianceScore: number;
  deadlinesWithin7Days: number;
  totalHighRiskFlags: number;
  totalRequirementsCount: number;
}

export function getTenderStats(tender: TenderRecord): TenderSummaryStats {
  const total = tender.requirements.length;
  if (total === 0) {
    return {
      complianceScore: 0,
      compliantCount: 0,
      pendingCount: 0,
      highRiskCount: 0,
      processingCount: 0,
      totalRequirements: 0,
      approvedDraftsCount: 0,
      stage: 'In Review',
    };
  }

  let compliantCount = 0;
  let pendingCount = 0;
  let highRiskCount = 0;
  let processingCount = 0;
  let approvedDraftsCount = 0;

  for (const req of tender.requirements) {
    if (req.status === 'compliant') compliantCount++;
    else if (req.status === 'pending') pendingCount++;
    else if (req.status === 'high_risk') highRiskCount++;
    else if (req.status === 'processing') processingCount++;

    if (req.responseApproved) approvedDraftsCount++;
  }

  // Compliant = 1.0, Pending = 0.45, Processing = 0.3, High Risk = 0.0
  const weightedPoints =
    compliantCount * 1.0 + pendingCount * 0.45 + processingCount * 0.3;
  const complianceScore = Math.round((weightedPoints / total) * 100);

  let stage: TenderStage = 'In Review';
  if (processingCount > 0) {
    stage = 'Extracting';
  } else if (highRiskCount > 0) {
    stage = 'High Risk';
  } else if (pendingCount === 0 && compliantCount === total) {
    stage = 'Ready to Submit';
  }

  return {
    complianceScore,
    compliantCount,
    pendingCount,
    highRiskCount,
    processingCount,
    totalRequirements: total,
    approvedDraftsCount,
    stage,
  };
}

export function getDaysRemaining(
  deadlineDate: string,
  referenceDateIso = '2026-11-25'
): number {
  const [dY, dM, dD] = deadlineDate.split('-').map(Number);
  const [rY, rM, rD] = referenceDateIso.split('-').map(Number);
  const deadlineUtc = Date.UTC(dY, dM - 1, dD);
  const refUtc = Date.UTC(rY, rM - 1, rD);
  return Math.ceil((deadlineUtc - refUtc) / (1000 * 60 * 60 * 24));
}

export function calculatePortfolioMetrics(
  tenders: TenderRecord[],
  referenceDateIso = '2026-11-25'
): PortfolioMetrics {
  if (tenders.length === 0) {
    return {
      activeTendersCount: 0,
      totalPipelineValue: 0,
      weightedPipelineValue: 0,
      averageComplianceScore: 0,
      deadlinesWithin7Days: 0,
      totalHighRiskFlags: 0,
      totalRequirementsCount: 0,
    };
  }

  let totalPipelineValue = 0;
  let weightedPipelineValue = 0;
  let complianceSum = 0;
  let deadlinesWithin7Days = 0;
  let totalHighRiskFlags = 0;
  let totalRequirementsCount = 0;

  for (const tender of tenders) {
    const stats = getTenderStats(tender);
    totalPipelineValue += tender.contractValue;
    weightedPipelineValue += tender.contractValue * (tender.winProbability / 100);
    complianceSum += stats.complianceScore;
    totalHighRiskFlags += stats.highRiskCount;
    totalRequirementsCount += stats.totalRequirements;

    const daysLeft = getDaysRemaining(tender.deadlineDate, referenceDateIso);
    if (daysLeft >= 0 && daysLeft <= 7) {
      deadlinesWithin7Days++;
    }
  }

  return {
    activeTendersCount: tenders.length,
    totalPipelineValue: Math.round(totalPipelineValue),
    weightedPipelineValue: Math.round(weightedPipelineValue),
    averageComplianceScore: Math.round(complianceSum / tenders.length),
    deadlinesWithin7Days,
    totalHighRiskFlags,
    totalRequirementsCount,
  };
}

export function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000)}K`;
  }
  return `$${value.toLocaleString('en-US')}`;
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDeadlineLabel(
  deadlineDate: string,
  referenceDateIso = '2026-11-25'
): string {
  const days = getDaysRemaining(deadlineDate, referenceDateIso);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

export function escapeCsvCell(value: string | number | boolean): string {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function buildComplianceMatrixCsv(
  rows: Array<{
    tenderTitle: string;
    refNumber: string;
    requirement: RequirementItem;
    ownerName: string;
  }>
): string {
  const headers = [
    'Tender Ref',
    'Tender Name',
    'Clause Ref',
    'Page',
    'Category',
    'Requirement',
    'Status',
    'Risk Severity',
    'Owner',
    'Confidence (%)',
    'Draft Approved',
    'Draft Response',
  ];

  const lines = [headers.map(escapeCsvCell).join(',')];

  for (const row of rows) {
    const r = row.requirement;
    lines.push(
      [
        row.refNumber,
        row.tenderTitle,
        r.clauseRef,
        r.pageNumber,
        r.category,
        r.title,
        r.status,
        r.riskSeverity,
        row.ownerName,
        r.confidence,
        r.responseApproved ? 'Yes' : 'No',
        r.draftResponse,
      ]
        .map(escapeCsvCell)
        .join(',')
    );
  }

  return lines.join('\n');
}
