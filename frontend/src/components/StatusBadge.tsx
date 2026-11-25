import React from 'react';
import type {
  ComplianceStatus,
  RiskSeverity,
  TenderStage,
} from '../types/tender';

export function ComplianceStatusBadge({ status }: { status: ComplianceStatus }) {
  const config: Record<
    ComplianceStatus,
    { label: string; classes: string }
  > = {
    compliant: {
      label: 'Compliant',
      classes: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    },
    pending: {
      label: 'Pending Review',
      classes: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    },
    high_risk: {
      label: 'High Risk',
      classes: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]',
    },
    processing: {
      label: 'Processing',
      classes: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    },
  };

  const item = config[status];
  return (
    <span
      className={`inline-flex items-center h-[22px] px-2 rounded-full border text-[11px] font-semibold tracking-[0.02em] whitespace-nowrap shrink-0 ${item.classes}`}
    >
      {item.label}
    </span>
  );
}

export function TenderStageBadge({ stage }: { stage: TenderStage }) {
  const config: Record<TenderStage, { classes: string }> = {
    'Ready to Submit': {
      classes: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    },
    'In Review': {
      classes: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    },
    'High Risk': {
      classes: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]',
    },
    Extracting: {
      classes: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    },
  };

  return (
    <span
      className={`inline-flex items-center h-[22px] px-2 rounded-full border text-[11px] font-semibold tracking-[0.02em] whitespace-nowrap shrink-0 ${config[stage].classes}`}
    >
      {stage}
    </span>
  );
}

export function RiskSeverityBadge({ severity }: { severity: RiskSeverity }) {
  const config: Record<RiskSeverity, string> = {
    Low: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    Medium: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    High: 'bg-[#FFF1F2] text-[#BE123C] border-[#FECDD3]',
  };

  return (
    <span
      className={`inline-flex items-center h-[22px] px-2 rounded-full border text-[11px] font-semibold tracking-[0.02em] whitespace-nowrap shrink-0 ${config[severity]}`}
    >
      {severity} Risk
    </span>
  );
}

export function ComplianceProgressBar({
  percentage,
  tone = 'auto',
  widthClass = 'w-24',
}: {
  percentage: number;
  tone?: 'auto' | 'blue' | 'emerald' | 'amber' | 'rose';
  widthClass?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));

  let fillClass = 'bg-[#2563EB]';
  if (tone === 'emerald') fillClass = 'bg-[#10B981]';
  else if (tone === 'amber') fillClass = 'bg-[#F59E0B]';
  else if (tone === 'rose') fillClass = 'bg-[#F43F5E]';
  else if (tone === 'auto') {
    if (clamped >= 85) fillClass = 'bg-[#10B981]';
    else if (clamped >= 60) fillClass = 'bg-[#2563EB]';
    else fillClass = 'bg-[#F59E0B]';
  }

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${widthClass} h-[6px] bg-[#E2E8F0] rounded-full overflow-hidden shrink-0`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Compliance score ${clamped} percent`}
      >
        <div
          className={`h-full rounded-full transition-all duration-200 ${fillClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-[12px] font-medium text-[#0F172A] tabular-nums w-9 text-right shrink-0">
        {clamped}%
      </span>
    </div>
  );
}
