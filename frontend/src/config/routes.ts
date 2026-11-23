/**
 * All 13 screens from the Stitch export, mapped to routes.
 * `source` = folder name inside /design-reference (for pixel comparison).
 * `step`   = build step in which the real page replaces the placeholder.
 * Route-to-screen mapping for the three Clarifications screens is provisional
 * and gets confirmed against the screenshots in Step 6.
 */
export interface ScreenRoute {
  path: string;
  title: string;
  source: string;
  step: number;
  /** Not in the sidebar: reached from another screen (drawer, preview, diff). */
  secondary?: boolean;
}

export const SCREEN_ROUTES: ScreenRoute[] = [
  { path: "/", title: "Overview", source: "overview_dashboard", step: 4 },
  { path: "/tenders", title: "All Tenders", source: "all_tenders", step: 4 },
  { path: "/analysis/new", title: "New Analysis Studio", source: "new_analysis_studio", step: 4 },
  { path: "/documents", title: "Document Register", source: "document_register", step: 5 },
  { path: "/compliance", title: "Compliance Matrix", source: "compliance_matrix", step: 5 },
  { path: "/checklist", title: "Submission Checklist", source: "submission_checklist", step: 5 },
  { path: "/clarifications", title: "Clarifications / PTC", source: "clarification_item_drawer", step: 6 },
  { path: "/clarifications/ptc-letter", title: "PTC Submission Letter Preview", source: "formal_ptc_submission_letter_preview", step: 6, secondary: true },
  { path: "/addendum-diff", title: "Addendum Diff Viewer", source: "addendum_diff_viewer", step: 6, secondary: true },
  { path: "/deadlines", title: "Deadlines & Critical Path", source: "deadlines_critical_path", step: 7 },
  { path: "/missing-documents", title: "Missing Documents", source: "missing_documents", step: 7 },
  { path: "/team-reviews", title: "Team & Reviews", source: "team_reviews", step: 7 },
  { path: "/settings", title: "Settings", source: "settings_workspace_configuration", step: 7 },
];
