import React, { useState } from 'react';
import { FileUp, Sparkles, X } from 'lucide-react';
import type { UploadRfpInput } from '../types/tender';
import { validateUploadForm, type UploadField } from '../utils/rfpAnalyzer';
import { SAMPLE_RFP_TEMPLATES } from '../data/seedData';

interface UploadRfpModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitRfp: (input: UploadRfpInput) => void;
}

const INITIAL_FORM: UploadRfpInput = {
  title: '',
  issuingAuthority: '',
  sector: 'Enterprise Software',
  contractValue: '',
  deadlineDate: '2026-12-18',
  rawText: '',
};

export function UploadRfpModal({
  open,
  onClose,
  onSubmitRfp,
}: UploadRfpModalProps) {
  const [form, setForm] = useState<UploadRfpInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<UploadField, string>>>({});
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  if (!open) return null;

  const updateField = <K extends keyof UploadRfpInput>(
    field: K,
    value: UploadRfpInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as UploadField]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      updateField('rawText', content);
      if (!form.title.trim()) {
        updateField(
          'title',
          file.name.replace(/\.(txt|md|csv)$/i, '').replace(/[_-]+/g, ' ')
        );
      }
    };
    reader.readAsText(file);
  };

  const handleLoadTemplate = (templateId: string) => {
    const tpl = SAMPLE_RFP_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    setForm({
      title: tpl.title,
      issuingAuthority: tpl.issuingAuthority,
      sector: tpl.sector,
      contractValue: tpl.contractValue,
      deadlineDate: tpl.deadlineDate,
      rawText: tpl.rawText,
    });
    setUploadedFileName(null);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateUploadForm(form);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    onSubmitRfp(form);
    setForm(INITIAL_FORM);
    setUploadedFileName(null);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-rfp-modal-title"
    >
      <div
        className="fixed inset-0 bg-[#0F172A]/45 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-[12px] shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_4px_10px_-2px_rgba(15,23,42,0.04)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2
              id="upload-rfp-modal-title"
              className="text-[18px] font-semibold text-[#0F172A]"
            >
              Upload &amp; Analyze RFP Document
            </h2>
            <p className="text-[12px] text-[#64748B] mt-0.5">
              Extract structured requirements, compliance classifications, and legal risk flags automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close upload modal"
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="overflow-y-auto px-6 py-5 space-y-4 flex-1"
        >
          {/* Quick Sample Loader */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-3 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[12px] font-medium text-[#475569]">
              Need sample procurement text to test extraction?
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {SAMPLE_RFP_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleLoadTemplate(tpl.id)}
                  className="h-7 px-2.5 rounded-[4px] bg-white border border-[#E2E8F0] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] hover:text-[#1D4ED8] text-[12px] font-medium text-[#0F172A] transition-colors"
                >
                  Load {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="rfp-title"
                className="block text-[12px] font-medium text-[#0F172A] mb-1"
              >
                Tender Title *
              </label>
              <input
                id="rfp-title"
                type="text"
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Regional Transit Telemetry Cloud"
                className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              {errors.title && (
                <p className="text-[12px] text-[#BE123C] mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="rfp-authority"
                className="block text-[12px] font-medium text-[#0F172A] mb-1"
              >
                Issuing Authority *
              </label>
              <input
                id="rfp-authority"
                type="text"
                value={form.issuingAuthority}
                onChange={(e) => updateField('issuingAuthority', e.target.value)}
                placeholder="e.g. Metro Transit Authority"
                className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              {errors.issuingAuthority && (
                <p className="text-[12px] text-[#BE123C] mt-1">
                  {errors.issuingAuthority}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="rfp-value"
                className="block text-[12px] font-medium text-[#0F172A] mb-1"
              >
                Contract Value (USD) *
              </label>
              <input
                id="rfp-value"
                type="number"
                min="1"
                step="1000"
                value={form.contractValue}
                onChange={(e) => updateField('contractValue', e.target.value)}
                placeholder="2450000"
                className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] tabular-nums placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              {errors.contractValue && (
                <p className="text-[12px] text-[#BE123C] mt-1">
                  {errors.contractValue}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="rfp-deadline"
                className="block text-[12px] font-medium text-[#0F172A] mb-1"
              >
                Submission Deadline *
              </label>
              <input
                id="rfp-deadline"
                type="date"
                value={form.deadlineDate}
                onChange={(e) => updateField('deadlineDate', e.target.value)}
                className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
              {errors.deadlineDate && (
                <p className="text-[12px] text-[#BE123C] mt-1">
                  {errors.deadlineDate}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="rfp-sector"
                className="block text-[12px] font-medium text-[#0F172A] mb-1"
              >
                Industry Sector
              </label>
              <input
                id="rfp-sector"
                type="text"
                value={form.sector}
                onChange={(e) => updateField('sector', e.target.value)}
                placeholder="e.g. Healthcare"
                className="w-full h-9 px-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* File Drop Input + Text Area */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <label
                htmlFor="rfp-raw-text"
                className="text-[12px] font-medium text-[#0F172A]"
              >
                RFP Document Clauses (Paste or Upload .txt / .md) *
              </label>
              <label className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer">
                <FileUp className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{uploadedFileName ?? 'Attach text file'}</span>
                <input
                  type="file"
                  accept=".txt,.md,.text"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>
            <textarea
              id="rfp-raw-text"
              rows={7}
              value={form.rawText}
              onChange={(e) => updateField('rawText', e.target.value)}
              placeholder="Paste procurement sections separated by blank lines (e.g., SLA uptime, SOC 2 security, indemnification, payment terms)..."
              className="w-full p-3 bg-white border border-[#E2E8F0] rounded-[6px] text-[13px] leading-[19px] text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
            />
            {errors.rawText && (
              <p className="text-[12px] text-[#BE123C] mt-1">{errors.rawText}</p>
            )}
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-[6px] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[13px] font-medium text-[#0F172A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Analyze &amp; Extract Requirements</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
