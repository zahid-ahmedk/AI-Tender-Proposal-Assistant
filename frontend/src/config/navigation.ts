/**
 * Single source of truth for sidebar navigation.
 * Extracted from the sidebar markup shared by all 13 original screens
 * (labels, icons, section grouping and data-path ids are unchanged).
 */
export interface NavItem {
  /** Original `data-path` id from the design */
  id: string;
  label: string;
  /** Material Symbols Outlined icon name */
  icon: string;
  path: string;
  section: "Workspace" | "Analysis & Compliance" | "Organization";
}

export const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: "dashboard", path: "/", section: "Workspace" },
  { id: "all-tenders", label: "All Tenders", icon: "folder_open", path: "/tenders", section: "Workspace" },
  { id: "new-analysis", label: "New Analysis", icon: "auto_awesome", path: "/analysis/new", section: "Workspace" },
  { id: "deadlines", label: "Deadlines", icon: "event", path: "/deadlines", section: "Workspace" },
  { id: "document-register", label: "Document Register", icon: "description", path: "/documents", section: "Analysis & Compliance" },
  { id: "compliance-matrix", label: "Compliance Matrix", icon: "grid_on", path: "/compliance", section: "Analysis & Compliance" },
  { id: "submission-checklist", label: "Submission Checklist", icon: "fact_check", path: "/checklist", section: "Analysis & Compliance" },
  { id: "clarifications-ptc", label: "Clarifications / PTC", icon: "forum", path: "/clarifications", section: "Analysis & Compliance" },
  { id: "missing-documents", label: "Missing Documents", icon: "warning", path: "/missing-documents", section: "Analysis & Compliance" },
  { id: "team-reviews", label: "Team & Reviews", icon: "group", path: "/team-reviews", section: "Organization" },
  { id: "settings", label: "Settings", icon: "settings", path: "/settings", section: "Organization" },
];

export const NAV_SECTIONS = ["Workspace", "Analysis & Compliance", "Organization"] as const;
