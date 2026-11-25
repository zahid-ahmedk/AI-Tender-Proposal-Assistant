import React from 'react';
import { Menu, Search, Plus } from 'lucide-react';
import type { AppView } from '../types/tender';

interface TopBarProps {
  activeView: AppView;
  activeTenderTitle?: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenMobileMenu: () => void;
  onOpenUploadModal: () => void;
}

const VIEW_LABELS: Record<AppView, string> = {
  overview: 'Overview',
  analyzer: 'Document Analyzer',
  matrix: 'Compliance Matrix',
  library: 'Answer Library',
  team: 'Team & Rules',
};

export function TopBar({
  activeView,
  activeTenderTitle,
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  onOpenUploadModal,
}: TopBarProps) {
  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0] sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile drawer trigger + Breadcrumb trail */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="sm:hidden p-2 -ml-1 rounded-md text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] min-w-0">
          <span className="text-[#64748B] whitespace-nowrap shrink-0 hidden md:inline">
            Workspace
          </span>
          <span className="text-[#CBD5E1] hidden md:inline" aria-hidden="true">
            /
          </span>
          <span className="font-semibold text-[#0F172A] whitespace-nowrap shrink-0">
            {VIEW_LABELS[activeView]}
          </span>
          {activeView === 'analyzer' && activeTenderTitle && (
            <>
              <span className="text-[#CBD5E1] hidden lg:inline" aria-hidden="true">
                /
              </span>
              <span className="text-[#475569] truncate max-w-[260px] xl:max-w-[380px] hidden lg:inline">
                {activeTenderTitle}
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Right: Search input + Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative hidden md:block w-[240px] lg:w-[290px]">
          <Search
            className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tenders, clauses, or refs..."
            aria-label="Search tenders, clauses, or references"
            className="w-full h-9 pl-9 pr-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-shadow"
          />
        </div>

        <button
          type="button"
          onClick={onOpenUploadModal}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[6px] bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#004AC6] text-white text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Upload RFP</span>
        </button>
      </div>
    </header>
  );
}
