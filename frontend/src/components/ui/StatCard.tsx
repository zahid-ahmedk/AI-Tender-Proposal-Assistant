import type { ReactNode } from "react";
import { Card } from "./Card";
import { Icon } from "./Icon";

interface StatCardProps {
  label: string;
  value: ReactNode;
  icon?: string;
  /** Tailwind text colour for the icon, e.g. "text-error" */
  iconClassName?: string;
  /** Badge or caption shown beside the value */
  footer?: ReactNode;
}

/** KPI tile (Overview pattern): label + icon on top, large number with a badge/caption below. */
export function StatCard({ label, value, icon, iconClassName = "text-primary-container", footer }: StatCardProps) {
  return (
    <Card padding="md" hoverable className="flex flex-col justify-between gap-space-md">
      <div className="flex items-center justify-between">
        <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
        {icon && <Icon name={icon} className={`text-[18px] ${iconClassName}`} />}
      </div>
      <div className="flex items-baseline justify-between gap-space-sm">
        <span className="font-display-lg text-display-lg text-on-surface tabular-nums">{value}</span>
        {footer}
      </div>
    </Card>
  );
}
