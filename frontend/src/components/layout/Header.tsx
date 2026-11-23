import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_USER, type HeaderMeta } from "@/config/pageMeta";
import { Icon } from "@/components/ui/Icon";
import { Avatar } from "@/components/ui/Avatar";
import { LogoMark } from "@/components/ui/LogoMark";

function NewTenderButton({ className }: { className: string }) {
  const navigate = useNavigate();
  return (
    <button type="button" className={className} onClick={() => navigate("/analysis/new")}>
      <Icon name="add" className="text-[18px]" />
      <span>New Tender</span>
    </button>
  );
}

function ClassicHeader({ breadcrumb }: { breadcrumb: string | string[] }) {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest border-b border-outline-variant z-40 px-margin flex items-center justify-between gap-gutter">
      <div className="flex items-center gap-space-sm min-w-0">
        <LogoMark />
        {typeof breadcrumb === "string" ? (
          <span className="font-label-lg text-label-lg text-on-surface-variant">{breadcrumb}</span>
        ) : (
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant overflow-hidden truncate"
          >
            {breadcrumb.map((crumb, i) => {
              const last = i === breadcrumb.length - 1;
              return (
                <Fragment key={crumb}>
                  {i > 0 && <span className="text-outline">/</span>}
                  <span
                    className={
                      last
                        ? "text-on-surface font-semibold"
                        : "hover:text-on-surface cursor-pointer transition-colors truncate max-w-xs"
                    }
                  >
                    {crumb}
                  </span>
                </Fragment>
              );
            })}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-space-md">
        <button
          type="button"
          aria-label="Search (⌘K)"
          className="hidden md:flex items-center justify-between w-80 h-9 px-space-sm bg-surface-container-low border border-outline-variant rounded-lg text-on-surface-variant"
        >
          <div className="flex items-center gap-space-xs">
            <Icon name="search" className="text-[18px]" />
            <span className="font-body-sm text-body-sm">Search tenders, RFPs, or documents...</span>
          </div>
          <span className="font-label-sm text-label-sm px-1.5 py-0.5 bg-surface-container-lowest border border-outline-variant rounded">
            ⌘K
          </span>
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
        >
          <Icon name="notifications" className="text-[20px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error" />
        </button>
        <NewTenderButton className="flex items-center gap-space-xs h-9 px-space-md rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary hover:text-on-primary transition-colors" />
        <Avatar initials={CURRENT_USER.initials} />
      </div>
    </header>
  );
}

type WorkspaceMeta = Extract<HeaderMeta, { variant: "workspace" }>;

function WorkspaceHeader({ parents = [], contextLabel, contextIcon, searchPlaceholder }: WorkspaceMeta) {
  const crumb = "font-label-md text-label-md text-secondary shrink-0";
  const chevron = "text-outline-variant text-[16px] shrink-0";
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="w-full h-16 px-space-lg flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-sm min-w-0 max-w-md">
          <span className={crumb}>Workspace</span>
          <Icon name="chevron_right" className={chevron} />
          {parents.map((p) => (
            <Fragment key={p}>
              <span className={crumb}>{p}</span>
              <Icon name="chevron_right" className={chevron} />
            </Fragment>
          ))}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer min-w-0">
            <Icon name={contextIcon} className="text-primary text-[16px] shrink-0" />
            <span className="font-title-md text-title-md text-on-surface truncate">{contextLabel}</span>
            <Icon name="arrow_drop_down" className="text-secondary text-[16px] shrink-0" />
          </div>
        </div>
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative flex items-center w-full">
            <Icon name="search" className="absolute left-3 text-secondary text-[18px]" />
            <input
              type="text"
              aria-label="Search"
              placeholder={searchPlaceholder}
              className="w-full h-10 pl-9 pr-12 rounded bg-surface-container-lowest text-on-surface placeholder:text-secondary font-body-sm text-body-sm shadow-[0_1px_2px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
            />
            <div className="absolute right-3 px-1.5 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-secondary pointer-events-none">
              ⌘K
            </div>
          </div>
        </div>
        <div className="flex items-center gap-space-md shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
            <Icon name="verified" className="text-[16px] text-emerald-600" />
            <span className="font-label-sm text-label-sm font-semibold tracking-wide">94.2% AI Confidence</span>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-1.5 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <Icon name="notifications" className="text-[20px]" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface" />
          </button>
          <NewTenderButton className="flex items-center gap-1.5 h-9 px-space-md rounded bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-[0_1px_2px_rgba(15,23,42,0.05)]" />
          <div className="flex items-center gap-space-sm pl-space-xs">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Icon name="person" className="text-on-primary text-[18px]" />
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="font-title-md text-title-md text-on-surface leading-tight">{CURRENT_USER.name}</span>
              <span className="font-label-sm text-label-sm text-secondary leading-tight">{CURRENT_USER.role}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Header({ meta }: { meta: HeaderMeta }) {
  return meta.variant === "classic" ? <ClassicHeader breadcrumb={meta.breadcrumb} /> : <WorkspaceHeader {...meta} />;
}
