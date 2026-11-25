import React, { useMemo, useState } from 'react';
import { Copy, Check, Plus, Trash2, BookOpenCheck, X } from 'lucide-react';
import type {
  AnswerLibraryEntry,
  RequirementCategory,
  TeamMember,
} from '../types/tender';
import { validateLibraryEntry } from '../utils/rfpAnalyzer';

interface AnswerLibraryViewProps {
  entries: AnswerLibraryEntry[];
  teamMembers: TeamMember[];
  globalSearch: string;
  onAddEntry: (entry: Omit<AnswerLibraryEntry, 'id' | 'lastVerified' | 'usageCount'>) => void;
  onDeleteEntry: (id: string) => void;
}

export function AnswerLibraryView({
  entries,
  teamMembers,
  globalSearch,
  onAddEntry,
  onDeleteEntry,
}: AnswerLibraryViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<'All' | RequirementCategory>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RequirementCategory>('Security');
  const [tagsText, setTagsText] = useState('');
  const [ownerId, setOwnerId] = useState(teamMembers[0]?.id ?? 'tm-sarah');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<Partial<Record<'title' | 'category' | 'body', string>>>({});

  const filteredEntries = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    return entries.filter((e) => {
      if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [entries, categoryFilter, globalSearch]);

  const handleCopy = async (entry: AnswerLibraryEntry) => {
    try {
      await navigator.clipboard.writeText(entry.body);
    } catch {
      // Clipboard API may be unavailable in restricted contexts; still confirm action
    }
    setCopiedId(entry.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLibraryEntry({ title, category, body });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const parsedTags = tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddEntry({
      title: title.trim(),
      category,
      tags: parsedTags.length > 0 ? parsedTags : [category],
      ownerId,
      body: body.trim(),
    });

    setTitle('');
    setTagsText('');
    setBody('');
    setErrors({});
    setShowCreateForm(false);
  };

  const getOwnerName = (id: string) =>
    teamMembers.find((m) => m.id === id)?.name ?? 'Bid Team';

  const categories: Array<'All' | RequirementCategory> = [
    'All',
    'Security',
    'Legal',
    'Technical',
    'Commercial',
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] leading-[32px] font-semibold tracking-[-0.015em] text-[#0F172A]">
            Proposal Answer Library
          </h1>
          <p className="text-[14px] text-[#475569] mt-1">
            Pre-approved security attestations, legal fallback clauses, and technical architecture statements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowCreateForm((v) => !v);
            setErrors({});
          }}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-[6px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>New Library Entry</span>
        </button>
      </div>

      {/* Inline Create Form */}
      {showCreateForm && (
        <section
          aria-label="Create new answer library entry"
          className="bg-white border border-[#E2E8F0] rounded-[8px] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[#0F172A]">
              Add Verified Response Clause
            </h2>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              aria-label="Close new library entry form"
              className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label
                  htmlFor="lib-title"
                  className="block text-[12px] font-medium text-[#0F172A] mb-1"
                >
                  Clause Title *
                </label>
                <input
                  id="lib-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  placeholder="e.g. Zero-Trust KMS Key Rotation"
                  className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                />
                {errors.title && (
                  <p className="text-[12px] text-[#BE123C] mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lib-category"
                  className="block text-[12px] font-medium text-[#0F172A] mb-1"
                >
                  Category *
                </label>
                <select
                  id="lib-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RequirementCategory)}
                  className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="Security">Security</option>
                  <option value="Legal">Legal</option>
                  <option value="Technical">Technical</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="lib-owner"
                  className="block text-[12px] font-medium text-[#0F172A] mb-1"
                >
                  Subject Matter Owner
                </label>
                <select
                  id="lib-owner"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  {teamMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="lib-tags"
                className="block text-[12px] font-medium text-[#0F172A] mb-1"
              >
                Keywords (comma-separated)
              </label>
              <input
                id="lib-tags"
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="e.g. HIPAA, AES-256, Key Rotation"
                className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label
                htmlFor="lib-body"
                className="block text-[12px] font-medium text-[#0F172A] mb-1"
              >
                Approved Response Text *
              </label>
              <textarea
                id="lib-body"
                rows={3}
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (errors.body) setErrors((prev) => ({ ...prev, body: undefined }));
                }}
                placeholder="Enter verified proposal language approved by Legal or Security..."
                className="w-full p-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              {errors.body && (
                <p className="text-[12px] text-[#BE123C] mt-1">{errors.body}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="h-9 px-3.5 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-[6px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium"
              >
                Save Verified Entry
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Category Filter Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div
          className="flex items-center gap-1 p-0.5 bg-[#E2E8F0]/70 rounded-[6px]"
          role="tablist"
          aria-label="Filter answer library by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={categoryFilter === cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-[12px] font-medium rounded-[4px] whitespace-nowrap shrink-0 transition-colors ${
                categoryFilter === cat
                  ? 'bg-white text-[#0F172A] shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-[12px] text-[#64748B] tabular-nums">
          {filteredEntries.length} verified responses
        </div>
      </div>

      {/* Library Grid */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-[8px] p-10 text-center">
          <BookOpenCheck className="w-8 h-8 text-[#94A3B8] mx-auto mb-2.5" aria-hidden="true" />
          <h2 className="text-[15px] font-semibold text-[#0F172A]">
            No library clauses found
          </h2>
          <p className="text-[13px] text-[#64748B] mt-1">
            Try clearing your search or add a new approved response clause.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className="bg-white border border-[#E2E8F0] rounded-[8px] p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[12px] text-[#64748B] flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-[#2563EB]">
                        {entry.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{entry.tags.join(' / ')}</span>
                    </div>
                    <h2 className="text-[15px] font-semibold text-[#0F172A] mt-1">
                      {entry.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteEntry(entry.id)}
                    aria-label={`Delete ${entry.title}`}
                    className="p-1.5 rounded-md text-[#94A3B8] hover:text-[#BE123C] hover:bg-[#FFF1F2] transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[13px] leading-[20px] text-[#475569] mt-2.5 max-w-[68ch]">
                  {entry.body}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                <div className="text-[12px] text-[#64748B] flex items-center gap-1.5 flex-wrap">
                  <span>{getOwnerName(entry.ownerId)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Verified {entry.lastVerified}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">Used {entry.usageCount}x</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(entry)}
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[12px] font-medium text-[#0F172A] whitespace-nowrap shrink-0 transition-colors"
                >
                  {copiedId === entry.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#047857]" aria-hidden="true" />
                      <span className="text-[#047857]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                      <span>Copy Clause</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
