import React, { useEffect, useMemo, useState } from 'react';
import type {
  AnswerLibraryEntry,
  AppView,
  RequirementItem,
  RiskDetectionRule,
  TenderRecord,
  UploadRfpInput,
} from './types/tender';
import {
  INITIAL_LIBRARY_ENTRIES,
  INITIAL_RISK_RULES,
  INITIAL_TENDERS,
  TEAM_MEMBERS,
} from './data/seedData';
import { analyzeRfpText, evaluateClauseRisk } from './utils/rfpAnalyzer';
import {
  buildComplianceMatrixCsv,
  calculatePortfolioMetrics,
} from './utils/tenderMetrics';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { DocumentAnalyzerView } from './components/DocumentAnalyzerView';
import { ComplianceMatrixView } from './components/ComplianceMatrixView';
import { AnswerLibraryView } from './components/AnswerLibraryView';
import { TeamRulesView } from './components/TeamRulesView';
import { UploadRfpModal } from './components/UploadRfpModal';

const STORAGE_KEYS = {
  tenders: 'tenderiq_tenders_v1',
  library: 'tenderiq_library_v1',
  rules: 'tenderiq_rules_v1',
};

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [tenders, setTenders] = useState<TenderRecord[]>(() =>
    readStored(STORAGE_KEYS.tenders, INITIAL_TENDERS)
  );
  const [libraryEntries, setLibraryEntries] = useState<AnswerLibraryEntry[]>(() =>
    readStored(STORAGE_KEYS.library, INITIAL_LIBRARY_ENTRIES)
  );
  const [riskRules, setRiskRules] = useState<RiskDetectionRule[]>(() =>
    readStored(STORAGE_KEYS.rules, INITIAL_RISK_RULES)
  );

  const [activeView, setActiveView] = useState<AppView>('overview');
  const [activeTenderId, setActiveTenderId] = useState<string>(
    () => tenders[0]?.id ?? INITIAL_TENDERS[0].id
  );
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(
    null
  );
  const [globalSearch, setGlobalSearch] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Sync persisted workspace state
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.tenders, JSON.stringify(tenders));
    } catch {
      // Ignore storage quota errors
    }
  }, [tenders]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.library,
        JSON.stringify(libraryEntries)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [libraryEntries]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.rules, JSON.stringify(riskRules));
    } catch {
      // Ignore storage quota errors
    }
  }, [riskRules]);

  const activeTender = useMemo(
    () => tenders.find((t) => t.id === activeTenderId) ?? tenders[0],
    [tenders, activeTenderId]
  );

  const portfolioMetrics = useMemo(
    () => calculatePortfolioMetrics(tenders),
    [tenders]
  );

  const handleInspectTender = (tenderId: string, reqId?: string) => {
    setActiveTenderId(tenderId);
    setSelectedRequirementId(reqId ?? null);
    setActiveView('analyzer');
  };

  const handleUpdateRequirement = (
    tenderId: string,
    reqId: string,
    patch: Partial<RequirementItem>
  ) => {
    setTenders((prev) =>
      prev.map((tender) => {
        if (tender.id !== tenderId) return tender;
        return {
          ...tender,
          requirements: tender.requirements.map((req) =>
            req.id === reqId ? { ...req, ...patch } : req
          ),
        };
      })
    );
  };

  const handleBulkUpdateRequirements = (
    pairs: Array<{ tenderId: string; reqId: string }>,
    patch: Partial<RequirementItem>
  ) => {
    const keySet = new Set(pairs.map((p) => `${p.tenderId}::${p.reqId}`));
    setTenders((prev) =>
      prev.map((tender) => ({
        ...tender,
        requirements: tender.requirements.map((req) => {
          if (!keySet.has(`${tender.id}::${req.id}`)) return req;
          const cleanPatch: Partial<RequirementItem> = { ...patch };
          if (cleanPatch.responseApproved === undefined) {
            delete cleanPatch.responseApproved;
          }
          return { ...req, ...cleanPatch };
        }),
      }))
    );
  };

  const handleSubmitNewRfp = (input: UploadRfpInput) => {
    const newTender = analyzeRfpText(input, riskRules);
    setTenders((prev) => [newTender, ...prev]);
    setActiveTenderId(newTender.id);
    setSelectedRequirementId(newTender.requirements[0]?.id ?? null);
    setActiveView('analyzer');
  };

  const rescanTenderById = (tender: TenderRecord): TenderRecord => ({
    ...tender,
    requirements: tender.requirements.map((req) => {
      // Preserve explicitly approved compliant items; re-evaluate others against current rules
      if (req.responseApproved && req.status === 'compliant') return req;
      const evaluated = evaluateClauseRisk(req.sourceQuote || req.summary, riskRules);
      return {
        ...req,
        status: evaluated.status,
        riskSeverity: evaluated.severity,
        riskNote: evaluated.riskNote,
      };
    }),
  });

  const handleRescanTender = (tenderId: string) => {
    setTenders((prev) =>
      prev.map((t) => (t.id === tenderId ? rescanTenderById(t) : t))
    );
  };

  const handleRescanAllTenders = () => {
    setTenders((prev) => prev.map((t) => rescanTenderById(t)));
  };

  const triggerCsvDownload = (csvContent: string, fileName: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportTenderCsv = (tender: TenderRecord) => {
    const rows = tender.requirements.map((requirement) => ({
      refNumber: tender.refNumber,
      tenderTitle: tender.title,
      requirement,
      ownerName:
        TEAM_MEMBERS.find((m) => m.id === requirement.ownerId)?.name ?? 'Unassigned',
    }));
    const csv = buildComplianceMatrixCsv(rows);
    triggerCsvDownload(csv, `${tender.refNumber}-compliance-matrix.csv`);
  };

  const handleExportMatrixCsv = (
    rows: Array<{
      tenderTitle: string;
      refNumber: string;
      requirement: RequirementItem;
      ownerName: string;
    }>
  ) => {
    const csv = buildComplianceMatrixCsv(rows);
    triggerCsvDownload(csv, 'tenderiq-compliance-matrix.csv');
  };

  const handleAddLibraryEntry = (
    entry: Omit<AnswerLibraryEntry, 'id' | 'lastVerified' | 'usageCount'>
  ) => {
    const created: AnswerLibraryEntry = {
      ...entry,
      id: `lib-${Date.now().toString(36)}`,
      lastVerified: '2026-11-25',
      usageCount: 0,
    };
    setLibraryEntries((prev) => [created, ...prev]);
  };

  const handleDeleteLibraryEntry = (id: string) => {
    setLibraryEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUseLibraryEntry = (id: string) => {
    setLibraryEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, usageCount: e.usageCount + 1 } : e))
    );
  };

  const handleToggleRule = (ruleId: string) => {
    setRiskRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden">
      <Sidebar
        activeView={activeView}
        onSelectView={(view) => setActiveView(view)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        highRiskCount={portfolioMetrics.totalHighRiskFlags}
        activeTendersCount={portfolioMetrics.activeTendersCount}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar
          activeView={activeView}
          activeTenderTitle={activeTender?.title}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenUploadModal={() => setUploadModalOpen(true)}
        />

        <main className="flex-1 min-w-0 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          {activeView === 'overview' && (
            <OverviewView
              tenders={tenders}
              teamMembers={TEAM_MEMBERS}
              globalSearch={globalSearch}
              onInspectTender={handleInspectTender}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onViewAllEscalations={() => setActiveView('matrix')}
            />
          )}

          {activeView === 'analyzer' && activeTender && (
            <DocumentAnalyzerView
              tenders={tenders}
              activeTender={activeTender}
              selectedRequirementId={selectedRequirementId}
              teamMembers={TEAM_MEMBERS}
              libraryEntries={libraryEntries}
              onSelectTender={(id) => {
                setActiveTenderId(id);
                setSelectedRequirementId(null);
              }}
              onSelectRequirement={setSelectedRequirementId}
              onUpdateRequirement={handleUpdateRequirement}
              onRescanTender={handleRescanTender}
              onExportTenderCsv={handleExportTenderCsv}
              onUseLibraryEntry={handleUseLibraryEntry}
            />
          )}

          {activeView === 'matrix' && (
            <ComplianceMatrixView
              tenders={tenders}
              teamMembers={TEAM_MEMBERS}
              globalSearch={globalSearch}
              onUpdateRequirement={handleUpdateRequirement}
              onBulkUpdateRequirements={handleBulkUpdateRequirements}
              onInspectClause={handleInspectTender}
              onExportCsv={handleExportMatrixCsv}
            />
          )}

          {activeView === 'library' && (
            <AnswerLibraryView
              entries={libraryEntries}
              teamMembers={TEAM_MEMBERS}
              globalSearch={globalSearch}
              onAddEntry={handleAddLibraryEntry}
              onDeleteEntry={handleDeleteLibraryEntry}
            />
          )}

          {activeView === 'team' && (
            <TeamRulesView
              tenders={tenders}
              teamMembers={TEAM_MEMBERS}
              riskRules={riskRules}
              onToggleRule={handleToggleRule}
              onRescanAll={handleRescanAllTenders}
            />
          )}
        </main>
      </div>

      <UploadRfpModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmitRfp={handleSubmitNewRfp}
      />
    </div>
  );
}
