import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";

export type BadgeTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "success"
  | "warning"
  | "danger";

/** [pill classes, dot classes] — colours as used for statuses across the designs. */
const TONE: Record<BadgeTone, [string, string]> = {
  neutral: ["bg-surface-container text-secondary", "bg-outline"],
  primary: ["bg-primary-fixed text-on-primary-fixed", "bg-primary-container"],
  secondary: ["bg-secondary-container text-on-secondary-fixed", "bg-primary-container"],
  tertiary: ["bg-tertiary-fixed text-on-tertiary-fixed", "bg-tertiary-container"],
  error: ["bg-error-container text-on-error-container", "bg-error"],
  success: ["bg-emerald-100 text-emerald-800", "bg-emerald-500"],
  warning: ["bg-amber-100 text-amber-900", "bg-amber-500"],
  danger: ["bg-rose-100 text-rose-800", "bg-rose-500"],
};

interface BadgeProps {
  tone?: BadgeTone;
  size?: "sm" | "md";
  /** Leading coloured dot */
  dot?: boolean;
  /** Leading Material Symbols icon */
  icon?: string;
  bold?: boolean;
  children: ReactNode;
  className?: string;
}

/** Rounded status pill. */
export function Badge({ tone = "neutral", size = "sm", dot, icon, bold, children, className }: BadgeProps) {
  const [pill, dotColor] = TONE[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5" : "px-2.5 py-1",
        bold && "font-semibold",
        pill,
        className,
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColor)} />}
      {icon && <Icon name={icon} className="text-[14px]" />}
      {children}
    </span>
  );
}
