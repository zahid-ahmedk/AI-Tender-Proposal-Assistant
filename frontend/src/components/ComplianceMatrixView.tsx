import React, { useMemo, useState } from 'react';
import { Download, CheckCircle2, AlertTriangle, Clock, ExternalLink } from 'lucide-react';
import type {
  ComplianceStatus,
  RequirementCategory,
  RequirementItem,
  TeamMember,
  TenderRecord,
} from '../types/tender';
import {
  ComplianceProgressBar,
  RiskSeverityBadge,
} from './StatusBadge';

const STATUS_SELECT_STYLES: Record<ComplianceStatus, string> = {
  compliant: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
  pending: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
  high_risk: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]',
  processing: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
};

interface ComplianceMatrixViewProps {
  tenders: TenderRecord[];
  teamMembers: TeamMember[];
  globalSearch: string;
  onUpdateRequirement: (
    tenderId: string,
    reqId: string,
    patch: Partial<RequirementItem>
  ) => void;
  onBulkUpdateRequirements: (
    pairs: Array<{ tenderId: string; reqId: string }>,
    patch: Partial<RequirementItem>
  ) => void;
  onInspectClause: (tenderId: string, reqId: string) => void;
  onExportCsv: (
    rows: Array<{
      tenderTitle: string;
      refNumber: string;
      requirement: RequirementItem;
      ownerName: string;
    }>
  ) => void;
}

export function ComplianceMatrixView({
  tenders,
  teamMembers,
  globalSearch,
  onUpdateRequirement,
  onBulkUpdateRequirements,
  onInspectClause,
  onExportCsv,
}: ComplianceMatrixViewProps) {
  const [tenderFilter, setTenderFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<'All' | RequirementCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | ComplianceStatus>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allRows = useMemo(() => {
    return tenders.flatMap((tender) =>
      tender.requirements.map((requirement) => ({
        tender,
        requirement,
        ownerName:
          teamMembers.find((m) => m.id === requirement.ownerId)?.name ?? 'Unassigned',
      }))
    );
  }, [tenders, teamMembers]);

  const filteredRows = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return allRows.filter(({ tender, requirement, ownerName }) => {
      if (tenderFilter !== 'all' && tender.id !== tenderFilter) return false;
      if (categoryFilter !== 'All' && requirement.category !== categoryFilter)
        return false;
      if (statusFilter !== 'all' && requirement.status !== statusFilter)
        return false;
      if (!q) return true;
      return (
        requirement.title.toLowerCase().includes(q) ||
        requirement.clauseRef.toLowerCase().includes(q) ||
        tender.title.toLowerCase().includes(q) ||
        ownerName.toLowerCase().includes(q)
      );
    });
  }, [allRows, tenderFilter, categoryFilter, statusFilter, globalSearch]);

  const summary = useMemo(() => {
    const total = filteredRows.length;
    const compliant = filteredRows.filter(
      (r) => r.requirement.status === 'compliant'
    ).length;
    const pending = filteredRows.filter(
      (r) => r.requirement.status === 'pending'
    ).length;
    const highRisk = filteredRows.filter(
      (r) => r.requirement.status === 'high_risk'
    ).length;
    const approved = filteredRows.filter(
      (r) => r.requirement.responseApproved
    ).length;
    const pct = total === 0 ? 0 : Math.round((compliant / total) * 100);
    return { total, compliant, pending, highRisk, approved, pct };
  }, [filteredRows]);

  const allVisibleSelected =
    filteredRows.length > 0 &&
    filteredRows.every((r) => selectedIds.includes(r.requirement.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRows.map((r) => r.requirement.id));
    }
  };

  const toggleSelectOne = (reqId: string) => {
    setSelectedIds((prev) =>
      prev.includes(reqId) ? prev.filter((id) => id !== reqId) : [...prev, reqId]
    );
  };

  const handleBulkStatus = (nextStatus: ComplianceStatus) => {
    const pairs = filteredRows
      .filter((r) => selectedIds.includes(r.requirement.id))
      .map((r) => ({ tenderId: r.tender.id, reqId: r.requirement.id }));
    if (pairs.length === 0) return;

    onBulkUpdateRequirements(pairs, {
      status: nextStatus,
      riskSeverity:
        nextStatus === 'high_risk'
          ? 'High'
          : nextStatus === 'compliant'
            ? 'Low'
            : 'Medium',
      responseApproved: nextStatus === 'compliant' ? true : undefined,
    });
    setSelectedIds([]);
  };

  return (
    <div className="space-y-5">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#0F172A]">
            Compliance &amp; Risk Matrix
          </h1>
          <p className="text-[14px] text-[#475569] mt-1">
            Audit requirements across tenders, resolve legal redlines in bulk, and export submission matrices.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onExportCsv(
              filteredRows.map((r) => ({
                tenderTitle: r.tender.title,
                refNumber: r.tender.refNumber,
                requirement: r.requirement,
                ownerName: r.ownerName,
              }))
            )
          }
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[6px] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A] whitespace-nowrap shrink-0 transition-colors"
        >
          <Download className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
          <span>Export CSV ({filteredRows.length})</span>
        </button>
      </div>

      {/* Summary Bar */}
      <section className="bg-white border border-[#E2E8F0] rounded-[8px] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
            <span className="text-[13px] text-[#475569]">
              <strong className="text-[#0F172A] tabular-nums">{summary.compliant}</strong> Compliant
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
            <span className="text-[13px] text-[#475569]">
              <strong className="text-[#0F172A] tabular-nums">{summary.pending}</strong> Pending Review
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#F43F5E]" aria-hidden="true" />
            <span className="text-[13px] text-[#475569]">
              <strong className="text-[#BE123C] tabular-nums">{summary.highRisk}</strong> High Risk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-[#64748B]">
            Full Compliance Rate
          </span>
          <ComplianceProgressBar percentage={summary.pct} widthClass="w-32" />
        </div>
      </section>

      {/* Filters & Bulk Toolbar */}
      <section className="bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <label htmlFor="matrix-tender-filter" className="sr-only">
              Filter by tender
            </label>
            <select
              id="matrix-tender-filter"
              value={tenderFilter}
              onChange={(e) => {
                setTenderFilter(e.target.value);
                setSelectedIds([]);
              }}
              className="h-8 px-2.5 bg-white border border-[#E2E8F0] rounded-[6px] text-[12px] font-medium text-[#0F172A] max-w-[240px] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="all">All Tenders ({tenders.length})</option>
              {tenders.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>

            <label htmlFor="matrix-category-filter" className="sr-only">
              Filter by category
            </label>
            <select
              id="matrix-category-filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value as 'All' | RequirementCategory);
                setSelectedIds([]);
              }}
              className="h-8 px-2.5 bg-white border border-[#E2E8F0] rounded-[6px] text-[12px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            >
              <option value="All">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Security">Security</option>
              <option value="Legal">Legal</option>
              <option value="Commercial">Commercial</option>
            </select>

            <div
              className="flex items-center gap-1 p-0.5 bg-[#F1F5F9] rounded-[6px]"
              role="tablist"
              aria-label="Filter matrix by compliance status"
            >
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'high_risk', label: 'High Risk' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'compliant', label: 'Compliant' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === tab.id}
                  onClick={() => {
                    setStatusFilter(tab.id);
                    setSelectedIds([]);
                  }}
                  className={`px-2.5 py-1 text-[12px] font-medium rounded-[4px] whitespace-nowrap shrink-0 transition-colors ${
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

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] rounded-[6px] px-2.5 py-1">
              <span className="text-[12px] font-semibold text-[#1D4ED8] tabular-nums whitespace-nowrap">
                {selectedIds.length} selected
              </span>
              <button
                type="button"
                onClick={() => handleBulkStatus('compliant')}
                className="h-7 px-2 rounded-[4px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] font-medium whitespace-nowrap"
              >
                Mark Compliant
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatus('pending')}
                className="h-7 px-2 rounded-[4px] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-[12px] font-medium whitespace-nowrap"
              >
                Mark Pending Review
              </button>
            </div>
          )}
        </div>

        {/* High-Density Matrix Data Table */}
        {filteredRows.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-[14px] font-semibold text-[#0F172A]">
              No requirements match these filters
            </p>
            <p className="text-[13px] text-[#64748B] mt-1">
              Reset the tender, category, or status filter to inspect all extracted clauses.
            </p>
            <button
              type="button"
              onClick={() => {
                setTenderFilter('all');
                setCategoryFilter('All');
                setStatusFilter('all');
              }}
              className="mt-3 h-8 px-3 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-medium text-[#0F172A]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="py-2.5 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      aria-label="Select all visible requirements"
                      className="w-4 h-4 rounded-[4px] border-[#CBD5E1] accent-[#2563EB] cursor-pointer"
                    />
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]">
                    Clause &amp; Requirement
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]">
                    Category
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]">
                    Risk
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]">
                    Status
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B]">
                    Owner
                  </th>
                  <th className="py-2.5 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B] text-right">
                    Conf.
                  </th>
                  <th className="py-2.5 px-4 text-[11px] font-semibold uppercase tracking-[0.03em] text-[#64748B] text-right">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredRows.map(({ tender, requirement, ownerName }) => {
                  const checked = selectedIds.includes(requirement.id);
                  return (
                    <tr
                      key={requirement.id}
                      className={`${
                        checked ? 'bg-[#EFF6FF]/40' : 'bg-white hover:bg-[#F8FAFC]'
                      } transition-colors`}
                    >
                      <td className="py-3 pl-4 pr-2 align-top">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelectOne(requirement.id)}
                          aria-label={`Select ${requirement.clauseRef} ${requirement.title}`}
                          className="w-4 h-4 mt-0.5 rounded-[4px] border-[#CBD5E1] accent-[#2563EB] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 min-w-[260px]">
                        <div className="text-[13px] font-semibold text-[#0F172A] leading-snug">
                          {requirement.title}
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-medium text-[#475569]">
                            {requirement.clauseRef}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[210px]">{tender.title}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">p. {requirement.pageNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-[12px] font-medium text-[#475569] whitespace-nowrap">
                        {requirement.category}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <RiskSeverityBadge severity={requirement.riskSeverity} />
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <label htmlFor={`mat-st-${requirement.id}`} className="sr-only">
                          Change status for {requirement.clauseRef}
                        </label>
                        <select
                          id={`mat-st-${requirement.id}`}
                          value={requirement.status}
                          onChange={(e) => {
                            const nextStatus = e.target.value as ComplianceStatus;
                            onUpdateRequirement(tender.id, requirement.id, {
                              status: nextStatus,
                              riskSeverity:
                                nextStatus === 'high_risk'
                                  ? 'High'
                                  : nextStatus === 'compliant'
                                    ? 'Low'
                                    : 'Medium',
                            });
                          }}
                          className={`h-7 px-2 border rounded-[6px] text-[12px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#2563EB] cursor-pointer ${STATUS_SELECT_STYLES[requirement.status]}`}
                        >
                          <option value="compliant">Compliant</option>
                          <option value="pending">Pending Review</option>
                          <option value="high_risk">High Risk</option>
                          <option value="processing">Processing</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-[12px] text-[#475569] whitespace-nowrap">
                        {ownerName}
                      </td>
                      <td className="py-3 px-3 text-right text-[12px] font-medium text-[#0F172A] tabular-nums whitespace-nowrap">
                        {requirement.confidence}%
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onInspectClause(tender.id, requirement.id)}
                          aria-label={`Open ${requirement.clauseRef} in Document Analyzer`}
                          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[4px] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] text-[12px] font-medium text-[#0F172A]"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3 h-3 text-[#64748B]" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
