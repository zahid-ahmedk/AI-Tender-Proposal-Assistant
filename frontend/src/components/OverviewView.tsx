import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  AlertTriangle,
  Clock,
  FileText,
  ArrowUpDown,
} from 'lucide-react';
import type {
  RequirementItem,
  TeamMember,
  TenderRecord,
  TenderStage,
} from '../types/tender';
import {
  calculatePortfolioMetrics,
  formatCurrencyCompact,
  formatCurrencyFull,
  formatDeadlineLabel,
  getDaysRemaining,
  getTenderStats,
} from '../utils/tenderMetrics';
import {
  ComplianceProgressBar,
  RiskSeverityBadge,
  TenderStageBadge,
} from './StatusBadge';

interface OverviewViewProps {
  tenders: TenderRecord[];
  teamMembers: TeamMember[];
  globalSearch: string;
  onInspectTender: (tenderId: string, requirementId?: string) => void;
  onOpenUploadModal: () => void;
  onViewAllEscalations: () => void;
}

type StageFilter = 'All' | TenderStage;
type SortField = 'deadline' | 'value' | 'compliance';

export function OverviewView({
  tenders,
  teamMembers,
  globalSearch,
  onInspectTender,
  onOpenUploadModal,
  onViewAllEscalations,
}: OverviewViewProps) {
  const [stageFilter, setStageFilter] = useState<StageFilter>('All');
  const [sortBy, setSortBy] = useState<SortField>('deadline');

  const portfolio = useMemo(() => calculatePortfolioMetrics(tenders), [tenders]);

  const enrichedTenders = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();
    return tenders
      .map((tender) => ({
        tender,
        stats: getTenderStats(tender),
        daysLeft: getDaysRemaining(tender.deadlineDate),
      }))
      .filter(({ tender, stats }) => {
        if (stageFilter !== 'All' && stats.stage !== stageFilter) return false;
        if (!query) return true;
        return (
          tender.title.toLowerCase().includes(query) ||
          tender.issuingAuthority.toLowerCase().includes(query) ||
          tender.refNumber.toLowerCase().includes(query) ||
          tender.sector.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') return a.daysLeft - b.daysLeft;
        if (sortBy === 'value') return b.tender.contractValue - a.tender.contractValue;
        return a.stats.complianceScore - b.stats.complianceScore;
      });
  }, [tenders, stageFilter, globalSearch, sortBy]);

  const priorityRisks = useMemo(() => {
    const items: Array<{
      tender: TenderRecord;
      requirement: RequirementItem;
      daysLeft: number;
    }> = [];

    for (const tender of tenders) {
      const daysLeft = getDaysRemaining(tender.deadlineDate);
      for (const req of tender.requirements) {
        if (req.status === 'high_risk' || (req.status === 'pending' && daysLeft <= 7)) {
          items.push({ tender, requirement: req, daysLeft });
        }
      }
    }

    return items.sort((a, b) => {
      if (a.requirement.status === 'high_risk' && b.requirement.status !== 'high_risk') {
        return -1;
      }
      if (b.requirement.status === 'high_risk' && a.requirement.status !== 'high_risk') {
        return 1;
      }
      return a.daysLeft - b.daysLeft;
    });
  }, [tenders]);

  const getOwnerName = (id: string) =>
    teamMembers.find((m) => m.id === id)?.name ?? 'Unassigned';

  const filterTabs: StageFilter[] = [
    'All',
    'High Risk',
    'In Review',
    'Ready to Submit',
  ];

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#0F172A]">
            Tender Pipeline Overview
          </h1>
          <p className="text-[14px] text-[#475569] mt-1">
            Monitor active procurement bids, automated compliance readiness, and legal redline blockers.
          </p>
        </div>
        <div className="text-[12px] text-[#64748B] tabular-nums">
          {portfolio.totalRequirementsCount} extracted clauses across {portfolio.activeTendersCount} tenders
        </div>
      </div>

      {/* 4-Column Flat KPI Strip */}
      <section
        aria-label="Portfolio summary metrics"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-4">
          <div className="text-[12px] font-medium text-[#64748B]">
            Active Tenders
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[28px] leading-[34px] font-bold tracking-[-0.02em] text-[#0F172A] tabular-nums">
              {portfolio.activeTendersCount}
            </span>
            <span className="text-[12px] text-[#475569] tabular-nums">
              {formatCurrencyCompact(portfolio.totalPipelineValue)} gross
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-4">
          <div className="text-[12px] font-medium text-[#64748B]">
            Weighted Pipeline Value
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[28px] leading-[34px] font-bold tracking-[-0.02em] text-[#0F172A] tabular-nums">
              {formatCurrencyCompact(portfolio.weightedPipelineValue)}
            </span>
            <span className="text-[12px] text-[#047857] font-medium tabular-nums">
              Win-adjusted
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-4">
          <div className="text-[12px] font-medium text-[#64748B]">
            Avg. Compliance Score
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-[28px] leading-[34px] font-bold tracking-[-0.02em] text-[#0F172A] tabular-nums">
              {portfolio.averageComplianceScore}%
            </span>
            <div className="w-24 h-[6px] bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2563EB] rounded-full transition-all duration-200"
                style={{ width: `${portfolio.averageComplianceScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-4">
          <div className="text-[12px] font-medium text-[#64748B]">
            Due Within 7 Days
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-[28px] leading-[34px] font-bold tracking-[-0.02em] text-[#0F172A] tabular-nums">
              {portfolio.deadlinesWithin7Days}
            </span>
            <span className="text-[12px] font-medium text-[#BE123C] tabular-nums">
              {portfolio.totalHighRiskFlags} high-risk flags
            </span>
          </div>
        </div>
      </section>

      {/* Main 12-Column Grid: 8/4 Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left 8 Columns: Active Tenders Compact Data Table */}
        <section
          aria-label="Active tenders table"
          className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden"
        >
          <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 p-0.5 bg-[#F1F5F9] rounded-[6px]" role="tablist" aria-label="Filter tenders by status">
              {filterTabs.map((tab) => {
                const active = stageFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setStageFilter(tab)}
                    className={`px-2.5 py-1 text-[12px] font-medium rounded-[4px] whitespace-nowrap shrink-0 transition-colors ${
                      active
                        ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                        : 'text-[#475569] hover:text-[#0F172A]'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
              <label htmlFor="tender-sort-select" className="sr-only">
                Sort tenders
              </label>
              <select
                id="tender-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="h-8 px-2.5 bg-white border border-[#E2E8F0] rounded-[6px] text-[12px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              >
                <option value="deadline">Sort: Soonest Deadline</option>
                <option value="value">Sort: Highest Value</option>
                <option value="compliance">Sort: Lowest Compliance</option>
              </select>
            </div>
          </div>

          {enrichedTenders.length === 0 ? (
            <div className="p-10 text-center">
              <FileText className="w-8 h-8 text-[#94A3B8] mx-auto mb-2.5" aria-hidden="true" />
              <h2 className="text-[15px] font-semibold text-[#0F172A]">
                No matching tenders found
              </h2>
              <p className="text-[13px] text-[#64748B] mt-1 max-w-sm mx-auto">
                Adjust your search or status filter, or upload a new RFP document for automated clause extraction.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (stageFilter !== 'All') setStageFilter('All');
                  else onOpenUploadModal();
                }}
                className="mt-4 inline-flex items-center h-8 px-3 rounded-[6px] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A]"
              >
                {stageFilter !== 'All' ? 'Reset Status Filter' : 'Upload First RFP'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <th className="py-2.5 px-4 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]">
                      Tender &amp; Authority
                    </th>
                    <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B] text-right">
                      Value
                    </th>
                    <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]">
                      Compliance
                    </th>
                    <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]">
                      Deadline
                    </th>
                    <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]">
                      Status
                    </th>
                    <th className="py-2.5 px-4 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B] text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {enrichedTenders.map(({ tender, stats, daysLeft }) => (
                    <tr
                      key={tender.id}
                      className="bg-white hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <td className="py-3 px-4 min-w-[230px]">
                        <button
                          type="button"
                          onClick={() => onInspectTender(tender.id)}
                          className="text-left block w-full focus-visible:outline-none focus-visible:underline"
                        >
                          <div className="text-[14px] font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">
                            {tender.title}
                          </div>
                          <div className="text-[12px] text-[#64748B] mt-0.5 flex items-center gap-1.5 flex-wrap">
                            <span>{tender.issuingAuthority}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-[11px]">{tender.refNumber}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums">{tender.pageCount} pp</span>
                          </div>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="text-[13px] font-semibold text-[#0F172A] tabular-nums">
                          {formatCurrencyFull(tender.contractValue)}
                        </div>
                        <div className="text-[11px] text-[#64748B] tabular-nums">
                          {tender.winProbability}% win prob
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <ComplianceProgressBar
                          percentage={stats.complianceScore}
                          widthClass="w-20"
                        />
                        <div className="text-[11px] text-[#64748B] mt-0.5 tabular-nums">
                          {stats.compliantCount}/{stats.totalRequirements} clauses
                          {stats.highRiskCount > 0 ? ` · ${stats.highRiskCount} risk` : ''}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div
                          className={`text-[13px] font-medium tabular-nums ${
                            daysLeft <= 5
                              ? 'text-[#BE123C]'
                              : daysLeft <= 10
                                ? 'text-[#B45309]'
                                : 'text-[#0F172A]'
                          }`}
                        >
                          {formatDeadlineLabel(tender.deadlineDate)}
                        </div>
                        <div className="text-[11px] text-[#64748B] tabular-nums">
                          {tender.deadlineDate}
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <TenderStageBadge stage={stats.stage} />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onInspectTender(tender.id)}
                          aria-label={`Inspect ${tender.title}`}
                          className="inline-flex items-center gap-1 h-8 px-2.5 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-[12px] font-medium text-[#0F172A] transition-colors whitespace-nowrap shrink-0"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Right 4 Columns: Priority Risk & Deadline Queue */}
        <section
          aria-label="Priority risk and deadline queue"
          className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden"
        >
          <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#BE123C]" aria-hidden="true" />
              <h2 className="text-[15px] font-semibold text-[#0F172A]">
                Priority Escalations
              </h2>
            </div>
            <span className="text-[12px] font-medium text-[#64748B] tabular-nums">
              {priorityRisks.length} open
            </span>
          </div>

          {priorityRisks.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-[13px] font-medium text-[#047857]">
                No unresolved high-risk blockers across active bids.
              </p>
              <p className="text-[12px] text-[#64748B] mt-1">
                All critical legal and near-term submission clauses are cleared.
              </p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-[#E2E8F0]">
                {priorityRisks.slice(0, 4).map(({ tender, requirement, daysLeft }) => (
                  <li key={requirement.id}>
                    <button
                      type="button"
                      onClick={() => onInspectTender(tender.id, requirement.id)}
                      className="w-full text-left px-4 py-3.5 hover:bg-[#F8FAFC] transition-colors block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB]"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono font-medium text-[#475569]">
                          {requirement.clauseRef} · p. {requirement.pageNumber}
                        </span>
                        <RiskSeverityBadge severity={requirement.riskSeverity} />
                      </div>
                      <div className="text-[13px] font-semibold text-[#0F172A] mt-1.5 leading-snug">
                        {requirement.title}
                      </div>
                      <div className="text-[12px] text-[#475569] mt-1 line-clamp-2">
                        {requirement.riskNote}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748B]">
                        <span className="truncate max-w-[170px]">{tender.title}</span>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap tabular-nums shrink-0">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {getOwnerName(requirement.ownerId)} · {daysLeft}d
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
                <button
                  type="button"
                  onClick={onViewAllEscalations}
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-[#2563EB] hover:text-[#1D4ED8]"
                >
                  <span>View full compliance matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
