import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface CalendarEvent {
  title: string;
  categories: string[];
  timing: { allDay: true; date: string } | { allDay: false; start: string; end: string | null };
}

const MATCHERS: { scheduleName: string; categories: string[]; terms: string[] }[] = [
  { scheduleName: 'Late Arrival', categories: ['late arrival'], terms: ['late arrival'] },
  { scheduleName: 'Activity Period', categories: ['activity period'], terms: ['activity period'] },
  { scheduleName: 'PM Assembly', categories: ['early dismissal'], terms: ['pm assembly'] },
  { scheduleName: 'Early Dismissal', categories: ['early dismissal'], terms: ['early dismissal day', 'early dismissal'] },
  { scheduleName: 'No School', categories: ['non-attendance days'],terms: ['no school', 'non-attendance day', 'non-attendance days'] },
];

const args = process.argv.slice(2);
let eventsPath = resolve(__dirname, '../src/data/events.json');
let fromDate: Date | null = null;
let toDate: Date | null = null;

for (let i = 0; i < args.length; i++) {
  if ((args[i] === '--events' || args[i] === '-e') && args[i + 1]) {
    eventsPath = resolve(args[++i]);
  } else if (args[i] === '--from' && args[i + 1]) {
    fromDate = new Date(args[++i]);
  } else if (args[i] === '--to' && args[i + 1]) {
    toDate = new Date(args[++i]);
  } else if (/^\d{4}$/.test(args[i]) || (/^\d{2}$/.test(args[i]) && parseInt(args[i]) >= 20)) {
    if (fromDate === null && toDate === null) {
      const endYear = args[i].length === 2 ? 2000 + parseInt(args[i]) : parseInt(args[i]);
      fromDate = new Date(endYear - 1, 7, 1);
      toDate = new Date(endYear, 6, 31);
    }
  }
}

if (!fromDate || !toDate) {
  const endYear = new Date().getFullYear() + 1;
  fromDate = new Date(endYear - 1, 7, 1);
  toDate = new Date(endYear, 6, 31);
  console.log(`No date range specified, defaulting to ${endYear - 1}-${endYear} academic year`);
}

console.log(`Range: ${fromDate.toLocaleDateString()} to ${toDate.toLocaleDateString()}`);
console.log(`Events file: ${eventsPath}\n`);

const events: CalendarEvent[] = JSON.parse(readFileSync(eventsPath, 'utf-8'));

function getEventDate(event: CalendarEvent): Date | null {
  if (event.timing.allDay) {
    const [y, m, d] = event.timing.date.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(event.timing.start);
}

const knownCategories = new Set(MATCHERS.flatMap(({ categories }) => categories));

const uniqueCategories = (() => {
  const counts = new Map<string, number>();
  for (const { categories } of MATCHERS) {
    for (const c of categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return new Set([...counts.entries()].filter(([, n]) => n === 1).map(([c]) => c));
})();

function matchSchedule(event: CalendarEvent): string | null {
  const titleLower = event.title.toLowerCase().trim();
  const catsLower = event.categories.map((c) => c.toLowerCase());

  const titleMatches = (terms: string[]) => terms.some((t) => titleLower.includes(t));
  const categoryMatches = (categories: string[]) => categories.some((c) => catsLower.includes(c));

  for (const { scheduleName, categories, terms } of MATCHERS) {
    if (categories.length > 0 && categoryMatches(categories) && titleMatches(terms)) return scheduleName;
  }
  for (const { scheduleName, terms } of MATCHERS) {
    if (titleMatches(terms)) return scheduleName;
  }
  for (const { scheduleName, categories } of MATCHERS) {
    if (categories.some((c) => uniqueCategories.has(c)) && categoryMatches(categories)) return scheduleName;
  }

  return null;
}

function toDateStr(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function compressDates(dates: Date[]): string[] {
  if (dates.length === 0) return [];

  dates.sort((a, b) => a.getTime() - b.getTime());
  const unique = dates.filter((d, i) => i === 0 || d.getTime() !== dates[i - 1].getTime());

  const MS_PER_DAY = 86_400_000;
  const ranges: string[] = [];
  let start = unique[0];
  let prev = unique[0];

  for (let i = 1; i < unique.length; i++) {
    const curr = unique[i];
    if (curr.getTime() - prev.getTime() === MS_PER_DAY) {
      prev = curr;
    } else {
      ranges.push(start === prev ? toDateStr(start) : `${toDateStr(start)}-${toDateStr(prev)}`);
      start = curr;
      prev = curr;
    }
  }
  ranges.push(start === prev ? toDateStr(start) : `${toDateStr(start)}-${toDateStr(prev)}`);

  return ranges;
}

const matched = new Map<string, Date[]>(MATCHERS.map(({ scheduleName }) => [scheduleName, []]));
let warned = false;

for (const event of events) {
  const date = getEventDate(event);
  if (!date || date < fromDate || date > toDate) continue;

  const scheduleName = matchSchedule(event);
  if (scheduleName) {
    matched.get(scheduleName)!.push(date);
  } else if (event.categories.some((c) => knownCategories.has(c.toLowerCase()))) {
    console.warn(`Warning: Unmatched event: "${event.title}" (categories: ${event.categories.join(', ')})`);
    warned = true;
  }
}

for (const [name, dates] of matched) {
  if (dates.length === 0) {
    console.warn(`Warning: No events matched "${name}", may be missing from events file`);
    warned = true;
  }
}

if (warned) console.log();

const scheduleDatesPath = resolve(__dirname, '../src/data/schedule-dates.json');
const output: Record<string, string[]> = JSON.parse(readFileSync(scheduleDatesPath, 'utf-8'));

for (const [name, dates] of matched) {
  output[name] = compressDates(dates);
}

writeFileSync(scheduleDatesPath, JSON.stringify(output, null, 2) + '\n');

console.log('Updated schedule-dates.json:');
for (const [name, dates] of matched) {
  const entries = output[name];
  console.log(`  ${name}: ${dates.length} event(s) → ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}`);
}