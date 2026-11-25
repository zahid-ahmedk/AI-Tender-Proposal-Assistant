---
name: TenderIQ
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434655'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  title-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system powers TenderIQ, an AI-powered Tender and RFP Analysis Platform built for bid managers, proposal teams, legal reviewers, and enterprise sales executives. The interface must evoke analytical clarity, precision, and quiet confidence—turning dense, multi-hundred-page procurement documents into structured, actionable intelligence.

The visual language blends **Corporate / Modern** structure with **Minimalism**, taking cues from high-craft productivity tools like Linear, Stripe, and Notion. A crisp light-mode workspace (`#FFFFFF` cards over a `#F8FAFC` canvas) maximizes legibility during long review sessions, while a dark navy vertical sidebar (`#0F172A` / `#111827`) anchors global navigation and establishes clear spatial hierarchy. Restraint is central: 1px hairline borders, tight spacing, and high-contrast slate typography keep the focus on data, compliance scores, and AI-extracted requirements.

## Colors

The palette pairs a bright, neutral workspace with a deep navy navigation anchor and a refined blue primary accent.

- **Workspace & Surfaces:** The main application canvas uses `#F8FAFC` to reduce glare, with elevated content cards and data tables sitting on pure `#FFFFFF` separated by `1px` `#E2E8F0` borders.
- **Navigation Anchor:** The persistent vertical sidebar uses `#0F172A` (with `#111827` for active or nested states) to create a clear visual boundary between global navigation and document analysis.
- **Primary Accent:** `#2563EB` is reserved for primary actions, active focus rings, AI analysis triggers, and key interactive states.
- **Typography Hierarchy:** Headings use `#0F172A` for maximum contrast, body copy uses `#475569`, and metadata, timestamps, or table headers use `#64748B`.
- **Semantic Status:** Status badges and progress indicators use crisp, accessible tints: **Emerald** (`#10B981` / `#ECFDF5`) for compliant or approved items, **Amber** (`#F59E0B` / `#FFFBEB`) for pending review, **Rose** (`#F43F5E` / `#FFF1F2`) for high-risk or non-compliant clauses, and **Blue** (`#2563EB` / `#EFF6FF`) for active AI processing.

## Typography

The type system pairs **Plus Jakarta Sans** for geometric, authoritative headings with **Inter** for high-legibility body copy, dense tables, and UI labels.

- **Data & Numerals:** Apply `font-variant-numeric: tabular-nums` across all data tables, compliance percentages, contract values, and countdown timers so columns align vertically.
- **Line Length:** Constrain long-form RFP requirement descriptions and AI summaries to `65ch–75ch` for comfortable scanning.
- **Scale Adaptation:** Display sizes above `32px` scale down via `display-lg-mobile` (`28px`) on viewports under `640px` to preserve above-the-fold density.

## Layout & Spacing

The workspace uses a **12-column fluid grid** paired with a persistent, collapsible dark navy vertical sidebar (`240px` expanded, `64px` collapsed).

- **Desktop (`> 1024px`):** The 12-column grid fills the remaining viewport width with `24px` (`margin`) outer padding and `16px` (`gutter`) column gaps. Split-pane views (such as an RFP document viewer alongside an AI compliance checklist) typically use a `7/5` or `6/6` column split.
- **Tablet (`640px – 1024px`):** The sidebar collapses to its `64px` icon-only rail by default. Multi-column dashboards reflow into 2-column card grids.
- **Mobile (`< 640px`):** The sidebar moves into a slide-over drawer triggered from a compact top bar. All grid columns stack to full width (`12` columns) with `16px` outer margins.

## Elevation & Depth

Hierarchy is achieved primarily through **low-contrast outlines** and subtle surface contrast rather than heavy drop shadows.

- **Base Cards & Tables:** Rest flat on the `#F8FAFC` canvas using `#FFFFFF` fills and `1px solid #E2E8F0` hairline borders.
- **Interactive & Hover States:** Cards that act as clickable triggers elevate subtly with a tight, low-opacity ambient shadow (`0 1px 2px rgba(15, 23, 42, 0.05)`).
- **Overlays, Popovers & Modals:** Floating menus, command palettes, and drawers use `#FFFFFF` surfaces with a `1px solid #E2E8F0` border and a diffused ambient shadow (`0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 4px 10px -2px rgba(15, 23, 42, 0.04)`) to separate cleanly from dense underlying tables.

## Shapes

A **Soft** roundedness level (`0.25rem` base, `0.5rem` for `rounded-lg`, `0.75rem` for `rounded-xl`) keeps the interface crisp, structured, and suited for enterprise data density.

- **Inputs, Buttons & Badges:** Use `0.375rem` (`6px`) to `0.25rem` (`4px`) radii for a sharp, tool-like feel.
- **Cards, Tables & Modals:** Use `0.5rem` (`8px`) to `0.75rem` (`12px`) radii to soften container boundaries without wasting interior space.
- **Status Pills:** Small semantic badges may use full pill rounding (`9999px`) when paired with compact `label-sm` typography to distinguish them from rectangular action buttons.

## Components

- **Buttons:** Primary actions use `#2563EB` fills with `#FFFFFF` text (`label-lg`). Secondary actions use `#FFFFFF` fills, `1px solid #E2E8F0` borders, and `#0F172A` text. Ghost buttons use transparent backgrounds with `#475569` text and `#F1F5F9` hover states.
- **Status Badges & Chips:** Compact, high-contrast pills (`22px` height) with `1px` tinted borders and semantic backgrounds (Emerald, Amber, Rose, Blue) to indicate compliance status, risk level, or AI extraction state.
- **Compact Data Tables:** Header rows sit on `#F8FAFC` with `label-sm` uppercase `#64748B` text and `1px solid #E2E8F0` bottom borders. Body rows use `44px`–`48px` height, `#FFFFFF` background, `#F8FAFC` hover states, and tabular numerals.
- **Cards:** `#FFFFFF` containers with `1px solid #E2E8F0` borders, `16px` (`space-md`) or `24px` (`space-lg`) internal padding, and clear header/body separation.
- **Input Fields:** `36px`–`40px` height, `#FFFFFF` background, `1px solid #E2E8F0` border, `#64748B` placeholder text, and a `2px` `#2563EB` focus ring.
- **Checkboxes & Radio Buttons:** `16px` controls with `1px solid #CBD5E1` borders when unchecked and `#2563EB` fills when selected.
- **Lists:** Clean vertical stacks separated by `1px solid #E2E8F0` dividers, ideal for requirement checklists and activity logs.
- **Progress Bars:** `6px` height tracks in `#E2E8F0` with `#2563EB` (or semantic emerald/amber) fills, paired with right-aligned `label-md` percentage readouts.