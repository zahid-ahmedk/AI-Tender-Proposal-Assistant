/**
 * Header configuration per route, taken from the original designs.
 * The export contains two header styles ("classic" and "workspace").
 * Corrections vs. the export: Compliance Matrix and the three Clarification
 * screens had copy-pasted breadcrumbs ("Overview" / "Document Register");
 * they now show their own page names.
 */
export const DEMO_TENDER = "RFP-2025-0841: Cloud Infrastructure Modernization";

export type HeaderMeta =
  | {
      variant: "classic";
      /** String = single plain label; array = breadcrumb trail (last item bold). */
      breadcrumb: string | string[];
    }
  | {
      variant: "workspace";
      /** Extra crumbs between "Workspace" and the context chip */
      parents?: string[];
      contextLabel: string;
      contextIcon: string;
      searchPlaceholder: string;
    };

const tenderCtx = (): HeaderMeta => ({
  variant: "workspace",
  contextLabel: DEMO_TENDER,
  contextIcon: "description",
  searchPlaceholder: "Search tenders, RFPs, or documents...",
});

const trail = (page: string): HeaderMeta => ({
  variant: "classic",
  breadcrumb: ["Workspace", DEMO_TENDER, page],
});

export const PAGE_META: Record<string, HeaderMeta> = {
  "/": { variant: "classic", breadcrumb: "Workspace / Overview" },
  "/tenders": tenderCtx(),
  "/analysis/new": tenderCtx(),
  "/deadlines": tenderCtx(),
  "/documents": trail("Document Register"),
  "/compliance": trail("Compliance Matrix"),
  "/checklist": tenderCtx(),
  "/clarifications": trail("Clarifications / PTC"),
  "/clarifications/ptc-letter": trail("PTC Letter Preview"),
  "/addendum-diff": trail("Addendum Diff"),
  "/missing-documents": tenderCtx(),
  "/team-reviews": tenderCtx(),
  "/dev/components": { variant: "classic", breadcrumb: ["Workspace", "Component Showcase"] },
  "/settings": {
    variant: "workspace",
    parents: ["Organization"],
    contextLabel: "Settings",
    contextIcon: "settings",
    searchPlaceholder: "Search tenders, RFPs, or settings...",
  },
};

export const FALLBACK_META: HeaderMeta = { variant: "classic", breadcrumb: ["Workspace"] };
export const CURRENT_USER = { name: "Sarah Jenkins", role: "Senior Bid Director", initials: "SJ" };
