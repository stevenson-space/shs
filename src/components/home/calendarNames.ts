/*
  Looks up what the school calendar calls a day off, so a countdown or the
  upcoming list can say "Thanksgiving Break" instead of "No School".

  The calendar file is large, so it is loaded on demand, once, and only by
  the widgets that need it.
*/
import type { EventTiming } from '@/utils/calendar/types';

type RawEvent = { title?: string; categories?: string[]; timing?: EventTiming };

// local-midnight timestamps of the first and last day an event covers
type DayOff = { name: string; from: number; to: number };

let dayOffPromise: Promise<DayOff[]> | null = null;

function localDay(isoDate: string, shiftDays = 0): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d + shiftDays).getTime();
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// "President's Day (No School)" -> "President's Day"
function clean(name: string): string {
  return name
    .replace(/\((?:no school|non-attendance)[^)]*\)/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function toDayOff(event: RawEvent): DayOff | null {
  const { title = '', categories = [], timing } = event;
  if (!timing) return null;

  // "Non-attendance Day", "Thanksgiving Break (Non-attendance Day)", "Winter Break"...
  const isDayOff = categories.includes('Non-Attendance Days')
    || /non-attendance|no school|\bbreak\b|holiday/i.test(title);
  if (!isDayOff) return null;

  const name = clean(title);
  // the calendar's generic label says nothing the schedule's own name doesn't
  if (!name || /^(non-attendance day|no school)$/i.test(name)) return null;

  if (timing.allDay) {
    const from = localDay(timing.date);
    // the calendar's end date is the day after the event (iCal style)
    const to = timing.dateEnd ? Math.max(from, localDay(timing.dateEnd, -1)) : from;
    return { name, from, to };
  }

  const start = startOfDay(new Date(timing.start));
  const end = timing.end ? startOfDay(new Date(timing.end)) : start;
  return { name, from: start, to: end };
}

function loadDaysOff(): Promise<DayOff[]> {
  if (!dayOffPromise) {
    dayOffPromise = import('@/data/events.json')
      .then((module) => (module.default as RawEvent[])
        .map(toDayOff)
        .filter((dayOff): dayOff is DayOff => dayOff !== null))
      .catch(() => []);
  }

  return dayOffPromise;
}

export type DayOffNamer = (date: Date) => string;

// Resolves to a function that returns the calendar's name for a day off, or '' if it has none.
export async function loadDayOffNamer(): Promise<DayOffNamer> {
  const daysOff = await loadDaysOff();

  return (date: Date): string => {
    const day = startOfDay(date);
    return daysOff.find((dayOff) => dayOff.from <= day && day <= dayOff.to)?.name ?? '';
  };
}

let lastDaysPromise: Promise<number[]> | null = null;

// Every "Last Day of School" on the calendar, as local-midnight timestamps, earliest first.
function loadLastDays(): Promise<number[]> {
  if (!lastDaysPromise) {
    lastDaysPromise = import('@/data/events.json')
      .then((module) => (module.default as RawEvent[])
        .filter((event) => /^last day of school$/i.test((event.title ?? '').trim()) && event.timing)
        .map((event) => {
          const timing = event.timing as EventTiming;
          return timing.allDay ? localDay(timing.date) : startOfDay(new Date(timing.start));
        })
        .sort((a, b) => a - b))
      .catch(() => []);
  }

  return lastDaysPromise;
}

// The last day of this school year (or, over the summer, of the one that just ended).
export async function loadLastDayOfSchool(today: Date): Promise<Date | null> {
  const days = await loadLastDays();
  const now = startOfDay(today);
  const upcoming = days.find((day) => day >= now);
  const latest = upcoming ?? days[days.length - 1];
  // a "last day" from more than a summer ago is from an old calendar
  if (latest === undefined || now - latest > 120 * 24 * 60 * 60 * 1000) return null;
  return new Date(latest);
}
