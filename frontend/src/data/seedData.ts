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
  // High-severity rules are listed first: the analyzer applies the first rule that matches.
  {
    id: 'rule-liability',
    name: 'Uncapped Liability & Broad Indemnity',
    category: 'Legal',
    severity: 'High',
    keywords: [
      'unlimited liability',
      'uncapped',
      'consequential loss',
      'consequential damages',
      'indemnify and hold harmless',
      'unlimited indemnity',
    ],
    guidance:
      'Propose a liability cap linked to contract value or insurance limits, and exclude indirect and consequential loss (lost profit, loss of use).',
    enabled: true,
  },
  {
    id: 'rule-delay-damages',
    name: 'Liquidated Damages for Delay',
    category: 'Commercial',
    severity: 'High',
    keywords: [
      'liquidated damages',
      'delay damages',
      'damages for delay',
      'per day of delay',
      'daily penalty',
    ],
    guidance:
      'Negotiate an overall cap on delay damages (e.g. 10% of contract price) as the sole remedy for delay, and check the daily rate against programme float and weather risk.',
    enabled: true,
  },
  {
    id: 'rule-ground-conditions',
    name: 'Ground & Site Condition Risk',
    category: 'Technical',
    severity: 'High',
    keywords: [
      'unforeseen ground',
      'ground conditions',
      'latent conditions',
      'differing site conditions',
      'existing services',
      'sole responsibility for site conditions',
    ],
    guidance:
      'Seek time and cost relief for physical conditions that could not reasonably have been foreseen, and confirm the survey and geotechnical data supplied by the client.',
    enabled: true,
  },
  {
    id: 'rule-design-responsibility',
    name: 'Design Responsibility & Fitness for Purpose',
    category: 'Legal',
    severity: 'High',
    keywords: [
      'fitness for purpose',
      'fit for purpose',
      'assume design responsibility',
      'contractor-designed',
    ],
    guidance:
      'Limit the design duty to reasonable skill and care, confirm professional indemnity cover, and make design liability back-to-back with the designer.',
    enabled: true,
  },
  {
    id: 'rule-bonds',
    name: 'Performance Bonds & Guarantees',
    category: 'Commercial',
    severity: 'Medium',
    keywords: [
      'performance bond',
      'on-demand bond',
      'advance payment bond',
      'parent company guarantee',
      'bank guarantee',
      'surety',
    ],
    guidance:
      'Confirm bonding capacity and cost with Finance. Prefer conditional bonds over on-demand bonds, and agree the bond value and release date.',
    enabled: true,
  },
  {
    id: 'rule-payment-retention',
    name: 'Retention & Delayed Payment',
    category: 'Commercial',
    severity: 'Medium',
    keywords: [
      'retention',
      'pay when paid',
      'pay-when-paid',
      'pay if paid',
      'net 90',
      'net 120',
      'upon final acceptance',
      'holdback',
    ],
    guidance:
      'Escalate to Commercial. Seek monthly or milestone payments, retention that is capped and released in stages, and check local prompt-payment legislation.',
    enabled: true,
  },
  {
    id: 'rule-fixed-price',
    name: 'Fixed Price Without Variation or Price Adjustment',
    category: 'Commercial',
    severity: 'Medium',
    keywords: [
      'lump sum',
      'fixed price',
      'no variation',
      'no price adjustment',
      'price fluctuation',
      'without adjustment',
    ],
    guidance:
      'Confirm a variation / change-order mechanism, and request a material price escalation clause for long-duration scopes or volatile materials.',
    enabled: true,
  },
  {
    id: 'rule-time-bars',
    name: 'Strict Notice & Time-Bar Provisions',
    category: 'Legal',
    severity: 'Medium',
    keywords: [
      'time bar',
      'condition precedent',
      'deemed to have waived',
      'notice within 7 days',
      'notice within 14 days',
    ],
    guidance:
      'Assign a contract administrator to track notice deadlines, and negotiate longer notice windows or remove time bars on extension-of-time and variation claims.',
    enabled: true,
  },
  {
    id: 'rule-termination',
    name: 'Termination for Convenience Without Adequate Compensation',
    category: 'Legal',
    severity: 'Medium',
    keywords: [
      'terminate for convenience',
      'termination for convenience',
      'terminate without cause',
      'immediate termination',
    ],
    guidance:
      'Require reasonable written notice and payment for work done, materials ordered and demobilisation costs.',
    enabled: true,
  },
  {
    id: 'rule-hse',
    name: 'Health, Safety & Site Compliance Obligations',
    category: 'Security',
    severity: 'Medium',
    keywords: [
      'health and safety plan',
      'safety management system',
      'iso 45001',
      'lost time injury',
      'zero harm',
      'occupational safety',
    ],
    guidance:
      'Have the HSE Manager confirm incident rates, certifications and method statements before accepting the stated safety obligations.',
    enabled: true,
  },
  {
    id: 'rule-defects-warranty',
    name: 'Extended Defects Liability & Warranty',
    category: 'Technical',
    severity: 'Medium',
    keywords: [
      'defects liability period',
      'latent defects',
      'extended warranty',
      'warranty period of',
    ],
    guidance:
      'Check that manufacturer and subcontractor warranties are back-to-back for the full period, and price any extended warranty into the bid.',
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
