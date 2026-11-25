import type {
  AnswerLibraryEntry,
  RiskDetectionRule,
  TeamMember,
  TenderRecord,
} from '../types/tender';

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-sarah',
    name: 'Sarah Chen',
    role: 'Principal Bid Manager',
    department: 'Bid Management',
    initials: 'SC',
    email: 's.chen@tenderiq.io',
  },
  {
    id: 'tm-elena',
    name: 'Elena Rostova',
    role: 'VP Commercial Legal',
    department: 'Legal & Contracts',
    initials: 'ER',
    email: 'e.rostova@tenderiq.io',
  },
  {
    id: 'tm-marcus',
    name: 'Marcus Vance',
    role: 'CISO & Compliance Lead',
    department: 'Security & Architecture',
    initials: 'MV',
    email: 'm.vance@tenderiq.io',
  },
  {
    id: 'tm-david',
    name: 'David Okonkwo',
    role: 'Principal Solutions Architect',
    department: 'Security & Architecture',
    initials: 'DO',
    email: 'd.okonkwo@tenderiq.io',
  },
  {
    id: 'tm-priya',
    name: 'Priya Nair',
    role: 'Enterprise Deal Desk Lead',
    department: 'Commercial Finance',
    initials: 'PN',
    email: 'p.nair@tenderiq.io',
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
    guidance: 'Retain all pre-existing platform IP and offer Iron Mountain SaaS continuity escrow only for tier-1 contracts.',
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

export const INITIAL_LIBRARY_ENTRIES: AnswerLibraryEntry[] = [
  {
    id: 'lib-1',
    title: 'SOC 2 Type II & ISO 27001:2022 Attestation',
    category: 'Security',
    tags: ['SOC 2', 'ISO 27001', 'Audits', 'Encryption'],
    body: 'We maintain continuous SOC 2 Type II and ISO/IEC 27001:2022 certifications audited annually by an independent AICPA-accredited firm. All customer data is encrypted at rest using AES-256-GCM with envelope KMS key rotation every 90 days, and in transit using TLS 1.3 with forward secrecy.',
    ownerId: 'tm-marcus',
    lastVerified: '2026-11-10',
    usageCount: 34,
  },
  {
    id: 'lib-2',
    title: 'Standard Limitation of Liability Fallback Clause',
    category: 'Legal',
    tags: ['Liability Cap', 'Redline', 'MSA'],
    body: 'Except for gross negligence, willful misconduct, or third-party IP infringement indemnification, each party’s aggregate cumulative liability under the Agreement shall not exceed the total fees paid or payable by Customer during the twelve (12) months preceding the event giving rise to the claim. Neither party shall be liable for indirect, incidental, or consequential damages.',
    ownerId: 'tm-elena',
    lastVerified: '2026-11-18',
    usageCount: 28,
  },
  {
    id: 'lib-3',
    title: '99.95% Uptime SLA & Multi-AZ Disaster Recovery',
    category: 'Technical',
    tags: ['SLA', 'RTO/RPO', 'High Availability'],
    body: 'Our production platform operates across three geographically isolated availability zones with automated failover. We contractually guarantee 99.95% monthly uptime, a Recovery Time Objective (RTO) under 15 minutes, and a Recovery Point Objective (RPO) under 60 seconds via continuous point-in-time replication.',
    ownerId: 'tm-david',
    lastVerified: '2026-11-04',
    usageCount: 41,
  },
  {
    id: 'lib-4',
    title: 'UK / EU Sovereign Data Residency Controls',
    category: 'Security',
    tags: ['GDPR', 'UK GDPR', 'Data Residency'],
    body: 'Customer tenants can be pinned exclusively to London (eu-west-2) or Frankfurt (eu-central-1) sovereign regions. Logical tenant isolation, customer-managed encryption keys (CMEK), and zero cross-border subprocessor transfers are enforced at the infrastructure policy layer.',
    ownerId: 'tm-marcus',
    lastVerified: '2026-10-29',
    usageCount: 19,
  },
  {
    id: 'lib-5',
    title: 'Enterprise Commercial Payment & Milestone Schedule',
    category: 'Commercial',
    tags: ['Net 45', 'Pricing', 'Milestones'],
    body: 'Annual platform subscription fees are invoiced upon contract execution on Net 45 terms. Implementation services are billed against mutually signed milestone acceptance certificates (30% Kickoff, 40% UAT Sign-off, 30% Production Go-Live), with price protection capped at 3% CPI upon renewal.',
    ownerId: 'tm-priya',
    lastVerified: '2026-11-12',
    usageCount: 22,
  },
  {
    id: 'lib-6',
    title: 'SSO, SAML 2.0, SCIM & Immutable Audit Logging',
    category: 'Technical',
    tags: ['SAML 2.0', 'RBAC', 'SIEM'],
    body: 'Native SAML 2.0 / OIDC single sign-on (Okta, Microsoft Entra ID, Ping) and SCIM 2.0 automated user provisioning are included at no extra cost. All user and administrative actions emit cryptographically signed audit logs streamable in real time to customer SIEM endpoints (Splunk, Datadog, Sentinel).',
    ownerId: 'tm-david',
    lastVerified: '2026-11-15',
    usageCount: 25,
  },
];

export const INITIAL_TENDERS: TenderRecord[] = [
  {
    id: 'tnd-nhs-cloud',
    refNumber: 'RFP-2026-8841',
    title: 'NHS Digital Cloud Clinical Data Platform',
    issuingAuthority: 'NHS England Procurement',
    sector: 'Healthcare & Public Sector',
    contractValue: 4850000,
    currency: 'USD',
    deadlineDate: '2026-11-29',
    pageCount: 186,
    uploadedAt: '2026-11-18',
    leadOwnerId: 'tm-sarah',
    winProbability: 78,
    executiveSummary:
      'Multi-region clinical telemetry and analytics platform tender covering 42 NHS Trusts. Strong technical fit; two legal clauses (uncapped indemnity and source code escrow) require redline approval prior to Friday submission.',
    sections: [
      {
        id: 'nhs-sec-1',
        code: 'Sec 1',
        title: 'Technical Architecture & Availability',
        pageRange: 'pp. 12–34',
        clauses: [
          {
            id: 'nhs-cl-1',
            clauseRef: 'REQ-1.1',
            pageNumber: 14,
            requirementId: 'nhs-req-1',
            paragraphText:
              '1.1 High Availability & Failover. The proposed platform shall maintain a minimum 99.95% monthly service availability across all production clinical interfaces, backed by automated multi-zone failover with a Recovery Time Objective (RTO) not exceeding 15 minutes and Recovery Point Objective (RPO) under 5 minutes.',
          },
          {
            id: 'nhs-cl-2',
            clauseRef: 'REQ-1.2',
            pageNumber: 22,
            requirementId: 'nhs-req-2',
            paragraphText:
              '1.2 HL7 FHIR R4 Interoperability. The Supplier must deliver native bidirectional HL7 FHIR R4 REST APIs capable of ingesting 12,000 clinical events per second at p99 latency below 180 milliseconds without data loss during scheduled rolling upgrades.',
          },
        ],
      },
      {
        id: 'nhs-sec-2',
        code: 'Sec 2',
        title: 'Security, Sovereignty & IG Compliance',
        pageRange: 'pp. 35–68',
        clauses: [
          {
            id: 'nhs-cl-3',
            clauseRef: 'REQ-2.1',
            pageNumber: 41,
            requirementId: 'nhs-req-3',
            paragraphText:
              '2.1 UK Sovereign Data Residency. All patient-identifiable data, backups, disaster recovery replicas, and operational audit logs shall reside strictly within UK-only data centers accredited to ISO/IEC 27001:2022 and NHS DSPT Exceeds Standards, with zero cross-border telemetry egress.',
          },
          {
            id: 'nhs-cl-4',
            clauseRef: 'REQ-2.2',
            pageNumber: 49,
            requirementId: 'nhs-req-4',
            paragraphText:
              '2.2 Federated Identity & Zero-Trust Access. The solution shall integrate with NHS Care Identity Service 2 (CIS2) via OIDC/SAML 2.0, enforce hardware MFA for all privileged administrators, and stream immutable audit trails to the Authority’s Microsoft Sentinel SIEM.',
          },
        ],
      },
      {
        id: 'nhs-sec-3',
        code: 'Sec 3',
        title: 'Legal, Liability & Continuity',
        pageRange: 'pp. 69–118',
        clauses: [
          {
            id: 'nhs-cl-5',
            clauseRef: 'REQ-3.1',
            pageNumber: 84,
            requirementId: 'nhs-req-5',
            paragraphText:
              '3.1 Uncapped Data Breach Indemnification. Supplier shall assume unlimited liability and indemnify and hold harmless the Authority without cap for any direct, indirect, or consequential damages arising from unauthorized disclosure of clinical datasets or failure of third-party subprocessors.',
          },
          {
            id: 'nhs-cl-6',
            clauseRef: 'REQ-3.2',
            pageNumber: 97,
            requirementId: 'nhs-req-6',
            paragraphText:
              '3.2 Source Code Escrow & Step-In Rights. Supplier must deposit full platform source code, build pipelines, and proprietary deployment scripts into a tri-party source code escrow account updated quarterly, with automatic release upon SLA default exceeding 48 hours.',
          },
        ],
      },
      {
        id: 'nhs-sec-4',
        code: 'Sec 4',
        title: 'Commercial & Service Credits',
        pageRange: 'pp. 119–152',
        clauses: [
          {
            id: 'nhs-cl-7',
            clauseRef: 'REQ-4.1',
            pageNumber: 126,
            requirementId: 'nhs-req-7',
            paragraphText:
              '4.1 Fixed-Fee Transition & Payment Schedule. Implementation milestones shall be priced on a firm fixed-fee basis with zero travel surcharges. Invoices shall be settled on Net 60 terms following written acceptance by the Trust Programme Director.',
          },
        ],
      },
    ],
    requirements: [
      {
        id: 'nhs-req-1',
        tenderId: 'tnd-nhs-cloud',
        clauseRef: 'REQ-1.1',
        sectionId: 'nhs-sec-1',
        pageNumber: 14,
        title: '99.95% monthly uptime & <=15m RTO multi-zone failover',
        summary: 'Requires 99.95% SLA, automated multi-AZ failover, RTO <= 15m, RPO <= 5m.',
        category: 'Technical',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'Fully covered by existing three-AZ production architecture (12m measured RTO).',
        confidence: 98,
        ownerId: 'tm-david',
        draftResponse:
          'Confirmed compliant. Our production platform operates across three geographically isolated UK availability zones with automated failover, guaranteeing 99.95% monthly uptime, <15 minute RTO, and <60 second RPO.',
        responseApproved: true,
        sourceQuote:
          'The proposed platform shall maintain a minimum 99.95% monthly service availability across all production clinical interfaces, backed by automated multi-zone failover with a Recovery Time Objective (RTO) not exceeding 15 minutes.',
      },
      {
        id: 'nhs-req-2',
        tenderId: 'tnd-nhs-cloud',
        clauseRef: 'REQ-1.2',
        sectionId: 'nhs-sec-1',
        pageNumber: 22,
        title: 'HL7 FHIR R4 ingestion at 12,000 events/sec (<180ms p99)',
        summary: 'Bidirectional FHIR R4 APIs sustaining 12k EPS at p99 < 180ms with zero-downtime upgrades.',
        category: 'Technical',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'Load test benchmark from October 2026 verified 16,400 EPS at 134ms p99.',
        confidence: 95,
        ownerId: 'tm-david',
        draftResponse:
          'Confirmed compliant. Our FHIR R4 ingestion gateway sustained 16,400 events/sec at 134ms p99 latency during independent October 2026 stress testing with zero dropped messages across rolling Kubernetes deployments.',
        responseApproved: true,
        sourceQuote:
          'The Supplier must deliver native bidirectional HL7 FHIR R4 REST APIs capable of ingesting 12,000 clinical events per second at p99 latency below 180 milliseconds.',
      },
      {
        id: 'nhs-req-3',
        tenderId: 'tnd-nhs-cloud',
        clauseRef: 'REQ-2.1',
        sectionId: 'nhs-sec-2',
        pageNumber: 41,
        title: 'UK-only sovereign data residency & NHS DSPT accreditation',
        summary: 'Patient data, DR replicas, and logs pinned to UK-only data centers with ISO 27001 & DSPT.',
        category: 'Security',
        status: 'compliant',
        riskSeverity: 'Medium',
        riskNote: 'Confirm London (eu-west-2) + UK South DR pairing and attach DSPT certificate.',
        confidence: 96,
        ownerId: 'tm-marcus',
        draftResponse:
          'Confirmed compliant. All tenant workloads, backups, and telemetry are pinned exclusively within ISO 27001:2022 accredited UK data centers (London primary, UK South DR) with zero cross-border egress and active NHS DSPT Exceeds status.',
        responseApproved: true,
        sourceQuote:
          'All patient-identifiable data, backups, disaster recovery replicas, and operational audit logs shall reside strictly within UK-only data centers accredited to ISO/IEC 27001:2022.',
      },
      {
        id: 'nhs-req-4',
        tenderId: 'tnd-nhs-cloud',
        clauseRef: 'REQ-2.2',
        sectionId: 'nhs-sec-2',
        pageNumber: 49,
        title: 'NHS CIS2 federated SSO & real-time Sentinel SIEM stream',
        summary: 'OIDC/SAML 2.0 integration with CIS2, hardware MFA, and signed audit logs to Sentinel.',
        category: 'Security',
        status: 'pending',
        riskSeverity: 'Medium',
        riskNote: 'Pending verification of CIS2 smartcard claim mapping with Security Engineering.',
        confidence: 91,
        ownerId: 'tm-marcus',
        draftResponse:
          'Partially drafted: SAML 2.0 / OIDC and Microsoft Sentinel streaming are production-ready. Finalizing CIS2 smartcard attribute schema verification prior to sign-off.',
        responseApproved: false,
        sourceQuote:
          'The solution shall integrate with NHS Care Identity Service 2 (CIS2) via OIDC/SAML 2.0, enforce hardware MFA for all privileged administrators, and stream immutable audit trails to Microsoft Sentinel.',
      },
      {
        id: 'nhs-req-5',
        tenderId: 'tnd-nhs-cloud',
        clauseRef: 'REQ-3.1',
        sectionId: 'nhs-sec-3',
        pageNumber: 84,
        title: 'Uncapped data breach indemnification & consequential damages',
        summary: 'Requires unlimited liability including consequential damages for clinical data breaches.',
        category: 'Legal',
        status: 'high_risk',
        riskSeverity: 'High',
        riskNote: 'Triggered rule "Uncapped Liability & Broad Indemnity": Exceeds board risk threshold; submit qualified exception capping super-cap at 2x annual fees.',
        confidence: 99,
        ownerId: 'tm-elena',
        draftResponse:
          'Exception proposed: While we accept a dedicated data protection super-cap equal to 2x annual contract value (up to $5M) backed by cyber liability insurance, corporate policy prohibits unlimited liability for indirect or consequential damages.',
        responseApproved: false,
        sourceQuote:
          'Supplier shall assume unlimited liability and indemnify and hold harmless the Authority without cap for any direct, indirect, or consequential damages arising from unauthorized disclosure.',
      },
      {
        id: 'nhs-req-6',
        tenderId: 'tnd-nhs-cloud',
        clauseRef: 'REQ-3.2',
        sectionId: 'nhs-sec-3',
        pageNumber: 97,
        title: 'Tri-party source code escrow with 48-hour SLA release trigger',
        summary: 'Quarterly source code escrow deposit with automatic release upon 48h SLA outage.',
        category: 'Legal',
        status: 'high_risk',
        riskSeverity: 'High',
        riskNote: 'Triggered rule "Source Code Escrow & IP Assignment": 48-hour release trigger is unacceptable; restrict escrow release strictly to insolvency/cessation of business.',
        confidence: 97,
        ownerId: 'tm-elena',
        draftResponse:
          'Conditional compliance: We support Iron Mountain SaaS Continuity Escrow updated semi-annually, with release events restricted strictly to bankruptcy or permanent cessation of business operations.',
        responseApproved: false,
        sourceQuote:
          'Supplier must deposit full platform source code, build pipelines, and proprietary deployment scripts into a tri-party source code escrow account updated quarterly.',
      },
      {
        id: 'nhs-req-7',
        tenderId: 'tnd-nhs-cloud',
        clauseRef: 'REQ-4.1',
        sectionId: 'nhs-sec-4',
        pageNumber: 126,
        title: 'Fixed-fee implementation & Net 60 milestone invoicing',
        summary: 'Firm fixed-fee transition with no travel surcharges and Net 60 payment terms.',
        category: 'Commercial',
        status: 'pending',
        riskSeverity: 'Medium',
        riskNote: 'Deal Desk reviewing 1.8% working capital adjustment for Net 60 vs standard Net 45.',
        confidence: 93,
        ownerId: 'tm-priya',
        draftResponse:
          'Confirmed fixed-fee transition schedule with remote-first delivery eliminating travel expenses. Requesting 15-day deemed acceptance window on milestones.',
        responseApproved: false,
        sourceQuote:
          'Implementation milestones shall be priced on a firm fixed-fee basis with zero travel surcharges. Invoices shall be settled on Net 60 terms.',
      },
    ],
  },
  {
    id: 'tnd-eurogrid',
    refNumber: 'RFP-2026-9014',
    title: 'EuroGrid Smart Substation Telemetry & Compliance Suite',
    issuingAuthority: 'EuroGrid Transmission GmbH',
    sector: 'Energy & Critical Infrastructure',
    contractValue: 3200000,
    currency: 'USD',
    deadlineDate: '2026-12-01',
    pageCount: 142,
    uploadedAt: '2026-11-14',
    leadOwnerId: 'tm-sarah',
    winProbability: 71,
    executiveSummary:
      'Pan-European substation monitoring tender under NIS2 Directive requirements. Strong alignment on Frankfurt sovereign hosting; one commercial liquidated damages clause requires redline.',
    sections: [
      {
        id: 'eg-sec-1',
        code: 'Sec 1',
        title: 'NIS2 Cybersecurity & EU Residency',
        pageRange: 'pp. 8–42',
        clauses: [
          {
            id: 'eg-cl-1',
            clauseRef: 'REQ-1.1',
            pageNumber: 11,
            requirementId: 'eg-req-1',
            paragraphText:
              '1.1 NIS2 Incident Notification. Contractor shall provide initial automated security incident telemetry within 4 hours and formal root-cause disclosure within 24 hours in full conformance with EU NIS2 Directive Article 23.',
          },
          {
            id: 'eg-cl-2',
            clauseRef: 'REQ-1.2',
            pageNumber: 28,
            requirementId: 'eg-req-2',
            paragraphText:
              '1.2 Frankfurt Sovereign Hosting. All operational SCADA metadata must remain within ISO 27001 / BSI C5 certified EU sovereign data centers with customer-managed HSM keys.',
          },
        ],
      },
      {
        id: 'eg-sec-2',
        code: 'Sec 2',
        title: 'Commercial Penalties & Warranty',
        pageRange: 'pp. 43–89',
        clauses: [
          {
            id: 'eg-cl-3',
            clauseRef: 'REQ-2.1',
            pageNumber: 61,
            requirementId: 'eg-req-3',
            paragraphText:
              '2.1 Delay Liquidated Damages. Failure to achieve Phase 1 substation cutover by Q3 2027 shall incur liquidated damages of 0.5% of total contract value per calendar day up to 25% of contract value.',
          },
          {
            id: 'eg-cl-4',
            clauseRef: 'REQ-2.2',
            pageNumber: 74,
            requirementId: 'eg-req-4',
            paragraphText:
              '2.2 Telemetry Retention & Export. Platform must retain 7 years of raw substation telemetry and provide lossless Parquet/CSV bulk export via authenticated API.',
          },
        ],
      },
    ],
    requirements: [
      {
        id: 'eg-req-1',
        tenderId: 'tnd-eurogrid',
        clauseRef: 'REQ-1.1',
        sectionId: 'eg-sec-1',
        pageNumber: 11,
        title: 'NIS2 4-hour incident alert & 24-hour formal report',
        summary: 'Automated security alerts within 4h and formal NIS2 Article 23 report in 24h.',
        category: 'Security',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'Covered by 24/7 SOC runbook and automated webhook notifications.',
        confidence: 96,
        ownerId: 'tm-marcus',
        draftResponse:
          'Confirmed compliant. Our 24/7 Security Operations Center issues verified incident notifications within 2 hours and full root-cause reports within 24 hours per EU NIS2 Article 23.',
        responseApproved: true,
        sourceQuote:
          'Contractor shall provide initial automated security incident telemetry within 4 hours and formal root-cause disclosure within 24 hours.',
      },
      {
        id: 'eg-req-2',
        tenderId: 'tnd-eurogrid',
        clauseRef: 'REQ-1.2',
        sectionId: 'eg-sec-1',
        pageNumber: 28,
        title: 'BSI C5 / Frankfurt EU sovereign cluster with CMEK',
        summary: 'SCADA metadata hosted in BSI C5 EU sovereign centers with customer-managed HSM.',
        category: 'Security',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'Frankfurt eu-central-1 sovereign deployment verified with AWS CloudHSM CMEK.',
        confidence: 97,
        ownerId: 'tm-marcus',
        draftResponse:
          'Confirmed compliant. Dedicated Frankfurt (eu-central-1) cluster backed by BSI C5 attestation and customer-managed HSM keys (CMEK).',
        responseApproved: true,
        sourceQuote:
          'All operational SCADA metadata must remain within ISO 27001 / BSI C5 certified EU sovereign data centers with customer-managed HSM keys.',
      },
      {
        id: 'eg-req-3',
        tenderId: 'tnd-eurogrid',
        clauseRef: 'REQ-2.1',
        sectionId: 'eg-sec-2',
        pageNumber: 61,
        title: 'Liquidated damages at 0.5%/day capped at 25% of TCV',
        summary: 'Severe daily delay penalty up to 25% of total contract value for Phase 1 cutover.',
        category: 'Commercial',
        status: 'high_risk',
        riskSeverity: 'High',
        riskNote: 'Triggered rule "Liquidated Damages & SLA Penalties": Propose 0.1% per week delay credit capped at 5% of delayed milestone fee.',
        confidence: 98,
        ownerId: 'tm-priya',
        draftResponse:
          'Commercial redline submitted: Propose 0.2% per full week of Supplier-caused delay, capped at 5% of the impacted milestone fee, subject to mutual dependency schedule.',
        responseApproved: false,
        sourceQuote:
          'Failure to achieve Phase 1 substation cutover by Q3 2027 shall incur liquidated damages of 0.5% of total contract value per calendar day up to 25%.',
      },
      {
        id: 'eg-req-4',
        tenderId: 'tnd-eurogrid',
        clauseRef: 'REQ-2.2',
        sectionId: 'eg-sec-2',
        pageNumber: 74,
        title: '7-year immutable telemetry retention & Parquet bulk export',
        summary: 'Retain 7 years of raw telemetry with lossless Parquet/CSV export APIs.',
        category: 'Technical',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'Supported via tiered object-lock storage and scheduled Parquet export jobs.',
        confidence: 94,
        ownerId: 'tm-david',
        draftResponse:
          'Confirmed compliant. Cold-tier WORM object storage retains 7+ years of immutable telemetry with scheduled Apache Parquet and CSV export endpoints.',
        responseApproved: true,
        sourceQuote:
          'Platform must retain 7 years of raw substation telemetry and provide lossless Parquet/CSV bulk export via authenticated API.',
      },
    ],
  },
  {
    id: 'tnd-apex-bank',
    refNumber: 'RFP-2026-8702',
    title: 'Global Treasury & Risk Reporting Modernization',
    issuingAuthority: 'Meridian Commercial Bank',
    sector: 'Financial Services',
    contractValue: 2650000,
    currency: 'USD',
    deadlineDate: '2026-12-08',
    pageCount: 114,
    uploadedAt: '2026-11-11',
    leadOwnerId: 'tm-priya',
    winProbability: 86,
    executiveSummary:
      'Core treasury compliance & liquidity reporting replacement. All technical, security, and commercial items are verified and approved—ready for executive final sign-off.',
    sections: [
      {
        id: 'ab-sec-1',
        code: 'Sec 1',
        title: 'Financial Controls & Auditability',
        pageRange: 'pp. 5–48',
        clauses: [
          {
            id: 'ab-cl-1',
            clauseRef: 'REQ-1.1',
            pageNumber: 12,
            requirementId: 'ab-req-1',
            paragraphText:
              '1.1 SOC 2 Type II & Annual Pen-Testing. Vendor must provide clean SOC 2 Type II bridge letters and CREST-certified annual penetration test executive summaries.',
          },
          {
            id: 'ab-cl-2',
            clauseRef: 'REQ-1.2',
            pageNumber: 29,
            requirementId: 'ab-req-2',
            paragraphText:
              '1.2 Dual-Control Approval Workflow. All liquidity journal overrides and limit adjustments shall enforce four-eyes maker-checker authorization with immutable timestamped audit trails.',
          },
        ],
      },
      {
        id: 'ab-sec-2',
        code: 'Sec 2',
        title: 'Commercial Governance',
        pageRange: 'pp. 49–88',
        clauses: [
          {
            id: 'ab-cl-3',
            clauseRef: 'REQ-2.1',
            pageNumber: 63,
            requirementId: 'ab-req-3',
            paragraphText:
              '2.1 Renewal Price Protection. Annual subscription increases upon renewal shall be capped at the lesser of 3% or regional CPI for a 5-year term.',
          },
        ],
      },
    ],
    requirements: [
      {
        id: 'ab-req-1',
        tenderId: 'tnd-apex-bank',
        clauseRef: 'REQ-1.1',
        sectionId: 'ab-sec-1',
        pageNumber: 12,
        title: 'SOC 2 Type II report & CREST annual penetration test',
        summary: 'Deliver clean SOC 2 Type II attestation and CREST penetration test summary.',
        category: 'Security',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'Latest 2026 SOC 2 Type II and CREST letter attached in Data Room.',
        confidence: 99,
        ownerId: 'tm-marcus',
        draftResponse:
          'Confirmed compliant. Current SOC 2 Type II report (unqualified opinion) and Q3 2026 CREST penetration test summary are enclosed in Appendix B.',
        responseApproved: true,
        sourceQuote:
          'Vendor must provide clean SOC 2 Type II bridge letters and CREST-certified annual penetration test executive summaries.',
      },
      {
        id: 'ab-req-2',
        tenderId: 'tnd-apex-bank',
        clauseRef: 'REQ-1.2',
        sectionId: 'ab-sec-1',
        pageNumber: 29,
        title: 'Four-eyes maker-checker authorization & audit trail',
        summary: 'Enforce dual-control approvals for liquidity overrides with immutable logging.',
        category: 'Technical',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'Native RBAC approval policy verified in sandbox demo.',
        confidence: 97,
        ownerId: 'tm-david',
        draftResponse:
          'Confirmed compliant. Configurable maker-checker approval workflows prevent self-approval and persist cryptographically chained audit events.',
        responseApproved: true,
        sourceQuote:
          'All liquidity journal overrides and limit adjustments shall enforce four-eyes maker-checker authorization with immutable timestamped audit trails.',
      },
      {
        id: 'ab-req-3',
        tenderId: 'tnd-apex-bank',
        clauseRef: 'REQ-2.1',
        sectionId: 'ab-sec-2',
        pageNumber: 63,
        title: '3% CPI renewal price protection cap over 5 years',
        summary: 'Annual subscription uplift capped at lesser of 3% or CPI.',
        category: 'Commercial',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'Pre-approved by Finance under standard 3-year+ enterprise multi-year terms.',
        confidence: 96,
        ownerId: 'tm-priya',
        draftResponse:
          'Confirmed compliant. Renewal uplifts are contractually capped at the lesser of 3.0% or US CPI-U across the 5-year agreement horizon.',
        responseApproved: true,
        sourceQuote:
          'Annual subscription increases upon renewal shall be capped at the lesser of 3% or regional CPI for a 5-year term.',
      },
    ],
  },
  {
    id: 'tnd-caltrans',
    refNumber: 'RFP-2026-9120',
    title: 'Statewide Fleet Maintenance & Asset Intelligence Portal',
    issuingAuthority: 'California Dept. of Transportation',
    sector: 'Public Infrastructure',
    contractValue: 1920000,
    currency: 'USD',
    deadlineDate: '2026-12-14',
    pageCount: 98,
    uploadedAt: '2026-11-20',
    leadOwnerId: 'tm-sarah',
    winProbability: 64,
    executiveSummary:
      'Statewide procurement covering 14,500 fleet assets. Pending WCAG 2.2 AA accessibility attestation and FedRAMP Moderate equivalency documentation.',
    sections: [
      {
        id: 'ct-sec-1',
        code: 'Sec 1',
        title: 'Accessibility & Cloud Security',
        pageRange: 'pp. 10–44',
        clauses: [
          {
            id: 'ct-cl-1',
            clauseRef: 'REQ-1.1',
            pageNumber: 17,
            requirementId: 'ct-req-1',
            paragraphText:
              '1.1 WCAG 2.2 AA & VPAT 2.5. All web dashboards and field inspection modules shall conform to WCAG 2.2 Level AA and include a current VPAT 2.5 accessibility conformance report.',
          },
          {
            id: 'ct-cl-2',
            clauseRef: 'REQ-1.2',
            pageNumber: 33,
            requirementId: 'ct-req-2',
            paragraphText:
              '1.2 FedRAMP Moderate Equivalency. Cloud hosting infrastructure shall hold FedRAMP Moderate authorization or documented third-party 3PAO equivalency with US-only GovCloud storage.',
          },
        ],
      },
      {
        id: 'ct-sec-2',
        code: 'Sec 2',
        title: 'Terms & Termination',
        pageRange: 'pp. 45–78',
        clauses: [
          {
            id: 'ct-cl-3',
            clauseRef: 'REQ-2.1',
            pageNumber: 58,
            requirementId: 'ct-req-3',
            paragraphText:
              '2.1 Termination for Convenience. The State reserves the right to terminate for convenience upon 30 days written notice without early termination fee, paying pro-rata for services rendered.',
          },
        ],
      },
    ],
    requirements: [
      {
        id: 'ct-req-1',
        tenderId: 'tnd-caltrans',
        clauseRef: 'REQ-1.1',
        sectionId: 'ct-sec-1',
        pageNumber: 17,
        title: 'WCAG 2.2 Level AA conformance & VPAT 2.5 report',
        summary: 'All interfaces must comply with WCAG 2.2 AA backed by current VPAT 2.5.',
        category: 'Technical',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'External VPAT 2.5 audit completed September 2026 with zero critical defects.',
        confidence: 95,
        ownerId: 'tm-david',
        draftResponse:
          'Confirmed compliant. Our platform meets WCAG 2.2 Level AA across desktop and mobile modules; our independent VPAT 2.5 report is enclosed.',
        responseApproved: true,
        sourceQuote:
          'All web dashboards and field inspection modules shall conform to WCAG 2.2 Level AA and include a current VPAT 2.5 accessibility conformance report.',
      },
      {
        id: 'ct-req-2',
        tenderId: 'tnd-caltrans',
        clauseRef: 'REQ-1.2',
        sectionId: 'ct-sec-1',
        pageNumber: 33,
        title: 'FedRAMP Moderate 3PAO equivalency on US GovCloud',
        summary: 'Requires FedRAMP Moderate or 3PAO equivalency package on US GovCloud.',
        category: 'Security',
        status: 'pending',
        riskSeverity: 'Medium',
        riskNote: '3PAO SSP package is in final QA review; expected ready December 3.',
        confidence: 92,
        ownerId: 'tm-marcus',
        draftResponse:
          'In progress: Infrastructure runs on AWS GovCloud (US-West/East). Attaching 3PAO FedRAMP Moderate equivalency attestation letter prior to submission.',
        responseApproved: false,
        sourceQuote:
          'Cloud hosting infrastructure shall hold FedRAMP Moderate authorization or documented third-party 3PAO equivalency with US-only GovCloud storage.',
      },
      {
        id: 'ct-req-3',
        tenderId: 'tnd-caltrans',
        clauseRef: 'REQ-2.1',
        sectionId: 'ct-sec-2',
        pageNumber: 58,
        title: 'Termination for convenience on 30 days notice',
        summary: 'State may terminate for convenience with 30 days notice and pro-rata payout.',
        category: 'Legal',
        status: 'pending',
        riskSeverity: 'Medium',
        riskNote: 'Standard public-sector fiscal appropriation clause; Legal confirming wind-down wording.',
        confidence: 94,
        ownerId: 'tm-elena',
        draftResponse:
          'Accepted with standard public-sector modification: Non-refundable committed implementation milestones remain payable upon convenience termination.',
        responseApproved: false,
        sourceQuote:
          'The State reserves the right to terminate for convenience upon 30 days written notice without early termination fee.',
      },
    ],
  },
  {
    id: 'tnd-nordic-rail',
    refNumber: 'RFP-2026-9245',
    title: 'Nordic Rail Freight Scheduling & Customs API Gateway',
    issuingAuthority: 'Nordic Rail Logistics AB',
    sector: 'Transportation & Logistics',
    contractValue: 1480000,
    currency: 'USD',
    deadlineDate: '2026-12-21',
    pageCount: 76,
    uploadedAt: '2026-11-23',
    leadOwnerId: 'tm-david',
    winProbability: 68,
    executiveSummary:
      'Cross-border customs clearance and freight scheduling tender across Sweden, Norway, and Denmark. Initial automated extraction underway on commercial schedules.',
    sections: [
      {
        id: 'nr-sec-1',
        code: 'Sec 1',
        title: 'Customs EDI & Throughput',
        pageRange: 'pp. 6–34',
        clauses: [
          {
            id: 'nr-cl-1',
            clauseRef: 'REQ-1.1',
            pageNumber: 9,
            requirementId: 'nr-req-1',
            paragraphText:
              '1.1 UN/EDIFACT & REST Dual Gateway. The gateway must process UN/EDIFACT CUSCAR manifests alongside modern JSON REST webhooks with guaranteed idempotent delivery.',
          },
          {
            id: 'nr-cl-2',
            clauseRef: 'REQ-1.2',
            pageNumber: 24,
            requirementId: 'nr-req-2',
            paragraphText:
              '1.2 Payment Terms & Retention. Invoices shall be paid Net 90 upon final acceptance of each regional corridor go-live with a 10% holdback pending 6-month warranty.',
          },
        ],
      },
    ],
    requirements: [
      {
        id: 'nr-req-1',
        tenderId: 'tnd-nordic-rail',
        clauseRef: 'REQ-1.1',
        sectionId: 'nr-sec-1',
        pageNumber: 9,
        title: 'UN/EDIFACT CUSCAR & idempotent JSON REST gateway',
        summary: 'Support both legacy EDIFACT customs manifests and modern REST webhooks.',
        category: 'Technical',
        status: 'compliant',
        riskSeverity: 'Low',
        riskNote: 'Supported via built-in EDI translation pipeline.',
        confidence: 94,
        ownerId: 'tm-david',
        draftResponse:
          'Confirmed compliant. Native UN/EDIFACT parser and idempotent REST webhook engine support concurrent corridor customs workflows.',
        responseApproved: true,
        sourceQuote:
          'The gateway must process UN/EDIFACT CUSCAR manifests alongside modern JSON REST webhooks with guaranteed idempotent delivery.',
      },
      {
        id: 'nr-req-2',
        tenderId: 'tnd-nordic-rail',
        clauseRef: 'REQ-1.2',
        sectionId: 'nr-sec-1',
        pageNumber: 24,
        title: 'Net 90 payment terms with 10% six-month holdback',
        summary: 'Extended Net 90 settlement upon final acceptance plus 10% warranty holdback.',
        category: 'Commercial',
        status: 'processing',
        riskSeverity: 'Medium',
        riskNote: 'Triggered rule "Extended Payment Terms (> Net 60)": Automated commercial margin impact model running.',
        confidence: 90,
        ownerId: 'tm-priya',
        draftResponse: '',
        responseApproved: false,
        sourceQuote:
          'Invoices shall be paid Net 90 upon final acceptance of each regional corridor go-live with a 10% holdback pending 6-month warranty.',
      },
    ],
  },
];

export const SAMPLE_RFP_TEMPLATES = [
  {
    id: 'sample-metro-transit',
    label: 'Metro Transit Fare & Telemetry RFP',
    title: 'Regional Transit Automated Fare & Telemetry Cloud',
    issuingAuthority: 'Metro Regional Transit Authority',
    sector: 'Public Transit',
    contractValue: '2450000',
    deadlineDate: '2026-12-18',
    rawText: `Section 1.1 High Availability & Latency. The fare collection cloud platform must maintain 99.99% uptime across all active transit validators with sub-200ms API authorization latency and automated disaster recovery with RTO under 10 minutes.

Section 2.1 Security & Encryption Standards. Supplier shall maintain active SOC 2 Type II and ISO 27001 certifications, enforce AES-256 encryption at rest and TLS 1.3 in transit, and support SAML 2.0 SSO with immutable audit logs for all operator roles.

Section 3.1 Liability & Indemnification. Contractor shall accept unlimited liability and indemnify and hold harmless without limit the Transit Authority for any consequential damages resulting from fare system downtime or cardholder data exposure.

Section 3.2 Source Code Escrow. Supplier must establish a source code escrow agreement refreshed every 90 days covering all proprietary fare calculation software and deployment manifests.

Section 4.1 Payment & SLA Credits. Annual SaaS subscriptions shall be invoiced on Net 90 terms upon final acceptance, and failure to meet monthly uptime shall trigger liquidated damages of 25% service credit on annual fees.`,
  },
  {
    id: 'sample-global-pharma',
    label: 'Global Pharma GxP Validation Platform',
    title: 'GxP Clinical Supply Chain Audit & Document Vault',
    issuingAuthority: 'Helios BioPharma AG',
    sector: 'Life Sciences',
    contractValue: '1750000',
    deadlineDate: '2026-12-11',
    rawText: `Section 1.1 GxP Validation & API Integration. The solution must integrate with SAP S/4HANA via REST APIs and maintain automated validation audit trails compliant with FDA 21 CFR Part 11 with 99.95% uptime SLA.

Section 2.1 EU Sovereign Data Residency. All clinical trial batch records must reside strictly within EU sovereign data centers with GDPR Data Processing Addendum and annual penetration testing.

Section 3.1 Termination Rights. Customer reserves the right to terminate for convenience with 15 days notice without early termination penalty.

Section 4.1 Pricing & Fixed Milestones. Implementation fees shall be fixed-price billed against signed UAT acceptance milestones with Net 45 payment terms.`,
  },
];
