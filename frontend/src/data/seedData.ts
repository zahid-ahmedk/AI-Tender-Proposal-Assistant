import type {
  AnswerLibraryEntry,
  RiskDetectionRule,
  TeamMember,
  TenderRecord,
} from '../types/tender';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-owner',
    name: 'Workspace Admin',
    role: 'Bid Manager',
    department: 'Bid Management',
    initials: 'IQ',
    email: 'admin@tenderiq.local',
  },
];

export const INITIAL_RISK_RULES: RiskDetectionRule[] = [
  {
    id: 'rule-liability',
    name: 'Uncapped Liability & Broad Indemnity',
    category: 'Legal',
    severity: 'High',
    keywords: ['unlimited liability', 'uncapped', 'consequential damages', 'indemnify and hold harmless without limit'],
    guidance: 'Propose standard liability cap at 12 months fees paid and carve out indirect/consequential damages.',
    enabled: true,
  },
  {
    id: 'rule-ld',
    name: 'Liquidated Damages & SLA Penalties',
    category: 'Commercial',
    severity: 'High',
    keywords: ['liquidated damages', 'daily penalty', '25% service credit', 'forfeiture'],
    guidance: 'Negotiate service credits capped at 10% of monthly recurring fees as sole and exclusive remedy.',
    enabled: true,
  },
  {
    id: 'rule-residency',
    name: 'Strict Sovereign Data Residency',
    category: 'Security',
    severity: 'Medium',
    keywords: ['uk-only', 'eu sovereign', 'fedramp high', 'air-gapped', 'strict data residency'],
    guidance: 'Verify dedicated regional cluster provisioning and confirm zero cross-border telemetry egress.',
    enabled: true,
  },
  {
    id: 'rule-escrow',
    name: 'Source Code Escrow & IP Assignment',
    category: 'Legal',
    severity: 'High',
    keywords: ['source code escrow', 'work made for hire', 'full ip transfer', 'background ip assignment'],
    guidance: 'Retain all pre-existing platform IP and offer SaaS continuity escrow only for tier-1 contracts.',
    enabled: true,
  },
  {
    id: 'rule-payment',
    name: 'Extended Payment Terms (> Net 60)',
    category: 'Commercial',
    severity: 'Medium',
    keywords: ['net 90', 'net 120', 'upon final acceptance', 'holdback'],
    guidance: 'Escalate to Deal Desk; require milestone billing or Net 45 standard commercial terms.',
    enabled: true,
  },
  {
    id: 'rule-termination',
    name: 'Termination for Convenience Without Notice',
    category: 'Legal',
    severity: 'Medium',
    keywords: ['terminate for convenience', 'immediate termination without cause', '15 days notice'],
    guidance: 'Request minimum 60-day written notice and payment for all delivered milestones plus wind-down costs.',
    enabled: true,
  },
];

export const INITIAL_LIBRARY_ENTRIES: AnswerLibraryEntry[] = [];

export const INITIAL_TENDERS: TenderRecord[] = [];

export const SAMPLE_RFP_TEMPLATES: Array<{
  id: string;
  label: string;
  title: string;
  issuingAuthority: string;
  sector: string;
  contractValue: string;
  deadlineDate: string;
  rawText: string;
}> = [];
