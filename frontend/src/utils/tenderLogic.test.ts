import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeRfpText,
  classifyClauseCategory,
  evaluateClauseRisk,
  validateLibraryEntry,
  validateUploadForm,
} from './rfpAnalyzer';
import {
  buildComplianceMatrixCsv,
  calculatePortfolioMetrics,
  formatCurrencyCompact,
  formatDeadlineLabel,
  getDaysRemaining,
  getTenderStats,
} from './tenderMetrics';
import {
  getTenderFileKind,
  MAX_FILE_SIZE_BYTES,
  pdfItemsToParagraphs,
  sheetsToBlocks,
  validateTenderFile,
} from './documentParser';
import { INITIAL_RISK_RULES, INITIAL_TENDERS } from '../data/seedData';

test('validateUploadForm rejects empty fields with clear field-level messages', () => {
  const result = validateUploadForm({
    title: '',
    issuingAuthority: '',
    sector: '',
    contractValue: '',
    deadlineDate: '',
    sourceFiles: [],
    rawText: '',
  });
  assert.equal(result.valid, false);
  assert.ok(result.errors.title);
  assert.ok(result.errors.issuingAuthority);
  assert.ok(result.errors.contractValue);
  assert.ok(result.errors.deadlineDate);
  assert.ok(result.errors.documents);
});

test('validateUploadForm accepts valid RFP upload payload', () => {
  const result = validateUploadForm({
    title: 'City Water Telemetry Cloud',
    issuingAuthority: 'City Public Utilities',
    sector: 'Municipal',
    contractValue: '1250000',
    deadlineDate: '2026-12-15',
    sourceFiles: ['tender-package.pdf'],
    rawText:
      'Section 1.1 The vendor shall provide 99.95% uptime and SOC 2 Type II compliance across all production workloads.',
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('validateLibraryEntry enforces non-empty title, category, and body', () => {
  const invalid = validateLibraryEntry({ title: 'ab', category: 'Other', body: 'short' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.title);
  assert.ok(invalid.errors.category);
  assert.ok(invalid.errors.body);

  const valid = validateLibraryEntry({
    title: 'AES-256 Encryption Standard',
    category: 'Security',
    body: 'All customer records are encrypted at rest using AES-256-GCM and in transit with TLS 1.3.',
  });
  assert.equal(valid.valid, true);
});

test('classifyClauseCategory classifies Security, Legal, Commercial, and Technical clauses accurately', () => {
  assert.equal(
    classifyClauseCategory('Vendor shall maintain SOC 2 Type II, ISO 27001, and AES-256 encryption.'),
    'Security'
  );
  assert.equal(
    classifyClauseCategory('Supplier accepts unlimited liability and indemnification for breach.'),
    'Legal'
  );
  assert.equal(
    classifyClauseCategory('Fixed-price invoicing on Net 60 payment terms with SLA credit caps.'),
    'Commercial'
  );
  assert.equal(
    classifyClauseCategory('REST API must sustain 99.95% uptime and automated Kubernetes failover.'),
    'Technical'
  );
});

test('evaluateClauseRisk respects enabled and disabled risk rules', () => {
  const clause = 'Contractor shall accept unlimited liability for all consequential damages.';
  const withRules = evaluateClauseRisk(clause, INITIAL_RISK_RULES);
  assert.equal(withRules.severity, 'High');
  assert.equal(withRules.status, 'high_risk');

  const disabledRules = INITIAL_RISK_RULES.map((r) => ({ ...r, enabled: false }));
  const withoutRules = evaluateClauseRisk(
    'Invoices will be paid on Net 90 terms.',
    disabledRules
  );
  assert.equal(withoutRules.severity, 'Low');
  assert.equal(withoutRules.status, 'compliant');
});

test('analyzeRfpText parses multi-paragraph RFP into structured sections and requirements', () => {
  const tender = analyzeRfpText(
    {
      title: 'Federal Aviation Analytics Portal',
      issuingAuthority: 'FAA Procurement',
      sector: 'Aviation',
      contractValue: '3100000',
      deadlineDate: '2026-12-20',
      sourceFiles: ['faa-rfp.docx'],
      rawText:
        'Section 1.1 The cloud platform must guarantee 99.95% uptime and automated failover.\n\nSection 2.1 Supplier shall accept unlimited liability and source code escrow obligations.',
    },
    INITIAL_RISK_RULES,
    '2026-11-25'
  );

  assert.equal(tender.title, 'Federal Aviation Analytics Portal');
  assert.equal(tender.contractValue, 3100000);
  assert.equal(tender.requirements.length, 2);
  assert.ok(tender.sections.length >= 2);
  assert.equal(
    tender.requirements[0].title.startsWith('The cloud platform'),
    true
  );
  assert.equal(
    tender.requirements.some((r) => r.status === 'high_risk'),
    true
  );
});

test('getTenderStats and calculatePortfolioMetrics compute exact compliance and deadlines', () => {
  const nhs = INITIAL_TENDERS[0];
  const stats = getTenderStats(nhs);
  assert.equal(stats.totalRequirements, 7);
  assert.equal(stats.compliantCount, 3);
  assert.equal(stats.pendingCount, 2);
  assert.equal(stats.highRiskCount, 2);
  assert.equal(stats.stage, 'High Risk');
  // (3 * 1.0 + 2 * 0.45) / 7 = 3.9 / 7 = 55.7% -> 56%
  assert.equal(stats.complianceScore, 56);

  const portfolio = calculatePortfolioMetrics(INITIAL_TENDERS, '2026-11-25');
  assert.equal(portfolio.activeTendersCount, 5);
  assert.equal(portfolio.deadlinesWithin7Days, 2); // Nov 29 & Dec 1
  assert.equal(portfolio.totalHighRiskFlags, 3); // 2 NHS + 1 EuroGrid
  assert.equal(formatCurrencyCompact(portfolio.totalPipelineValue), '$14.10M');
  assert.equal(getDaysRemaining('2026-11-29', '2026-11-25'), 4);
  assert.equal(formatDeadlineLabel('2026-11-29', '2026-11-25'), '4 days left');
});

test('buildComplianceMatrixCsv properly escapes commas and quotes', () => {
  const csv = buildComplianceMatrixCsv([
    {
      refNumber: 'RFP-2026-8841',
      tenderTitle: 'NHS Digital, Cloud Platform',
      ownerName: 'Elena Rostova',
      requirement: {
        ...INITIAL_TENDERS[0].requirements[0],
        draftResponse: 'Confirmed "compliant", zero exceptions.',
      },
    },
  ]);

  const lines = csv.split('\n');
  assert.equal(lines.length, 2);
  assert.ok(lines[0].startsWith('Tender Ref,Tender Name,Clause Ref'));
  assert.ok(lines[1].includes('"NHS Digital, Cloud Platform"'));
  assert.ok(lines[1].includes('"Confirmed ""compliant"", zero exceptions."'));
});

test('validateUploadForm flags files that yielded no usable text', () => {
  const result = validateUploadForm({
    title: 'City Water Telemetry Cloud',
    issuingAuthority: 'City Public Utilities',
    sector: 'Municipal',
    contractValue: '1250000',
    deadlineDate: '2026-12-15',
    sourceFiles: ['scan.pdf'],
    rawText: '   ',
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.documents ?? '', /extracted/i);
});

test('validateTenderFile accepts PDF/DOCX/XLSX and rejects everything else', () => {
  assert.equal(validateTenderFile({ name: 'Tender.PDF', size: 1000 }), null);
  assert.equal(validateTenderFile({ name: 'terms.docx', size: 1000 }), null);
  assert.equal(validateTenderFile({ name: 'pricing.xlsx', size: 1000 }), null);
  assert.match(validateTenderFile({ name: 'notes.txt', size: 10 }) ?? '', /unsupported/i);
  assert.match(validateTenderFile({ name: 'old.doc', size: 10 }) ?? '', /legacy/i);
  assert.match(validateTenderFile({ name: 'old.xls', size: 10 }) ?? '', /legacy/i);
  assert.match(validateTenderFile({ name: 'empty.pdf', size: 0 }) ?? '', /empty/i);
  assert.match(
    validateTenderFile({ name: 'huge.pdf', size: MAX_FILE_SIZE_BYTES + 1 }) ?? '',
    /limit/i
  );
  assert.equal(getTenderFileKind('a.b.xlsx'), 'xlsx');
});

test('pdfItemsToParagraphs rebuilds lines, joins wrapped text and splits on clause starts and gaps', () => {
  const item = (str: string, x: number, y: number) => ({ str, transform: [1, 0, 0, 1, x, y] });
  const paragraphs = pdfItemsToParagraphs([
    // Given out of order on purpose.
    item('99.95% uptime.', 120, 700),
    item('Section 1.1 The platform must guarantee', 50, 712),
    item('Section', 50, 688), // one line split across two fragments
    item('2.1 Supplier shall accept unlimited liability.', 90, 688),
    item('Payment terms are net 30.', 50, 640), // large gap -> new paragraph
  ]);
  assert.equal(paragraphs.length, 3);
  assert.match(paragraphs[0], /^Section 1\.1 The platform must guarantee/);
  assert.ok(paragraphs[1].startsWith('Section 2.1'));
  assert.equal(paragraphs[2], 'Payment terms are net 30.');
});

test('sheetsToBlocks emits one block per non-empty row across all sheets', () => {
  const blocks = sheetsToBlocks([
    { sheet: 'Requirements', data: [['ID', 'Requirement'], ['R1', 'SOC 2 Type II required'], [null, null]] },
    { sheet: 'Pricing', data: [['Fixed price', 125000, new Date('2026-12-01T00:00:00Z')]] },
  ]);
  assert.deepEqual(blocks, [
    'ID | Requirement',
    'R1 | SOC 2 Type II required',
    'Fixed price | 125000 | 2026-12-01',
  ]);
});

test('starter risk rules are construction-specific and fire on typical construction clauses', () => {
  const text = INITIAL_RISK_RULES.map((r) => `${r.name} ${r.keywords.join(' ')} ${r.guidance}`).join(' ');
  assert.doesNotMatch(text, /soc\s*2|hipaa|fedramp|saas|source code/i);

  const cases: [string, string, string][] = [
    ['Contractor shall pay liquidated damages of 0.5% per day of delay.', 'High', 'rule-delay-damages'],
    ['The Contractor bears the risk of all unforeseen ground conditions.', 'High', 'rule-ground-conditions'],
    ['The works shall be fit for purpose and the Contractor assumes design responsibility.', 'High', 'rule-design-responsibility'],
    ['A performance bond of 10% of the contract sum is required before mobilisation.', 'Medium', 'rule-bonds'],
    ['Ten percent retention shall be held until final acceptance.', 'Medium', 'rule-payment-retention'],
  ];
  for (const [clause, severity, ruleId] of cases) {
    const result = evaluateClauseRisk(clause, INITIAL_RISK_RULES);
    const rule = INITIAL_RISK_RULES.find((r) => r.id === ruleId)!;
    assert.equal(result.severity, severity, clause);
    assert.ok(result.riskNote.includes(rule.name), `${clause} -> expected "${rule.name}", got: ${result.riskNote}`);
  }
});

test('starter risk rules have unique ids and only use severities the analyzer acts on', () => {
  const ids = INITIAL_RISK_RULES.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(INITIAL_RISK_RULES.every((r) => r.severity === 'High' || r.severity === 'Medium'));
  assert.ok(INITIAL_RISK_RULES.every((r) => r.keywords.length > 0 && r.enabled));
});
