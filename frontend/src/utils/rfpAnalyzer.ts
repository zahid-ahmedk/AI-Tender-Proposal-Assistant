import type {
  ComplianceStatus,
  DocumentClause,
  DocumentSection,
  FormValidationResult,
  RequirementCategory,
  RequirementItem,
  RiskDetectionRule,
  RiskSeverity,
  TenderRecord,
  UploadRfpInput,
} from '../types/tender';

export type UploadField =
  | 'title'
  | 'issuingAuthority'
  | 'contractValue'
  | 'deadlineDate'
  | 'documents';

export function validateUploadForm(
  input: UploadRfpInput
): FormValidationResult<UploadField> {
  const errors: Partial<Record<UploadField, string>> = {};

  if (!input.title.trim() || input.title.trim().length < 4) {
    errors.title = 'Enter a tender title of at least 4 characters.';
  }

  if (!input.issuingAuthority.trim() || input.issuingAuthority.trim().length < 2) {
    errors.issuingAuthority = 'Specify the issuing organization or agency.';
  }

  const parsedValue = Number(String(input.contractValue).replace(/[^0-9.]/g, ''));
  if (!input.contractValue.trim() || Number.isNaN(parsedValue) || parsedValue <= 0) {
    errors.contractValue = 'Enter a valid contract value greater than 0.';
  }

  if (!input.deadlineDate.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(input.deadlineDate)) {
    errors.deadlineDate = 'Select a valid submission deadline (YYYY-MM-DD).';
  }

  if (input.sourceFiles.length === 0) {
    errors.documents = 'Upload at least one PDF, DOCX or XLSX file from the tender package.';
  } else if (input.rawText.trim().length < 40) {
    errors.documents =
      'Not enough readable text was extracted from the uploaded files to identify clauses.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export type LibraryField = 'title' | 'category' | 'body';

export function validateLibraryEntry(input: {
  title: string;
  category: string;
  body: string;
}): FormValidationResult<LibraryField> {
  const errors: Partial<Record<LibraryField, string>> = {};

  if (!input.title.trim() || input.title.trim().length < 3) {
    errors.title = 'Enter an entry title of at least 3 characters.';
  }

  if (!['Technical', 'Security', 'Legal', 'Commercial'].includes(input.category)) {
    errors.category = 'Select a valid category.';
  }

  if (!input.body.trim() || input.body.trim().length < 20) {
    errors.body = 'Provide a verified response of at least 20 characters.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

const CATEGORY_PATTERNS: Record<RequirementCategory, RegExp> = {
  Security:
    /\b(soc\s*2|iso\s*27001|fedramp|hipaa|gdpr|encryption|aes-?256|tls|zero[- ]trust|penetration|vulnerability|residency|audit log|sso|saml|mfa|rbac|privacy)\b/i,
  Legal:
    /\b(indemnif|liability|liquidated damages|termination|intellectual property|escrow|jurisdiction|governing law|warranty|breach|subcontract|insurance|confidentiality|compliance with laws)\b/i,
  Commercial:
    /\b(pricing|fixed[- ]price|payment terms|net\s*\d+|invoice|rate card|fee|cost|budget|sla credit|service credit|penalty|discount|cap|milestone|billing)\b/i,
  Technical:
    /\b(api|uptime|availability|99\.\d+%|latency|integration|kubernetes|cloud|migration|disaster recovery|rto|rpo|backup|scalability|throughput|architecture|dashboard|export)\b/i,
};

export function classifyClauseCategory(text: string): RequirementCategory {
  const scores: Record<RequirementCategory, number> = {
    Security: 0,
    Legal: 0,
    Commercial: 0,
    Technical: 0,
  };

  (Object.keys(CATEGORY_PATTERNS) as RequirementCategory[]).forEach((category) => {
    const matches = text.match(new RegExp(CATEGORY_PATTERNS[category].source, 'gi'));
    scores[category] = matches ? matches.length : 0;
  });

  const sorted = (Object.entries(scores) as [RequirementCategory, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  if (sorted[0][1] > 0) {
    return sorted[0][0];
  }
  return 'Technical';
}

export function evaluateClauseRisk(
  text: string,
  rules: RiskDetectionRule[]
): { severity: RiskSeverity; status: ComplianceStatus; riskNote: string } {
  const lower = text.toLowerCase();
  const enabledRules = rules.filter((r) => r.enabled);

  for (const rule of enabledRules) {
    const matchedKeyword = rule.keywords.find((kw) =>
      lower.includes(kw.toLowerCase())
    );
    if (matchedKeyword) {
      if (rule.severity === 'High') {
        return {
          severity: 'High',
          status: 'high_risk',
          riskNote: `Triggered rule "${rule.name}" ("${matchedKeyword}"): ${rule.guidance}`,
        };
      }
      if (rule.severity === 'Medium') {
        return {
          severity: 'Medium',
          status: 'pending',
          riskNote: `Triggered rule "${rule.name}" ("${matchedKeyword}"): ${rule.guidance}`,
        };
      }
    }
  }

  // Secondary heuristic for mandatory obligations without explicit risk triggers
  if (/\b(must|shall|mandatory|required within|no exceptions)\b/i.test(text)) {
    if (/\b(unlimited|sole discretion|immediate termination|without cap|100%)\b/i.test(text)) {
      return {
        severity: 'High',
        status: 'high_risk',
        riskNote: 'Uncapped or unilateral mandatory obligation detected; requires legal redline before submission.',
      };
    }
    return {
      severity: 'Medium',
      status: 'pending',
      riskNote: 'Mandatory procurement obligation extracted; verify supporting evidence and owner sign-off.',
    };
  }

  return {
    severity: 'Low',
    status: 'compliant',
    riskNote: 'Standard operational requirement aligned with baseline enterprise capabilities.',
  };
}

function deriveClauseTitle(text: string, fallbackIndex: number): string {
  const cleaned = text
    .replace(/^(?:section\s+)?\d+(?:\.\d+)*\.?\s*[-:]?\s*/i, '')
    .trim();
  const firstSentence = cleaned.split(/[.!?](?:\s|$)/)[0] || cleaned;
  const words = firstSentence.split(/\s+/).slice(0, 9).join(' ');
  if (!words) return `Extracted Requirement ${fallbackIndex}`;
  return words.length < firstSentence.length ? `${words}...` : words;
}

function defaultOwnerForCategory(category: RequirementCategory): string {
  switch (category) {
    case 'Legal':
      return 'tm-elena';
    case 'Security':
      return 'tm-marcus';
    case 'Commercial':
      return 'tm-priya';
    case 'Technical':
    default:
      return 'tm-david';
  }
}

export function analyzeRfpText(
  input: UploadRfpInput,
  rules: RiskDetectionRule[],
  nowIsoDate = '2026-11-25'
): TenderRecord {
  const tenderId = `tnd-${Date.now().toString(36)}`;
  const refNumber = `RFP-${nowIsoDate.slice(0, 4)}-${Math.floor(1000 + (input.title.length * 137) % 8999)}`;
  const parsedValue = Number(String(input.contractValue).replace(/[^0-9.]/g, '')) || 0;

  // Split raw text into logical paragraphs / lines
  const rawBlocks = input.rawText
    .split(/\n{2,}|(?=\n(?:Section\s+\d+|\d+\.\d+\s))/i)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  const blocks =
    rawBlocks.length > 0 ? rawBlocks : [input.rawText.trim()];

  const sectionMap = new Map<
    RequirementCategory,
    { clauses: DocumentClause[]; code: string; title: string }
  >();

  const sectionOrder: { category: RequirementCategory; code: string; title: string }[] = [
    { category: 'Technical', code: 'Sec 1', title: 'Technical Architecture & SLA' },
    { category: 'Security', code: 'Sec 2', title: 'Security, Privacy & Compliance' },
    { category: 'Legal', code: 'Sec 3', title: 'Legal, Liability & Governance' },
    { category: 'Commercial', code: 'Sec 4', title: 'Commercial Terms & Pricing' },
  ];

  const requirements: RequirementItem[] = [];

  blocks.forEach((block, index) => {
    const category = classifyClauseCategory(block);
    const sectionMeta =
      sectionOrder.find((s) => s.category === category) || sectionOrder[0];
    const sectionId = `${tenderId}-sec-${category.toLowerCase()}`;

    if (!sectionMap.has(category)) {
      sectionMap.set(category, {
        code: sectionMeta.code,
        title: sectionMeta.title,
        clauses: [],
      });
    }

    const sectionBucket = sectionMap.get(category)!;
    const clauseNum = sectionBucket.clauses.length + 1;
    const secIndex = sectionOrder.findIndex((s) => s.category === category) + 1;
    const clauseRef = `REQ-${secIndex}.${clauseNum}`;
    const pageNumber = 4 + index * 3;
    const reqId = `${tenderId}-req-${index + 1}`;
    const clauseId = `${tenderId}-cl-${index + 1}`;

    const riskEval = evaluateClauseRisk(block, rules);
    const confidence =
      riskEval.severity === 'High' ? 96 : riskEval.severity === 'Medium' ? 92 : 95;

    sectionBucket.clauses.push({
      id: clauseId,
      clauseRef,
      pageNumber,
      paragraphText: block,
      requirementId: reqId,
    });

    requirements.push({
      id: reqId,
      tenderId,
      clauseRef,
      sectionId,
      pageNumber,
      title: deriveClauseTitle(block, index + 1),
      summary: block.length > 220 ? `${block.slice(0, 217)}...` : block,
      category,
      status: riskEval.status,
      riskSeverity: riskEval.severity,
      riskNote: riskEval.riskNote,
      confidence,
      ownerId: defaultOwnerForCategory(category),
      draftResponse:
        riskEval.status === 'compliant'
          ? 'Confirmed compliant. Standard enterprise delivery controls and documentation satisfy this clause in full.'
          : '',
      responseApproved: riskEval.status === 'compliant',
      sourceQuote: block,
    });
  });

  const sections: DocumentSection[] = sectionOrder
    .filter((s) => sectionMap.has(s.category))
    .map((s) => {
      const bucket = sectionMap.get(s.category)!;
      const pages = bucket.clauses.map((c) => c.pageNumber);
      const minPage = Math.min(...pages);
      const maxPage = Math.max(...pages);
      return {
        id: `${tenderId}-sec-${s.category.toLowerCase()}`,
        code: bucket.code,
        title: bucket.title,
        pageRange: minPage === maxPage ? `p. ${minPage}` : `pp. ${minPage}–${maxPage}`,
        clauses: bucket.clauses,
      };
    });

  const highRiskCount = requirements.filter((r) => r.status === 'high_risk').length;
  const estimatedPages = Math.max(18, blocks.length * 6);

  return {
    id: tenderId,
    refNumber,
    title: input.title.trim(),
    issuingAuthority: input.issuingAuthority.trim(),
    sector: input.sector.trim() || 'Enterprise Procurement',
    contractValue: parsedValue,
    currency: 'USD',
    deadlineDate: input.deadlineDate,
    pageCount: estimatedPages,
    uploadedAt: nowIsoDate,
    leadOwnerId: 'tm-sarah',
    winProbability: highRiskCount > 1 ? 58 : 74,
    executiveSummary: `Extracted ${requirements.length} actionable clauses across ${sections.length} procurement domains with ${highRiskCount} high-risk legal/compliance flags requiring immediate review.`,
    sections,
    requirements,
  };
}
