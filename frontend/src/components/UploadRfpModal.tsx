import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';
import type { UploadRfpInput } from '../types/tender';
import { validateUploadForm, type UploadField } from '../utils/rfpAnalyzer';
import {
  ACCEPT_ATTRIBUTE,
  MAX_FILES_PER_PACKAGE,
  extractTenderFileText,
  formatFileSize,
  getTenderFileKind,
  validateTenderFile,
} from '../utils/documentParser';

type FileStatus = 'parsing' | 'ready' | 'error';

interface PackageFile {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  text: string;
  pageCount?: number;
  error?: string;
}

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
  sourceFiles: [],
  rawText: '',
};

export function UploadRfpModal({
  open,
  onClose,
  onSubmitRfp,
}: UploadRfpModalProps) {
  const [form, setForm] = useState<UploadRfpInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<UploadField, string>>>({});
  const [files, setFiles] = useState<PackageFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextFileId = useRef(0);

  if (!open) return null;

  const isParsing = files.some((f) => f.status === 'parsing');
  const hasFailedFiles = files.some((f) => f.status === 'error');

  const updateField = <K extends keyof UploadRfpInput>(
    field: K,
    value: UploadRfpInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as UploadField]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const patchFile = (id: string, patch: Partial<PackageFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const addFiles = (incoming: FileList | File[]) => {
    const picked = Array.from(incoming);
    if (picked.length === 0) return;

    const slotsLeft = MAX_FILES_PER_PACKAGE - files.length;
    const accepted = picked.slice(0, Math.max(slotsLeft, 0));
    const overflow = picked.length - accepted.length;

    const entries: { entry: PackageFile; file: File }[] = accepted.map((file) => {
      const problem = validateTenderFile(file);
      nextFileId.current += 1;
      return {
        file,
        entry: {
          id: `pkg-file-${nextFileId.current}`,
          name: file.name,
          size: file.size,
          status: problem ? 'error' : 'parsing',
          text: '',
          error: problem ?? undefined,
        },
      };
    });

    setFiles((prev) => [...prev, ...entries.map((e) => e.entry)]);
    setErrors((prev) => ({
      ...prev,
      documents: overflow > 0
        ? `Only ${MAX_FILES_PER_PACKAGE} files per tender package. ${overflow} file(s) were not added.`
        : undefined,
    }));

    // Pre-fill the tender title from the first uploaded file name if it is empty.
    const firstValid = entries.find((e) => e.entry.status === 'parsing');
    if (firstValid && !form.title.trim()) {
      updateField(
        'title',
        firstValid.file.name.replace(/\.(pdf|docx|xlsx)$/i, '').replace(/[_-]+/g, ' ')
      );
    }

    entries
      .filter((e) => e.entry.status === 'parsing')
      .forEach(async ({ entry, file }) => {
        try {
          const parsed = await extractTenderFileText(file);
          patchFile(entry.id, {
            status: 'ready',
            text: parsed.text,
            pageCount: parsed.pageCount,
          });
        } catch (err) {
          patchFile(entry.id, {
            status: 'error',
            error: err instanceof Error ? err.message : 'Could not read this file.',
          });
        }
      });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = ''; // allow re-selecting the same file after removing it
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setErrors((prev) => ({ ...prev, documents: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const readyFiles = files.filter((f) => f.status === 'ready');
    const payload: UploadRfpInput = {
      ...form,
      sourceFiles: readyFiles.map((f) => f.name),
      rawText: readyFiles.map((f) => f.text).join('\n\n'),
    };

    const result = validateUploadForm(payload);
    if (isParsing) {
      setErrors({ ...result.errors, documents: 'Wait for all files to finish processing.' });
      return;
    }
    if (hasFailedFiles) {
      setErrors({
        ...result.errors,
        documents: 'Remove the files that failed to process, or replace them, then try again.',
      });
      return;
    }
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    onSubmitRfp(payload);
    setForm(INITIAL_FORM);
    setFiles([]);
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
              Upload &amp; Analyze Tender Package
            </h2>
            <p className="text-[12px] text-[#64748B] mt-0.5">
              Upload the complete tender package (PDF, DOCX, XLSX) to extract requirements, compliance classifications, and legal risk flags automatically.
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

          {/* Tender package upload */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                id="rfp-files-label"
                className="text-[12px] font-medium text-[#0F172A]"
              >
                Tender Package Files (PDF, DOCX, XLSX) *
              </span>
              <span className="text-[12px] text-[#64748B] tabular-nums">
                {files.length}/{MAX_FILES_PER_PACKAGE} files
              </span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-1.5 text-center px-4 py-6 border-2 border-dashed rounded-[8px] transition-colors ${
                isDragging
                  ? 'border-[#2563EB] bg-[#EFF6FF]'
                  : errors.documents
                    ? 'border-[#BE123C] bg-[#FFF1F2]/40'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#93C5FD]'
              }`}
            >
              <UploadCloud className="w-6 h-6 text-[#64748B]" aria-hidden="true" />
              <p className="text-[13px] text-[#0F172A]">
                Drag &amp; drop tender files here, or{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-labelledby="rfp-files-label"
                  className="font-medium text-[#2563EB] hover:text-[#1D4ED8] underline-offset-2 hover:underline"
                >
                  browse
                </button>
              </p>
              <p className="text-[12px] text-[#64748B]">
                RFP document, terms &amp; conditions, pricing schedules, questionnaires · up to 25 MB each
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPT_ATTRIBUTE}
                onChange={handleFileInputChange}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              />
            </div>

            {errors.documents && (
              <p className="text-[12px] text-[#BE123C] mt-1" role="alert">
                {errors.documents}
              </p>
            )}

            {files.length > 0 && (
              <ul className="mt-3 space-y-2" aria-label="Uploaded tender files">
                {files.map((f) => {
                  const Icon = getTenderFileKind(f.name) === 'xlsx' ? FileSpreadsheet : FileText;
                  return (
                    <li
                      key={f.id}
                      className={`flex items-center gap-3 px-3 py-2 bg-white border rounded-[6px] ${
                        f.status === 'error' ? 'border-[#FECDD3]' : 'border-[#E2E8F0]'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#64748B] shrink-0" aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-[#0F172A] truncate" title={f.name}>
                          {f.name}
                        </p>
                        <p
                          className={`text-[12px] ${
                            f.status === 'error' ? 'text-[#BE123C]' : 'text-[#64748B]'
                          }`}
                        >
                          {f.status === 'error'
                            ? f.error
                            : f.status === 'parsing'
                              ? `${formatFileSize(f.size)} · Reading document…`
                              : `${formatFileSize(f.size)}${f.pageCount ? ` · ${f.pageCount} pages` : ''} · Ready`}
                        </p>
                      </div>
                      {f.status === 'parsing' && (
                        <Loader2 className="w-4 h-4 text-[#2563EB] animate-spin shrink-0" aria-label="Processing" />
                      )}
                      {f.status === 'ready' && (
                        <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" aria-label="Ready" />
                      )}
                      {f.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-[#BE123C] shrink-0" aria-label="Failed" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        aria-label={`Remove ${f.name}`}
                        className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
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
              disabled={isParsing}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[6px] bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[13px] font-medium transition-colors"
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
