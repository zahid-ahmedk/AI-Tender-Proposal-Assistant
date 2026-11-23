# TenderIQ Frontend

React + TypeScript + Vite + Tailwind 3 port of the 13 Stitch screens.

```bash
npm install
npm run dev        # http://localhost:5173  (proxies /api -> http://localhost:8000)
npm run build      # typecheck + production build
```

## Phase 1 build plan

| Step | Scope | Status |
|------|-------|--------|
| 1 | Scaffold, design tokens, fonts, routing skeleton (13 routes) | done |
| 2 | App shell: Sidebar, Header, PageHeader, layout route | done |
| 3 | Shared UI: Card, Badge, Button, DataTable, Tabs, Modal, Drawer, etc. | done |
| 4 | Screens: Overview, All Tenders, New Analysis Studio | next |
| 5 | Screens: Document Register, Compliance Matrix, Submission Checklist | |
| 6 | Screens: Clarifications (drawer), PTC Letter Preview, Addendum Diff | |
| 7 | Screens: Deadlines, Missing Documents, Team & Reviews, Settings | |
| 8 | QA: screenshot comparison, a11y pass, lint, final build | |

## Structure

- `design-reference/` original Stitch HTML + screenshots (read-only reference, delete before release)
- `tailwind.config.js` generated from the designs (identical in all 13 screens)
- `src/config/navigation.ts` sidebar items (single source of truth)
- `src/config/routes.ts` screen-to-route map
- `src/config/pageMeta.ts` per-route header config (two header styles in the designs)
- `src/components/layout/` Sidebar, Header, AppShell, PageHeader
- `src/components/ui/` reusable primitives

Fonts (Inter, Plus Jakarta Sans, Material Symbols) are self-hosted via npm, no Google CDN needed.
- `src/pages/` one component per screen

## Shared components (`src/components/ui`, import from `@/components/ui`)

| Component | Notes |
|---|---|
| `Card`, `CardHeader` | White surface container; `padding`, `bordered`, `hoverable` |
| `Button`, `IconButton` | variants: primary, secondary, tonal, ghost, danger; sizes sm/md; `icon`, `loading` |
| `Badge` | tones: neutral, primary, secondary, tertiary, error, success, warning, danger; `dot`, `icon` |
| `StatusBadge` (`components/domain`) | `ComplianceBadge`, `JobStatusBadge` use the backend status vocabulary |
| `StatCard` | KPI tile (Overview pattern) |
| `Tabs`, `FilterChips` | underline tabs and pill filters (generic over id type) |
| `Field`, `TextInput`, `Select`, `Textarea`, `Checkbox`, `Toggle` | form controls |
| `Table`, `Th`, `Td`, `Tr`, `DataTable` | primitives for custom tables; `DataTable` for typed column definitions |
| `ProgressBar` | tones: primary, success, warning, error |
| `Modal` | `scope="content"` keeps shell visible; `scope="viewport"` covers everything |
| `Drawer` | right slide-over under the header, animated, Esc / scrim to close |

Modal and Drawer share `useOverlay` (Escape + scroll lock). Pass only additive layout classes via
`className`; there is no tailwind-merge, so overriding a component's own colour classes is not supported.

Run `npm run dev` and open `/dev/components` for a live showcase of every component (dev builds only).
