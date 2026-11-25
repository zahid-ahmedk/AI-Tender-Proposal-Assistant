import React from 'react';
import {
  LayoutDashboard,
  FileSearch,
  Table2,
  BookOpenCheck,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import type { AppView } from '../types/tender';

interface SidebarProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  highRiskCount: number;
  activeTendersCount: number;
}

const NAV_ITEMS: Array<{
  id: AppView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'analyzer', label: 'Document Analyzer', icon: FileSearch },
  { id: 'matrix', label: 'Compliance Matrix', icon: Table2 },
  { id: 'library', label: 'Answer Library', icon: BookOpenCheck },
  { id: 'team', label: 'Team & Rules', icon: ShieldCheck },
];

export function Sidebar({
  activeView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  highRiskCount,
  activeTendersCount,
}: SidebarProps) {
  const renderNavContent = (isCompact: boolean, isMobileDrawer: boolean) => (
    <div className="flex flex-col h-full bg-[#0F172A] text-[#E2E8F0] select-none">
      {/* Brand Header */}
      <div
        className={`h-14 flex items-center border-b border-slate-800/90 shrink-0 ${
          isCompact ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            onSelectView('overview');
            if (isMobileDrawer) onCloseMobile();
          }}
          className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-md"
          aria-label="TenderIQ Home"
        >
          <span className="w-7 h-7 rounded-md bg-[#2563EB] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 3.5H13M8 3.5V12.5M4.75 7.5H11.25"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {!isCompact && (
            <span
              className="text-[16px] font-semibold tracking-[-0.015em] text-white whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              TenderIQ
            </span>
          )}
        </button>

        {isMobileDrawer ? (
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : !isCompact ? (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {/* Primary Navigation */}
      <nav aria-label="Main navigation" className="flex-1 py-4 px-2.5 space-y-1 overflow-y-auto">
        {!isCompact && (
          <div className="px-2.5 pb-2 text-[11px] font-semibold tracking-[0.04em] uppercase text-slate-500">
            Workspace
          </div>
        )}
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const countLabel =
            item.id === 'overview' && activeTendersCount > 0
              ? activeTendersCount
              : item.id === 'matrix' && highRiskCount > 0
                ? highRiskCount
                : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectView(item.id);
                if (isMobileDrawer) onCloseMobile();
              }}
              aria-current={isActive ? 'page' : undefined}
              title={isCompact ? item.label : undefined}
              aria-label={item.label}
              className={`w-full flex items-center rounded-md text-[13px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                isCompact ? 'justify-center h-10 px-0' : 'justify-between h-9 px-2.5'
              } ${
                isActive
                  ? 'bg-[#111827] text-white ring-1 ring-inset ring-slate-700/80'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#60A5FA]' : 'text-slate-400'
                  }`}
                />
                {!isCompact && <span className="truncate whitespace-nowrap">{item.label}</span>}
              </span>

              {!isCompact && countLabel !== null && (
                <span
                  className={`text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded ${
                    item.id === 'matrix' && highRiskCount > 0
                      ? 'bg-rose-500/15 text-rose-300'
                      : 'text-slate-400'
                  }`}
                >
                  {countLabel}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Expand Toggle when Compact */}
      {!isMobileDrawer && isCompact && (
        <div className="px-2.5 py-2 border-t border-slate-800/80 flex justify-center shrink-0">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Workspace Footer */}
      <div
        className={`border-t border-slate-800/90 p-3 shrink-0 ${
          isCompact ? 'flex justify-center' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700 text-slate-200 text-[12px] font-semibold flex items-center justify-center shrink-0">
            IQ
          </div>
          {!isCompact && (
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-white truncate">
                TenderIQ Workspace
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Proposal &amp; Bid Management
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Tablet Locked Sidebar */}
      <aside
        aria-label="Primary Sidebar"
        className={`hidden sm:block shrink-0 h-screen overflow-hidden border-r border-slate-800 transition-[width] duration-200 ${
          collapsed ? 'w-[64px]' : 'w-[240px]'
        }`}
      >
        {renderNavContent(collapsed, false)}
      </aside>

      {/* Mobile Slide-Over Drawer (< 640px) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 sm:hidden flex"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-[260px] max-w-[82vw] h-full shadow-xl">
            {renderNavContent(false, true)}
          </div>
        </div>
      )}
    </>
  );
}
