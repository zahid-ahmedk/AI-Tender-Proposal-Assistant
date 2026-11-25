export type AppView =
  | 'overview'
  | 'analyzer'
  | 'matrix'
  | 'library'
  | 'team';

export type ComplianceStatus =
  | 'compliant'
  | 'pending'
  | 'high_risk'
  | 'processing';

export type RequirementCategory =
  | 'Technical'
  | 'Security'
  | 'Legal'
  | 'Commercial';

export type RiskSeverity = 'Low' | 'Medium' | 'High';

export type TenderStage =
  | 'In Review'
  | 'High Risk'
  | 'Ready to Submit'
  | 'Extracting';

export interface DocumentClause {
  id: string;
  clauseRef: string;
  pageNumber: number;
  paragraphText: string;
  requirementId?: string;
}

export interface DocumentSection {
  id: string;
  code: string;
  title: string;
  pageRange: string;
  clauses: DocumentClause[];
}

export interface RequirementItem {
  id: string;
  tenderId: string;
  clauseRef: string;
  sectionId: string;
  pageNumber: number;
  title: string;
  summary: string;
  category: RequirementCategory;
  status: ComplianceStatus;
  riskSeverity: RiskSeverity;
  riskNote: string;
  confidence: number;
  ownerId: string;
  draftResponse: string;
  responseApproved: boolean;
  sourceQuote: string;
}

export interface TenderRecord {
  id: string;
  refNumber: string;
  title: string;
  issuingAuthority: string;
  sector: string;
  contractValue: number;
  currency: string;
  deadlineDate: string; // ISO YYYY-MM-DD
  pageCount: number;
  uploadedAt: string;
  leadOwnerId: string;
  winProbability: number;
  executiveSummary: string;
  sections: DocumentSection[];
  requirements: RequirementItem[];
}

export interface AnswerLibraryEntry {
  id: string;
  title: string;
  category: RequirementCategory;
  tags: string[];
  body: string;
  ownerId: string;
  lastVerified: string;
  usageCount: number;
}

export interface RiskDetectionRule {
  id: string;
  name: string;
  category: RequirementCategory;
  severity: RiskSeverity;
  keywords: string[];
  guidance: string;
  enabled: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Bid Management' | 'Legal & Contracts' | 'Security & Architecture' | 'Commercial Finance';
  initials: string;
  email: string;
}

export interface UploadRfpInput {
  title: string;
  issuingAuthority: string;
  sector: string;
  contractValue: string;
  deadlineDate: string;
  rawText: string;
}

export interface FormValidationResult<T extends string = string> {
  valid: boolean;
  errors: Partial<Record<T, string>>;
}
