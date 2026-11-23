import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useId } from "react";
import { useOverlay } from "@/hooks/useOverlay";
import { cn } from "@/utils/cn";
import { IconButton } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Badges / status shown next to the title */
  headerExtra?: ReactNode;
  /** Right side of the header, before the close button */
  headerActions?: ReactNode;
  footer?: ReactNode;
  /**
   * "content" keeps the sidebar + header visible (PTC letter preview);
   * "viewport" covers everything (Addendum diff viewer).
   */
  scope?: "content" | "viewport";
  /** Tailwind max-width / height classes for the dialog */
  className?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  headerExtra,
  headerActions,
  footer,
  scope = "content",
  className = "max-w-[1010px]",
  children,
}: ModalProps) {
  const titleId = useId();
  useOverlay(open, onClose);
  if (!open) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-space-md overflow-y-auto bg-on-secondary-fixed/55 backdrop-blur-[3px]",
        scope === "content" && "top-16 left-64",
      )}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative w-full bg-surface-container-lowest rounded-xl shadow-2xl flex flex-col overflow-hidden",
          scope === "content" ? "max-h-[calc(100vh-5.5rem)]" : "max-h-[94vh]",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-space-md px-space-lg py-space-md border-b border-surface-container-high shrink-0">
          <div className="flex items-center gap-space-sm flex-wrap min-w-0">
            <h2 id={titleId} className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
              {title}
            </h2>
            {headerExtra}
          </div>
          <div className="flex items-center gap-space-sm shrink-0">
            {headerActions}
            <IconButton icon="close" aria-label="Close dialog" onClick={onClose} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-space-lg py-space-md border-t border-surface-container-high shrink-0 flex items-center justify-end gap-space-sm">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
