/**
 * Client-side text extraction for tender packages (PDF, DOCX, XLSX).
 *
 * The output is plain text with clauses separated by blank lines, which is
 * the shape `analyzeRfpText` already expects. Heavy parsers are loaded lazily
 * so they only cost bandwidth when a user actually uploads a file of that type.
 */

export type TenderFileKind = 'pdf' | 'docx' | 'xlsx';

export const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.xlsx'] as const;
export const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.join(',');
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB per file
export const MAX_FILES_PER_PACKAGE = 10;

export interface ParsedTenderFile {
  text: string;
  /** Only known for PDFs. */
  pageCount?: number;
}

const LEGACY_EXTENSIONS = ['.doc', '.xls'];

export function getTenderFileKind(fileName: string): TenderFileKind | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx')) return 'docx';
  if (lower.endsWith('.xlsx')) return 'xlsx';
  return null;
}

/** Returns a user-facing error message, or null when the file is acceptable. */
export function validateTenderFile(file: { name: string; size: number }): string | null {
  const lower = file.name.toLowerCase();
  if (LEGACY_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
    return 'Legacy .doc/.xls files are not supported. Re-save as .docx or .xlsx.';
  }
  if (!getTenderFileKind(file.name)) {
    return 'Unsupported file type. Upload a PDF, DOCX or XLSX file.';
  }
  if (file.size === 0) {
    return 'This file is empty.';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File exceeds the ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB limit.`;
  }
  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ------------------------------ PDF ------------------------------ */

export interface PdfTextItem {
  str: string;
  /** PDF.js transform matrix; [4] = x, [5] = y (origin bottom-left). */
  transform: number[];
}

const CLAUSE_START = /^(?:section\s+\d+|\d+(?:\.\d+)+\s)/i;

/**
 * Turns the positioned text fragments of one PDF page into paragraphs
 * separated by blank lines. Lines are rebuilt from y-position, wrapped lines
 * are joined, and a new paragraph starts on a larger-than-normal vertical gap
 * or when a line begins a numbered clause ("Section 4", "3.2 ...").
 */
export function pdfItemsToParagraphs(items: PdfTextItem[]): string[] {
  const fragments = items.filter((i) => i.str.trim().length > 0);
  if (fragments.length === 0) return [];

  // Group fragments into lines by y position.
  const sorted = [...fragments].sort(
    (a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]
  );
  const lines: { y: number; parts: PdfTextItem[] }[] = [];
  for (const frag of sorted) {
    const y = frag.transform[5];
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.y - y) <= 2.5) {
      last.parts.push(frag);
    } else {
      lines.push({ y, parts: [frag] });
    }
  }

  const lineTexts = lines.map((l) => ({
    y: l.y,
    text: l.parts
      .sort((a, b) => a.transform[4] - b.transform[4])
      .map((p) => p.str)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim(),
  }));

  // Typical line spacing = median gap; anything clearly larger is a paragraph break.
  const gaps = lineTexts.slice(1).map((l, i) => lineTexts[i].y - l.y).filter((g) => g > 0);
  const median = gaps.length
    ? [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length / 2)]
    : 0;
  const breakThreshold = median * 1.5;

  const paragraphs: string[] = [];
  let current: string[] = [];
  lineTexts.forEach((line, idx) => {
    const gap = idx === 0 ? 0 : lineTexts[idx - 1].y - line.y;
    const startsNewParagraph =
      current.length > 0 &&
      ((median > 0 && gap > breakThreshold) || CLAUSE_START.test(line.text));
    if (startsNewParagraph) {
      paragraphs.push(current.join(' '));
      current = [];
    }
    current.push(line.text);
  });
  if (current.length) paragraphs.push(current.join(' '));
  return paragraphs;
}

async function extractPdf(file: File): Promise<ParsedTenderFile> {
  const [pdfjs, workerModule] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;

  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjs.getDocument({ data });
  const pdf = await loadingTask.promise;
  try {
    const paragraphs: string[] = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const items = content.items.filter(
        (item): item is typeof item & PdfTextItem => 'str' in item && 'transform' in item
      );
      paragraphs.push(...pdfItemsToParagraphs(items));
    }
    return { text: paragraphs.join('\n\n'), pageCount: pdf.numPages };
  } finally {
    await loadingTask.destroy();
  }
}

/* ------------------------------ DOCX ----------------------------- */

async function extractDocx(file: File): Promise<ParsedTenderFile> {
  const mammoth = await import('mammoth/mammoth.browser');
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  // mammoth separates paragraphs with a blank line already; normalise anyway.
  const text = result.value.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return { text };
}

/* ------------------------------ XLSX ----------------------------- */

type CellValue = string | number | boolean | Date | null | undefined;

/**
 * Each non-empty spreadsheet row becomes one clause block ("Cell | Cell | ...").
 * Compliance questionnaires and pricing schedules are usually one requirement
 * per row, so this keeps them as individually extractable items.
 */
export function sheetsToBlocks(
  sheets: { sheet: string; data: CellValue[][] }[]
): string[] {
  const blocks: string[] = [];
  for (const { data } of sheets) {
    for (const row of data) {
      const cells = row
        .map((c) => {
          if (c === null || c === undefined) return '';
          if (c instanceof Date) return c.toISOString().slice(0, 10);
          return String(c).replace(/\s+/g, ' ').trim();
        })
        .filter((c) => c.length > 0);
      if (cells.length > 0) blocks.push(cells.join(' | '));
    }
  }
  return blocks;
}

async function extractXlsx(file: File): Promise<ParsedTenderFile> {
  const { default: readExcelFile } = await import('read-excel-file/browser');
  const sheets = await readExcelFile(file);
  return { text: sheetsToBlocks(sheets).join('\n\n') };
}

/* ----------------------------- Public ---------------------------- */

export async function extractTenderFileText(file: File): Promise<ParsedTenderFile> {
  const problem = validateTenderFile(file);
  if (problem) throw new Error(problem);

  let parsed: ParsedTenderFile;
  try {
    switch (getTenderFileKind(file.name)) {
      case 'pdf':
        parsed = await extractPdf(file);
        break;
      case 'docx':
        parsed = await extractDocx(file);
        break;
      default:
        parsed = await extractXlsx(file);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : '';
    if (/password/i.test(message)) {
      throw new Error('This file is password-protected. Remove the password and re-upload.');
    }
    throw new Error('Could not read this file. It may be corrupted or in an unsupported format.');
  }

  if (parsed.text.trim().length === 0) {
    throw new Error(
      getTenderFileKind(file.name) === 'pdf'
        ? 'No selectable text found. Scanned/image-only PDFs are not supported yet.'
        : 'No readable text found in this file.'
    );
  }
  return parsed;
}
