import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: ReactNode;
  /** Muted text after a "/" separator next to the eyebrow */
  eyebrowSecondary?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned action area (buttons, status pills) */
  actions?: ReactNode;
}

/** Page title block used at the top of dashboard-style screens (pattern from Overview). */
export function PageHeader({ eyebrow, eyebrowSecondary, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
      <div className="flex flex-col gap-space-xs">
        {eyebrow && (
          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm uppercase text-primary tracking-wider">{eyebrow}</span>
            {eyebrowSecondary && (
              <>
                <span className="text-outline-variant">/</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{eyebrowSecondary}</span>
              </>
            )}
          </div>
        )}
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
        {description && <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-space-sm">{actions}</div>}
    </div>
  );
}
