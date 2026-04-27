import * as cheerio from 'cheerio';
import { EventCategory, CalendarEvent } from '../src/utils/calendar/types.js';

const BASE_URL = 'https://www.d125.org';
const ELEMENT_ID = 1577;
const PAGE_ID = 412;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0';

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.text();
}

function elementUrl(params: Record<string, string>): string {
  const p = new URLSearchParams({
    is_draft: 'false',
    is_load_more: 'true',
    page_id: String(PAGE_ID),
    parent_id: String(ELEMENT_ID),
    _: String(Date.now()),
    ...params,
  });
  return `${BASE_URL}/fs/elements/${ELEMENT_ID}?${p}`;
}

interface PartialEvent {
  occurId: number;
  title: string;
  categories: EventCategory[];
  timing: CalendarEvent['timing'];
  location: string | null;
}

function parseMonthHtml(html: string, year: number, month: number): PartialEvent[] {
  const $ = cheerio.load(html);
  const events: PartialEvent[] = [];

  $('.fsCalendarDaybox.fsStateHasEvents').each((_, daybox) => {
    const $date = $(daybox).find('.fsCalendarDate');
    const day = parseInt($date.attr('data-day')!);
    const dataMonth = parseInt($date.attr('data-month')!); // 0-indexed
    const dataYear = parseInt($date.attr('data-year')!);

    // Filter out-of-range days from adjacent months shown at grid edges
    if (dataMonth !== month - 1 || dataYear !== year) return;

    $(daybox).find('.fsCalendarInfo').each((_, info) => {
      const $info = $(info);
      const $link = $info.find('.fsCalendarEventTitle');
      const occurIdStr = $link.attr('data-occur-id');
      if (!occurIdStr) return;

      const occurId = parseInt(occurIdStr);
      const title = ($link.attr('title') || $link.text()).trim();

      const rawCategory = $info.find('.fsElementEventColorIcon').attr('title');
      const categoryResult = rawCategory ? EventCategory.safeParse(rawCategory) : null;
      if (rawCategory && !categoryResult?.success) {
        console.warn(`Unknown category "${rawCategory}" for "${title}" (occurId ${occurId})`);
      }
      const categories: EventCategory[] = categoryResult?.success ? [categoryResult.data] : [];

      const startDatetime = $info.find('time.fsStartTime').attr('datetime');
      const endDatetime = $info.find('time.fsEndTime').attr('datetime');

      const timing: CalendarEvent['timing'] = startDatetime
        ? {
            allDay: false,
            start: new Date(startDatetime),
            end: endDatetime ? new Date(endDatetime) : null,
          }
        : {
            allDay: true,
            date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          };

      events.push({
        occurId,
        title,
        categories,
        timing,
        location: $info.find('.fsLocation').text().trim() || null,
      });
    });
  });

  return events;
}

async function fetchDetails(occurId: number): Promise<{ description: string | null; location: string | null }> {
  const html = await fetchHtml(elementUrl({ occur_id: String(occurId), show_event: 'true' }));
  const $ = cheerio.load(html);
  return {
    description: $('.fsNotes').text().trim() || null,
    location: $('.fsLocation').first().text().trim() || null,
  };
}

export async function scrapeMonth(year: number, month: number): Promise<CalendarEvent[]> {
  const html = await fetchHtml(
    elementUrl({ cal_date: `${year}-${String(month).padStart(2, '0')}-01` })
  );
  const partials = parseMonthHtml(html, year, month);

  return Promise.all(
    partials.map(async (partial) => {
      const details = await fetchDetails(partial.occurId);
      return {
        source: { type: 'scraper' as const, occurId: partial.occurId },
        title: partial.title,
        categories: partial.categories,
        timing: partial.timing,
        location: details.location ?? partial.location,
        description: details.description,
      } satisfies CalendarEvent;
    })
  );
}

export async function scrapeRange(from: string, to: string): Promise<CalendarEvent[]> {
  const [fromYear, fromMonth] = from.split('-').map(Number);
  const [toYear, toMonth] = to.split('-').map(Number);

  const results: CalendarEvent[] = [];
  let y = fromYear, m = fromMonth;

  while (y < toYear || (y === toYear && m <= toMonth)) {
    results.push(...await scrapeMonth(y, m));
    if (++m > 12) { m = 1; y++; }
  }

  return results;
}
