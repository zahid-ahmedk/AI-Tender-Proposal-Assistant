import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  Download,
  FileSearch,
  RefreshCw,
  Search,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import type {
  AnswerLibraryEntry,
  ComplianceStatus,
  RequirementCategory,
  RequirementItem,
  TeamMember,
  TenderRecord,
} from '../types/tender';
import {
  formatCurrencyFull,
  formatDeadlineLabel,
  getTenderStats,
} from '../utils/tenderMetrics';
import {
  ComplianceProgressBar,
  ComplianceStatusBadge,
  RiskSeverityBadge,
} from './StatusBadge';

interface DocumentAnalyzerViewProps {
  tenders: TenderRecord[];
  activeTender: TenderRecord;
  selectedRequirementId: string | null;
  teamMembers: TeamMember[];
  libraryEntries: AnswerLibraryEntry[];
  onSelectTender: (tenderId: string) => void;
  onSelectRequirement: (reqId: string | null) => void;
  onUpdateRequirement: (
    tenderId: string,
    reqId: string,
    patch: Partial<RequirementItem>
  ) => void;
  onRescanTender: (tenderId: string) => void;
  onExportTenderCsv: (tender: TenderRecord) => void;
  onUseLibraryEntry: (entryId: string) => void;
}

export function DocumentAnalyzerView({
  tenders,
  activeTender,
  selectedRequirementId,
  teamMembers,
  libraryEntries,
  onSelectTender,
  onSelectRequirement,
  onUpdateRequirement,
  onRescanTender,
  onExportTenderCsv,
  onUseLibraryEntry,
}: DocumentAnalyzerViewProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | ComplianceStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'All' | RequirementCategory>('All');
  const [docSearch, setDocSearch] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>(
    activeTender.sections[0]?.id ?? ''
  );
  const [showLibraryPickerFor, setShowLibraryPickerFor] = useState<string | null>(null);
  const [rescanFeedback, setRescanFeedback] = useState(false);

  const clauseRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reqCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setShowLibraryPickerFor(null);
    if (selectedRequirementId) {
      const targetReq = activeTender.requirements.find(
        (r) => r.id === selectedRequirementId
      );
      if (targetReq) {
        setActiveSectionId(targetReq.sectionId);
        const matchingClause = activeTender.sections
          .flatMap((s) => s.clauses)
          .find((c) => c.requirementId === targetReq.id);
        window.requestAnimationFrame(() => {
          if (matchingClause) {
            clauseRefs.current[matchingClause.id]?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
          reqCardRefs.current[targetReq.id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        });
        return;
      }
    }
    setActiveSectionId(activeTender.sections[0]?.id ?? '');
  }, [activeTender.id, selectedRequirementId]);

  // Keep selected requirement valid when switching tenders
  const effectiveSelectedId = useMemo(() => {
    if (
      selectedRequirementId &&
      activeTender.requirements.some((r) => r.id === selectedRequirementId)
    ) {
      return selectedRequirementId;
    }
    return activeTender.requirements[0]?.id ?? null;
  }, [activeTender, selectedRequirementId]);

  const stats = useMemo(() => getTenderStats(activeTender), [activeTender]);

  const filteredRequirements = useMemo(() => {
    return activeTender.requirements.filter((req) => {
      if (statusFilter !== 'all' && req.status !== statusFilter) return false;
      if (categoryFilter !== 'All' && req.category !== categoryFilter) return false;
      return true;
    });
  }, [activeTender.requirements, statusFilter, categoryFilter]);

  const handleJumpToCitation = (req: RequirementItem) => {
    onSelectRequirement(req.id);
    setActiveSectionId(req.sectionId);
    const matchingClause = activeTender.sections
      .flatMap((s) => s.clauses)
      .find((c) => c.requirementId === req.id);
    if (matchingClause) {
      const el = clauseRefs.current[matchingClause.id];
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleRunRescan = () => {
    onRescanTender(activeTender.id);
    setRescanFeedback(true);
    window.setTimeout(() => setRescanFeedback(false), 1800);
  };

  const getClauseHighlightStyles = (reqId?: string) => {
    if (!reqId) return 'border-[#E2E8F0] bg-white';
    const req = activeTender.requirements.find((r) => r.id === reqId);
    const isSelected = effectiveSelectedId === reqId;

    if (!req) return 'border-[#E2E8F0] bg-white';

    if (req.status === 'high_risk') {
      return isSelected
        ? 'border-[#F43F5E] bg-[#FFF1F2] ring-2 ring-[#F43F5E]/20'
        : 'border-[#FECDD3] bg-[#FFF1F2]/60 hover:bg-[#FFF1F2]';
    }
    if (req.status === 'pending') {
      return isSelected
        ? 'border-[#F59E0B] bg-[#FFFBEB] ring-2 ring-[#F59E0B]/20'
        : 'border-[#FDE68A] bg-[#FFFBEB]/60 hover:bg-[#FFFBEB]';
    }
    if (req.status === 'processing') {
      return isSelected
        ? 'border-[#2563EB] bg-[#EFF6FF] ring-2 ring-[#2563EB]/20'
        : 'border-[#BFDBFE] bg-[#EFF6FF]/60 hover:bg-[#EFF6FF]';
    }
    return isSelected
      ? 'border-[#10B981] bg-[#ECFDF5] ring-2 ring-[#10B981]/20'
      : 'border-[#A7F3D0] bg-[#ECFDF5]/50 hover:bg-[#ECFDF5]';
  };

  const filteredSections = useMemo(() => {
    const q = docSearch.trim().toLowerCase();
    if (!q) return activeTender.sections;
    return activeTender.sections
      .map((sec) => ({
        ...sec,
        clauses: sec.clauses.filter(
          (cl) =>
            cl.paragraphText.toLowerCase().includes(q) ||
            cl.clauseRef.toLowerCase().includes(q)
        ),
      }))
      .filter((sec) => sec.clauses.length > 0);
  }, [activeTender.sections, docSearch]);

  return (
    <div className="space-y-4">
      {/* Contextual Tender Selector & Summary Header */}
      <section className="bg-white border border-[#E2E8F0] rounded-[8px] p-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="active-tender-select" className="sr-only">
                Select Tender Document
              </label>
              <select
                id="active-tender-select"
                value={activeTender.id}
                onChange={(e) => onSelectTender(e.target.value)}
                className="h-9 pl-3 pr-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] text-[15px] font-semibold text-[#0F172A] max-w-full sm:max-w-[440px] truncate focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                {tenders.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.refNumber})
                  </option>
                ))}
              </select>
              <ComplianceProgressBar
                percentage={stats.complianceScore}
                widthClass="w-28"
              />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#64748B]">
              <span className="font-medium text-[#475569]">
                {activeTender.issuingAuthority}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-medium text-[#0F172A]">
                {formatCurrencyFull(activeTender.contractValue)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {formatDeadlineLabel(activeTender.deadlineDate)} ({activeTender.deadlineDate})
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{activeTender.pageCount} pages</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {stats.compliantCount} compliant, {stats.pendingCount} pending,{' '}
                <strong className={stats.highRiskCount > 0 ? 'text-[#BE123C]' : 'text-[#047857]'}>
                  {stats.highRiskCount} high risk
                </strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleRunRescan}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A] whitespace-nowrap shrink-0 transition-colors"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-[#2563EB] ${rescanFeedback ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>{rescanFeedback ? 'Rules Applied' : 'Re-scan Risk Rules'}</span>
            </button>
            <button
              type="button"
              onClick={() => onExportTenderCsv(activeTender)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A] whitespace-nowrap shrink-0 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
              <span>Export Matrix CSV</span>
            </button>
          </div>
        </div>
      </section>

      {/* Split-Pane 6/6 Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Pane (6 cols): Interactive RFP Source Document Viewer */}
        <section
          aria-label="RFP Source Document Viewer"
          className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-[8px] flex flex-col lg:h-[calc(100vh-216px)] lg:min-h-[540px]"
        >
          {/* Document Toolbar */}
          <div className="px-4 py-3 border-b border-[#E2E8F0] space-y-2.5 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                <h2 className="text-[14px] font-semibold text-[#0F172A]">
                  Source RFP Document
                </h2>
              </div>
              <div className="relative w-48 sm:w-56">
                <Search
                  className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="Find in document..."
                  aria-label="Search inside RFP document"
                  className="w-full h-8 pl-8 pr-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] text-[12px] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:bg-white"
                />
              </div>
            </div>

            {/* Section Jump Strip */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {activeTender.sections.map((sec) => {
                const isSecActive = activeSectionId === sec.id;
                const shortLabel = sec.title.split(/[&,—-]/)[0].trim().split(/\s+/).slice(0, 2).join(' ');
                return (
                  <button
                    key={sec.id}
                    type="button"
                    title={`${sec.code}: ${sec.title}`}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      const firstClause = sec.clauses[0];
                      if (firstClause) {
                        clauseRefs.current[firstClause.id]?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }
                    }}
                    className={`px-2.5 py-1 rounded-[4px] text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                      isSecActive
                        ? 'bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]'
                        : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:text-[#0F172A]'
                    }`}
                  >
                    {sec.code} · {shortLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Document Body */}
          <div className="flex-1 overflow-y-auto p-5 bg-[#F8FAFC]/60 space-y-6">
            {/* Executive Summary Box */}
            <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 max-w-[72ch]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#64748B]">
                Executive Scope Brief
              </div>
              <p className="text-[13px] leading-[20px] text-[#475569] mt-1.5">
                {activeTender.executiveSummary}
              </p>
            </div>

            {filteredSections.length === 0 ? (
              <div className="p-8 text-center text-[13px] text-[#64748B]">
                No clauses match &ldquo;{docSearch}&rdquo;.
              </div>
            ) : (
              filteredSections.map((section) => (
                <div key={section.id} className="space-y-3 max-w-[72ch]">
                  <div className="flex items-baseline justify-between border-b border-[#E2E8F0] pb-1.5">
                    <h3 className="text-[15px] font-semibold text-[#0F172A]">
                      {section.code} — {section.title}
                    </h3>
                    <span className="text-[11px] font-mono text-[#64748B] tabular-nums">
                      {section.pageRange}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {section.clauses.map((clause) => {
                      const linkedReq = activeTender.requirements.find(
                        (r) => r.id === clause.requirementId
                      );
                      const isSelected = effectiveSelectedId === clause.requirementId;

                      return (
                        <div
                          key={clause.id}
                          ref={(el) => {
                            clauseRefs.current[clause.id] = el;
                          }}
                          className={`rounded-[6px] border p-3.5 transition-all duration-150 ${getClauseHighlightStyles(
                            clause.requirementId
                          )}`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[11px] font-mono font-semibold text-[#475569] tabular-nums">
                              {clause.clauseRef} · Page {clause.pageNumber}
                            </span>
                            {linkedReq && (
                              <button
                                type="button"
                                onClick={() => onSelectRequirement(linkedReq.id)}
                                className="text-[11px] font-medium text-[#2563EB] hover:underline whitespace-nowrap shrink-0"
                              >
                                {isSelected ? 'Selected in Checklist' : 'Inspect Clause'}
                              </button>
                            )}
                          </div>
                          <p className="text-[14px] leading-[22px] text-[#0F172A]">
                            {clause.paragraphText}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Pane (6 cols): Extracted Requirements & AI Compliance Checklist */}
        <section
          aria-label="Extracted Requirements Checklist"
          className="lg:col-span-6 bg-white border border-[#E2E8F0] rounded-[8px] flex flex-col lg:h-[calc(100vh-216px)] lg:min-h-[540px]"
        >
          {/* Checklist Filter Bar */}
          <div className="px-4 py-3 border-b border-[#E2E8F0] space-y-2.5 shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
                <h2 className="text-[14px] font-semibold text-[#0F172A]">
                  Extracted Compliance Checklist
                </h2>
                <span className="text-[12px] text-[#64748B] tabular-nums">
                  ({filteredRequirements.length}/{activeTender.requirements.length})
                </span>
              </div>

              <label htmlFor="category-filter-select" className="sr-only">
                Filter requirements by category
              </label>
              <select
                id="category-filter-select"
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value as 'All' | RequirementCategory)
                }
                className="h-8 px-2.5 bg-white border border-[#E2E8F0] rounded-[6px] text-[12px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Security">Security</option>
                <option value="Legal">Legal</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div
              className="flex items-center gap-1 p-0.5 bg-[#F1F5F9] rounded-[6px] overflow-x-auto"
              role="tablist"
              aria-label="Filter checklist by compliance status"
            >
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'high_risk', label: `High Risk (${stats.highRiskCount})` },
                  { id: 'pending', label: `Pending (${stats.pendingCount})` },
                  { id: 'compliant', label: `Compliant (${stats.compliantCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-2.5 py-1 text-[12px] font-medium rounded-[4px] whitespace-nowrap shrink-0 tabular-nums transition-colors ${
                    statusFilter === tab.id
                      ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                      : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Requirement List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0]">
            {filteredRequirements.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[13px] font-medium text-[#0F172A]">
                  No requirements match the current filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('all');
                    setCategoryFilter('All');
                  }}
                  className="mt-3 h-8 px-3 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-medium text-[#0F172A]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filteredRequirements.map((req) => {
                const isExpanded = effectiveSelectedId === req.id;
                const matchingLibrary = libraryEntries.filter(
                  (e) => e.category === req.category
                );

                return (
                  <div
                    key={req.id}
                    ref={(el) => {
                      reqCardRefs.current[req.id] = el;
                    }}
                    className={`p-4 transition-colors ${
                      isExpanded ? 'bg-[#F8FAFC]' : 'bg-white hover:bg-[#F8FAFC]/60'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => handleJumpToCitation(req)}
                        aria-expanded={isExpanded}
                        className="text-left flex-1 min-w-0 focus-visible:outline-none focus-visible:underline"
                      >
                        <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                          <span className="font-mono font-semibold text-[#0F172A]">
                            {req.clauseRef}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{req.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">p. {req.pageNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{req.confidence}% match</span>
                        </div>
                        <div className="text-[14px] font-semibold text-[#0F172A] mt-1 leading-snug">
                          {req.title}
                        </div>
                      </button>

                      <div className="shrink-0">
                        <ComplianceStatusBadge status={req.status} />
                      </div>
                    </div>

                    {/* Expanded Actionable Detail Panel */}
                    {isExpanded && (
                      <div className="mt-3.5 pt-3.5 border-t border-[#E2E8F0] space-y-3.5">
                        {/* Risk Assessment Note */}
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[13px] leading-[19px] text-[#475569] max-w-[65ch]">
                            <span className="font-semibold text-[#0F172A]">
                              Assessment:{' '}
                            </span>
                            {req.riskNote}
                          </p>
                          <RiskSeverityBadge severity={req.riskSeverity} />
                        </div>

                        {/* Status + Owner Inline Controls */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label
                              htmlFor={`status-${req.id}`}
                              className="block text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B] mb-1"
                            >
                              Compliance Status
                            </label>
                            <select
                              id={`status-${req.id}`}
                              value={req.status}
                              onChange={(e) => {
                                const nextStatus = e.target.value as ComplianceStatus;
                                onUpdateRequirement(activeTender.id, req.id, {
                                  status: nextStatus,
                                  riskSeverity:
                                    nextStatus === 'high_risk'
                                      ? 'High'
                                      : nextStatus === 'compliant'
                                        ? 'Low'
                                        : 'Medium',
                                });
                              }}
                              className="w-full h-9 px-2.5 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            >
                              <option value="compliant">Compliant</option>
                              <option value="pending">Pending Review</option>
                              <option value="high_risk">High Risk / Redline</option>
                              <option value="processing">Processing</option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor={`owner-${req.id}`}
                              className="block text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B] mb-1"
                            >
                              Assigned Reviewer
                            </label>
                            <select
                              id={`owner-${req.id}`}
                              value={req.ownerId}
                              onChange={(e) =>
                                onUpdateRequirement(activeTender.id, req.id, {
                                  ownerId: e.target.value,
                                })
                              }
                              className="w-full h-9 px-2.5 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                            >
                              {teamMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.name} ({member.department})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Draft Proposal Response Editor */}
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <label
                              htmlFor={`draft-${req.id}`}
                              className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]"
                            >
                              Proposal Response Draft
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setShowLibraryPickerFor(
                                    showLibraryPickerFor === req.id ? null : req.id
                                  )
                                }
                                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#2563EB] hover:text-[#1D4ED8] whitespace-nowrap"
                              >
                                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Insert Library Answer</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleJumpToCitation(req)}
                                className="inline-flex items-center gap-1 text-[12px] font-medium text-[#475569] hover:text-[#0F172A] whitespace-nowrap"
                              >
                                <ExternalLink className="w-3 h-3" aria-hidden="true" />
                                <span>Cite p. {req.pageNumber}</span>
                              </button>
                            </div>
                          </div>

                          {/* Quick Library Picker Dropdown */}
                          {showLibraryPickerFor === req.id && (
                            <div className="mb-2 border border-[#E2E8F0] rounded-[6px] bg-white divide-y divide-[#E2E8F0]">
                              {(matchingLibrary.length > 0
                                ? matchingLibrary
                                : libraryEntries
                              ).map((entry) => (
                                <button
                                  key={entry.id}
                                  type="button"
                                  onClick={() => {
                                    onUpdateRequirement(activeTender.id, req.id, {
                                      draftResponse: entry.body,
                                    });
                                    onUseLibraryEntry(entry.id);
                                    setShowLibraryPickerFor(null);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-[#F8FAFC] transition-colors block"
                                >
                                  <div className="text-[12px] font-semibold text-[#0F172A]">
                                    {entry.title}
                                  </div>
                                  <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                                    {entry.body}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}

                          <textarea
                            id={`draft-${req.id}`}
                            rows={3}
                            value={req.draftResponse}
                            onChange={(e) =>
                              onUpdateRequirement(activeTender.id, req.id, {
                                draftResponse: e.target.value,
                              })
                            }
                            placeholder="Write or insert a verified compliance response for this requirement..."
                            className="w-full p-2.5 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] leading-[19px] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                          />

                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <label className="inline-flex items-center gap-2 text-[12px] font-medium text-[#475569] cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={req.responseApproved}
                                onChange={(e) =>
                                  onUpdateRequirement(activeTender.id, req.id, {
                                    responseApproved: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 rounded-[4px] border-[#CBD5E1] accent-[#2563EB]"
                              />
                              <span>Response approved for submission</span>
                            </label>

                            {req.status !== 'compliant' && (
                              <button
                                type="button"
                                onClick={() =>
                                  onUpdateRequirement(activeTender.id, req.id, {
                                    status: 'compliant',
                                    riskSeverity: 'Low',
                                    responseApproved: true,
                                  })
                                }
                                className="inline-flex items-center gap-1 h-8 px-3 rounded-[6px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Approve &amp; Mark Compliant</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
