import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** none = content manages its own padding (tables, headers) */
  padding?: "none" | "md" | "lg";
  bordered?: boolean;
  hoverable?: boolean;
}

const PADDING = { none: "", md: "p-space-md", lg: "p-space-lg" } as const;

/** White surface card: `bg-surface-container-lowest rounded-xl shadow-sm` (most common container in the designs). */
export function Card({ padding = "none", bordered, hoverable, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden",
        PADDING[padding],
        bordered && "border border-outline-variant",
        hoverable && "hover:shadow-md transition-shadow",
        className,
      )}
      {...rest}
    />
  );
}

interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned actions */
  actions?: ReactNode;
  className?: string;
}

export function CardHeader({ title, description, actions, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "px-space-lg py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest",
        className,
      )}
    >
      <div className="flex flex-col gap-space-xs min-w-0">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
        {description && <p className="font-body-sm text-body-sm text-on-surface-variant">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-space-sm shrink-0">{actions}</div>}
    </div>
  );
}
