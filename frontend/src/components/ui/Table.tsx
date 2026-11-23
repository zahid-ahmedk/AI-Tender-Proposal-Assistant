import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/** Low-level primitives for hand-built tables (nested rows, custom cells). */
export function Table({ minWidth, children, className }: { minWidth?: number; children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse" style={minWidth ? { minWidth } : undefined}>
        {children}
      </table>
    </div>
  );
}

export function Th({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn("py-3 px-space-md font-label-sm text-label-sm uppercase text-on-surface-variant whitespace-nowrap", className)}
      {...rest}
    />
  );
}

export function Td({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("py-3.5 px-space-md align-middle", className)} {...rest} />;
}

export function Tr({ clickable, className, ...rest }: HTMLAttributes<HTMLTableRowElement> & { clickable?: boolean }) {
  return (
    <tr
      className={cn("hover:bg-surface-container-low/60 transition-colors", clickable && "cursor-pointer", className)}
      {...rest}
    />
  );
}

export interface Column<T> {
  key: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  /** Extra classes applied to both th and td (width, alignment, nowrap) */
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyMessage?: ReactNode;
  density?: "comfortable" | "compact";
  minWidth?: number;
  "aria-label"?: string;
}

/** Typed, declarative table for the common case. */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyMessage = "No records found.",
  density = "comfortable",
  minWidth,
  ...aria
}: DataTableProps<T>) {
  const pad = density === "compact" ? "py-2.5 px-space-sm" : undefined;
  return (
    <Table minWidth={minWidth}>
      <caption className="sr-only">{aria["aria-label"]}</caption>
      <thead className="border-b border-surface-container">
        <tr>
          {columns.map((c) => (
            <Th key={c.key} className={cn(pad, c.className)}>{c.header}</Th>
          ))}
        </tr>
      </thead>
      <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-surface-container">
        {rows.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="py-space-xl text-center font-body-md text-body-md text-on-surface-variant">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          rows.map((row, i) => (
            <Tr
              key={rowKey(row)}
              clickable={!!onRowClick}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={onRowClick ? (e) => (e.key === "Enter" ? onRowClick(row) : undefined) : undefined}
            >
              {columns.map((c) => (
                <Td key={c.key} className={cn(pad, c.className)}>{c.cell(row, i)}</Td>
              ))}
            </Tr>
          ))
        )}
      </tbody>
    </Table>
  );
}
