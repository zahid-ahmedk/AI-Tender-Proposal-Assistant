import { useId, useState } from "react";
import {
  Badge, Button, Card, CardHeader, Checkbox, DataTable, Drawer, Field, FilterChips, IconButton, Modal,
  ProgressBar, Select, StatCard, Tabs, Textarea, TextInput, Toggle, type Column,
} from "@/components/ui";
import { ComplianceBadge, JobStatusBadge } from "@/components/domain/StatusBadge";
import { PageHeader } from "@/components/layout/PageHeader";
import type { ComplianceStatus } from "@/types/status";

interface Row { id: string; clause: string; requirement: string; status: ComplianceStatus; progress: number }
const ROWS: Row[] = [
  { id: "1", clause: "4.2.1", requirement: "Contractor shall hold ISO 9001 certification", status: "Compliant", progress: 100 },
  { id: "2", clause: "5.1", requirement: "Provide 24/7 on-site support for 36 months", status: "Partially Compliant", progress: 60 },
  { id: "3", clause: "7.3.4", requirement: "Submit performance bond of 10% of contract value", status: "Non-Compliant", progress: 10 },
  { id: "4", clause: "8.0", requirement: "Key personnel CVs with Saudi Council of Engineers registration", status: "Needs Human Review", progress: 40 },
  { id: "5", clause: "9.2", requirement: "Provide local-content plan", status: "Not Assessed", progress: 0 },
];

const COLUMNS: Column<Row>[] = [
  { key: "clause", header: "Clause", cell: (r) => <span className="font-mono">{r.clause}</span>, className: "w-24" },
  { key: "req", header: "Requirement", cell: (r) => r.requirement },
  { key: "status", header: "Status", cell: (r) => <ComplianceBadge status={r.status} />, className: "whitespace-nowrap" },
  { key: "p", header: "Evidence", cell: (r) => <ProgressBar value={r.progress} tone={r.progress === 100 ? "success" : r.progress < 20 ? "error" : "primary"} label={`Evidence ${r.progress}%`} className="w-24" />, className: "w-32" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader title={title} />
      <div className="px-space-lg pb-space-lg flex flex-wrap items-center gap-space-md">{children}</div>
    </Card>
  );
}

/** Dev-only visual index of every shared component (route: /dev/components). */
export default function ComponentShowcase() {
  const [tab, setTab] = useState("req");
  const [chip, setChip] = useState("all");
  const [toggle, setToggle] = useState(true);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const id = useId();

  return (
    <div className="w-full px-margin py-space-lg flex flex-col gap-space-lg">
      <PageHeader eyebrow="Developer" eyebrowSecondary="Step 3" title="Component Showcase" description="Every shared UI component, in one place." />

      <Section title="Buttons">
        <Button icon="add">Primary</Button>
        <Button variant="secondary" icon="download">Secondary</Button>
        <Button variant="tonal">Tonal</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger" icon="delete">Danger</Button>
        <Button size="sm" variant="tonal" icon="edit">Small</Button>
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <IconButton icon="more_vert" aria-label="More actions" />
      </Section>

      <Section title="Badges">
        {(["neutral", "primary", "secondary", "tertiary", "error", "success", "warning", "danger"] as const).map((t) => (
          <Badge key={t} tone={t} dot>{t}</Badge>
        ))}
        <Badge tone="primary" icon="difference" size="md" bold>With icon</Badge>
      </Section>

      <Section title="Domain status badges (API vocabulary)">
        {(["Compliant", "Partially Compliant", "Non-Compliant", "Not Assessed", "Needs Human Review"] as const).map((s) => (
          <ComplianceBadge key={s} status={s} />
        ))}
        {(["queued", "running", "completed", "failed"] as const).map((s) => (
          <JobStatusBadge key={s} status={s} />
        ))}
      </Section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <StatCard label="Active Tenders" value="12" icon="folder_open" footer={<Badge tone="primary">+2 this week</Badge>} />
        <StatCard label="Under Analysis" value="4" icon="auto_awesome" iconClassName="text-primary" footer={<span className="font-label-sm text-label-sm text-on-surface-variant">184 reqs extracting</span>} />
        <StatCard label="Pending Reviews" value="7" icon="rate_review" iconClassName="text-tertiary" footer={<Badge tone="tertiary">3 high priority</Badge>} />
        <StatCard label="Upcoming Deadlines" value="3" icon="event_upcoming" iconClassName="text-error" footer={<Badge tone="error">Next in 2d 14h</Badge>} />
      </div>

      <Card>
        <CardHeader title="Tabs, filters & progress" />
        <div className="px-space-lg pb-space-lg flex flex-col gap-space-md">
          <Tabs value={tab} onChange={setTab} aria-label="Demo tabs" items={[
            { id: "req", label: "Requirements", icon: "list_alt" },
            { id: "docs", label: "Documents", trailing: <Badge>12</Badge> },
            { id: "log", label: "Activity" },
          ]} />
          <FilterChips value={chip} onChange={setChip} items={[{ id: "all", label: "All" }, { id: "active", label: "Active" }, { id: "review", label: "Under Review" }]} />
          <div className="flex flex-col gap-space-sm max-w-md">
            <ProgressBar value={72} label="72%" />
            <ProgressBar value={100} tone="success" label="100%" />
            <ProgressBar value={35} tone="warning" label="35%" />
            <ProgressBar value={12} tone="error" label="12%" />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Form controls" />
        <div className="px-space-lg pb-space-lg grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <Field label="Tender title" htmlFor={`${id}-t`} hint="As shown on the RFP cover page.">
            <TextInput id={`${id}-t`} icon="search" placeholder="Search…" />
          </Field>
          <Field label="Submission method" htmlFor={`${id}-s`}>
            <Select id={`${id}-s`} defaultValue="portal"><option value="portal">Online portal</option><option value="hand">Hand delivery</option></Select>
          </Field>
          <Field label="Reference number" htmlFor={`${id}-e`} error="Reference number is required.">
            <TextInput id={`${id}-e`} />
          </Field>
          <Field label="Notes" htmlFor={`${id}-n`}><Textarea id={`${id}-n`} rows={2} placeholder="Reviewer comments…" /></Field>
          <Checkbox label="Mandatory requirement" defaultChecked />
          <div className="flex items-center gap-space-sm">
            <Toggle checked={toggle} onChange={setToggle} aria-label="Email alerts" />
            <span className="font-body-sm text-body-sm">Email alerts {toggle ? "on" : "off"}</span>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="DataTable" description="Clickable rows, typed columns" actions={<Button size="sm" variant="tonal" icon="filter_list">Filter</Button>} />
        <DataTable aria-label="Compliance demo" columns={COLUMNS} rows={ROWS} rowKey={(r) => r.id} onRowClick={() => setDrawer(true)} minWidth={720} />
      </Card>

      <Section title="Overlays">
        <Button variant="secondary" onClick={() => setModal(true)}>Open modal</Button>
        <Button variant="secondary" onClick={() => setDrawer(true)}>Open drawer</Button>
      </Section>

      <Modal open={modal} onClose={() => setModal(false)} title="Formal Clarification Letter Preview" headerExtra={<Badge tone="primary" dot>Ready for Final Dispatch</Badge>}
        footer={<><Button variant="tonal" onClick={() => setModal(false)}>Cancel</Button><Button icon="send">Dispatch</Button></>}>
        <p className="p-space-lg font-body-md text-body-md text-on-surface-variant">Modal body. Press Esc or click the backdrop to close.</p>
      </Modal>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Create clarification query" headerExtra={<Badge tone="secondary" dot bold>Pending Internal Legal Sign-off</Badge>}
        footer={<><Button variant="tonal" onClick={() => setDrawer(false)}>Cancel</Button><Button>Save draft</Button></>}>
        <div className="p-space-lg flex flex-col gap-space-md">
          <Field label="Query" htmlFor={`${id}-q`}><Textarea id={`${id}-q`} rows={4} /></Field>
        </div>
      </Drawer>
    </div>
  );
}
