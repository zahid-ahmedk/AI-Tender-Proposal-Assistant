import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: string;
  /** Count or badge after the label */
  trailing?: ReactNode;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  "aria-label"?: string;
}

/** Underline tabs (page-level sections). */
export function Tabs<T extends string>({ items, value, onChange, className, ...aria }: TabsProps<T>) {
  return (
    <div role="tablist" className={cn("flex items-center gap-space-lg border-b border-outline-variant/40", className)} {...aria}>
      {items.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn(
              "pb-2.5 font-label-lg text-label-lg border-b-2 flex items-center gap-1.5 transition-colors",
              active
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-secondary hover:text-on-surface font-medium",
            )}
          >
            {t.icon && <Icon name={t.icon} className="text-[18px]" />}
            {t.label}
            {t.trailing}
          </button>
        );
      })}
    </div>
  );
}

interface FilterChipsProps<T extends string> {
  items: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
}

/** Small pill filter buttons (e.g. Overview: All / Active / Under Review …). */
export function FilterChips<T extends string>({ items, value, onChange, className }: FilterChipsProps<T>) {
  return (
    <div className={cn("flex items-center gap-space-xs flex-wrap", className)}>
      {items.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(c.id)}
            className={cn(
              "px-2.5 py-1 rounded-lg font-label-md text-label-md transition-colors",
              active
                ? "bg-primary-container text-on-primary"
                : "bg-surface-container-low text-on-surface-variant hover:text-on-surface",
            )}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
