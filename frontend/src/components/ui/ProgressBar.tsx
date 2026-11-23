import { cn } from "@/utils/cn";

type Tone = "primary" | "success" | "warning" | "error";
const FILL: Record<Tone, string> = {
  primary: "bg-primary-container",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-error",
};

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  tone?: Tone;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, tone = "primary", label, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("w-full bg-surface-container h-1.5 rounded-full overflow-hidden", className)}
    >
      <div className={cn("h-full rounded-full transition-all", FILL[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}
