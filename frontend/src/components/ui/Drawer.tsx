import { useEffect, useId, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useOverlay } from "@/hooks/useOverlay";
import { cn } from "@/utils/cn";
import { IconButton } from "./Button";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  headerExtra?: ReactNode;
  footer?: ReactNode;
  /** Width classes; original design uses max-w-[720px] */
  className?: string;
  children: ReactNode;
}

const DURATION_MS = 200;

/** Right-hand slide-over below the app header (Clarification query drawer). Keeps sidebar/header visible. */
export function Drawer({ open, onClose, title, headerExtra, footer, className = "max-w-[720px]", children }: DrawerProps) {
  const titleId = useId();
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  useOverlay(open, onClose);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), DURATION_MS);
    return () => clearTimeout(t);
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 top-16 left-64 bg-on-secondary-fixed/40 backdrop-blur-sm z-40 transition-opacity duration-200",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "fixed top-16 right-0 bottom-0 w-full bg-surface-container-lowest shadow-2xl z-50 flex flex-col overflow-hidden",
          "transition-transform duration-200 ease-out",
          shown ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        <div className="px-space-lg py-space-md flex items-center justify-between gap-space-md shadow-sm relative z-10 shrink-0">
          <div className="flex items-center gap-space-sm min-w-0 flex-wrap">
            <h2 id={titleId} className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
            {headerExtra}
          </div>
          <IconButton icon="close" aria-label="Close drawer" onClick={onClose} />
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-space-lg py-space-md border-t border-surface-container-high shrink-0 flex items-center justify-end gap-space-sm bg-surface-container-lowest">
            {footer}
          </div>
        )}
      </section>
    </>,
    document.body,
  );
}
