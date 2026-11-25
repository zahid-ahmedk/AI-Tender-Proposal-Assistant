import React from 'react';
import { RefreshCw, ShieldAlert, Users } from 'lucide-react';
import type {
  RiskDetectionRule,
  TeamMember,
  TenderRecord,
} from '../types/tender';
import { RiskSeverityBadge } from './StatusBadge';

interface TeamRulesViewProps {
  tenders: TenderRecord[];
  teamMembers: TeamMember[];
  riskRules: RiskDetectionRule[];
  onToggleRule: (ruleId: string) => void;
  onRescanAll: () => void;
}

export function TeamRulesView({
  tenders,
  teamMembers,
  riskRules,
  onToggleRule,
  onRescanAll,
}: TeamRulesViewProps) {
  const allRequirements = tenders.flatMap((t) => t.requirements);
  const enabledCount = riskRules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#0F172A]">
            Team &amp; Risk Detection Rules
          </h1>
          <p className="text-[14px] text-[#475569] mt-1">
            Configure automated procurement risk triggers and monitor reviewer assignments across active tenders.
          </p>
        </div>

        <button
          type="button"
          onClick={onRescanAll}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[6px] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A] whitespace-nowrap shrink-0 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" aria-hidden="true" />
          <span>Re-scan All Tenders</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left 7 cols: Risk Detection Rules */}
        <section
          aria-label="Automated Risk Detection Rules"
          className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden"
        >
          <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
              <h2 className="text-[15px] font-semibold text-[#0F172A]">
                Automated Clause Risk Triggers
              </h2>
            </div>
            <span className="text-[12px] text-[#64748B] tabular-nums">
              {enabledCount} of {riskRules.length} active
            </span>
          </div>

          <ul className="divide-y divide-[#E2E8F0]">
            {riskRules.map((rule) => (
              <li key={rule.id} className="p-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-[#0F172A]">
                      {rule.name}
                    </span>
                    <RiskSeverityBadge severity={rule.severity} />
                  </div>
                  <p className="text-[13px] text-[#475569] mt-1 max-w-[65ch]">
                    {rule.guidance}
                  </p>
                  <div className="text-[11px] text-[#64748B] mt-1.5">
                    <span className="font-medium text-[#475569]">{rule.category}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span className="font-mono">
                      Triggers: {rule.keywords.join(', ')}
                    </span>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 shrink-0 cursor-pointer pt-0.5">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => onToggleRule(rule.id)}
                    aria-label={`Enable ${rule.name}`}
                    className="w-4 h-4 rounded-[4px] border-[#CBD5E1] accent-[#2563EB]"
                  />
                  <span className="text-[12px] font-medium text-[#475569] w-14">
                    {rule.enabled ? 'Active' : 'Paused'}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        {/* Right 5 cols: Bid Review Team Workload */}
        <section
          aria-label="Bid Review Team"
          className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden"
        >
          <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2563EB]" aria-hidden="true" />
              <h2 className="text-[15px] font-semibold text-[#0F172A]">
                Review Team Workload
              </h2>
            </div>
            <span className="text-[12px] text-[#64748B] tabular-nums">
              {teamMembers.length} reviewers
            </span>
          </div>

          <ul className="divide-y divide-[#E2E8F0]">
            {teamMembers.map((member) => {
              const assigned = allRequirements.filter((r) => r.ownerId === member.id);
              const openRisks = assigned.filter((r) => r.status === 'high_risk').length;
              const pending = assigned.filter((r) => r.status === 'pending').length;

              return (
                <li
                  key={member.id}
                  className="px-4 py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-[6px] bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] text-[12px] font-semibold flex items-center justify-center shrink-0">
                      {member.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[#0F172A] truncate">
                        {member.name}
                      </div>
                      <div className="text-[12px] text-[#64748B] truncate">
                        {member.role} · {member.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 tabular-nums">
                    <div className="text-[13px] font-semibold text-[#0F172A]">
                      {assigned.length} clauses
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      {openRisks > 0 ? (
                        <span className="text-[#BE123C] font-medium">
                          {openRisks} risk
                        </span>
                      ) : (
                        <span>0 risk</span>
                      )}
                      {' · '}
                      <span>{pending} pending</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
