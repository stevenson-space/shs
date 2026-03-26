import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import pdfWorker from 'pdfjs-dist/legacy/build/pdf.worker?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

if (!('withResolvers' in Promise)) {
  Object.defineProperty(Promise, 'withResolvers', {
    configurable: true,
    writable: true,
    value() {
      let resolve!: (value: unknown) => void;
      let reject!: (reason?: unknown) => void;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    },
  });
}

const TERM_REGEX = /^Grd (\d{2}) \d{2}-\d{2} Term ([12])$/;
const COURSE_MARKER_REGEX = /^(H|X|C|N|G|O|S|R|D)$/;
const NUMERIC_CREDIT_REGEX = /^\d+\.\d{2}$/;
const LETTER_GRADE_REGEX = /^(A|B|C|D|F|P|W|WF|AU|N)$/;
const STOP_TOKENS = new Set([
  'Student Information',
  'Cumulative GPA',
  'Work in Progress',
  'GPA and Credit Summary',
  'Registrar:',
  'Generated on 3/25/2026',
  'Page 1 of 1',
]);

export type ParsedTranscriptCourse = {
  transcriptName: string;
  yearKey: string;
  term: string;
  mark: 'A' | 'B' | 'C' | 'D' | 'F';
  credit: number;
  courseMarker?: string;
};

export type ParsedTranscriptResult = {
  courses: ParsedTranscriptCourse[];
  skippedCount: number;
};

/** Extracts transcript tokens from a Stevenson transcript PDF and parses them into course entries. */
export async function parseTranscriptPdf(file: File): Promise<ParsedTranscriptResult> {
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocument({
    data,
    disableWorker: true,
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true,
    stopAtErrors: false,
  }).promise;
  const tokens: string[] = [];

  for (let pageIndex = 1; pageIndex <= pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex);
    const text = await page.getTextContent();
    tokens.push(
      ...text.items
        .map((item) => ('str' in item ? item.str.trim() : ''))
        .filter(Boolean),
    );
  }

  return parseTranscriptTokens(tokens);
}

/** Parses flattened transcript text tokens into normalized course records for GPA import. */
export function parseTranscriptTokens(tokens: string[]): ParsedTranscriptResult {
  const courses: ParsedTranscriptCourse[] = [];
  let skippedCount = 0;

  for (let index = 0; index < tokens.length; index += 1) {
    const termMatch = tokens[index].match(TERM_REGEX);
    if (!termMatch) {
      continue;
    }

    const yearKey = gradeToYearKey(termMatch[1]);
    const term = termMatch[2];

    index += 1;
    while (index < tokens.length && tokens[index] !== 'Credit') {
      if (isStopToken(tokens[index]) || TERM_REGEX.test(tokens[index])) {
        index -= 1;
        break;
      }
      index += 1;
    }

    while (index + 1 < tokens.length) {
      index += 1;

      if (index >= tokens.length || isStopToken(tokens[index]) || TERM_REGEX.test(tokens[index])) {
        index -= 1;
        break;
      }

      if (tokens[index].startsWith('Credit:')) {
        break;
      }

      let courseMarker: string | undefined;
      if (COURSE_MARKER_REGEX.test(tokens[index])) {
        courseMarker = tokens[index];
        index += 1;
      }

      const details: string[] = [];
      while (
        index < tokens.length
        && !NUMERIC_CREDIT_REGEX.test(tokens[index])
        && !tokens[index].startsWith('Credit:')
        && !TERM_REGEX.test(tokens[index])
        && !isStopToken(tokens[index])
      ) {
        details.push(tokens[index]);
        index += 1;
      }

      if (index >= tokens.length || !NUMERIC_CREDIT_REGEX.test(tokens[index])) {
        index -= 1;
        continue;
      }

      const credit = Number(tokens[index]);
      const gradeIndex = findLastGradeIndex(details);
      if (gradeIndex === -1) {
        skippedCount += 1;
        continue;
      }

      const mark = details[gradeIndex];
      const transcriptName = collapseWhitespace(details.slice(0, gradeIndex).join(' '));

      if (!transcriptName || !isSupportedGrade(mark)) {
        skippedCount += 1;
        continue;
      }

      courses.push({
        transcriptName,
        yearKey,
        term,
        mark,
        credit,
        courseMarker,
      });
    }
  }

  return { courses, skippedCount };
}

/** Converts transcript grade levels into the GPA calculator's year buckets. */
function gradeToYearKey(gradeLevel: string): string {
  const gradeNumber = Number(gradeLevel);
  if (gradeNumber <= 9) return 'freshman';
  if (gradeNumber === 10) return 'sophomore';
  if (gradeNumber === 11) return 'junior';
  return 'senior';
}

/** Normalizes repeated whitespace in transcript-derived strings. */
function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Finds the last letter-grade token in a transcript detail row. */
function findLastGradeIndex(details: string[]): number {
  for (let index = details.length - 1; index >= 0; index -= 1) {
    if (LETTER_GRADE_REGEX.test(details[index])) {
      return index;
    }
  }
  return -1;
}

/** Restricts parsed transcript marks to graded entries used by the calculator. */
function isSupportedGrade(mark: string): mark is ParsedTranscriptCourse['mark'] {
  return ['A', 'B', 'C', 'D', 'F'].includes(mark);
}

/** Identifies transcript tokens that indicate parsing should stop for the current section. */
function isStopToken(token: string): boolean {
  return STOP_TOKENS.has(token);
}
