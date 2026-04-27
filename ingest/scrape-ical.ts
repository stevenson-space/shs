import ICAL from 'ical.js';
import { EventCategory, CalendarEvent } from '../src/utils/calendar/types.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0';

export async function scrapeIcal(url: string): Promise<CalendarEvent[]> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);

  const calendar = new ICAL.Component(ICAL.parse(await res.text()));
  const events: CalendarEvent[] = [];

  for (const component of calendar.getAllSubcomponents('vevent')) {
    const event = new ICAL.Event(component);

    const rawCategories: string[] = [];
    for (const prop of component.getAllProperties('categories')) {
      for (const value of prop.getValues()) {
        rawCategories.push(value);
      }
    }

    const categories: EventCategory[] = [];
    for (const raw of new Set(rawCategories)) {
      const result = EventCategory.safeParse(raw);
      if (result.success) {
        categories.push(result.data);
      } else {
        console.warn(`Unknown category "${raw}" for "${event.summary}" (uid ${event.uid})`);
      }
    }

    const startDate: ICAL.Time = event.startDate;
    const endDate: ICAL.Time = event.endDate;

    const timing: CalendarEvent['timing'] = startDate.isDate
      ? {
          allDay: true,
          date: `${startDate.year}-${String(startDate.month).padStart(2, '0')}-${String(startDate.day).padStart(2, '0')}`,
        }
      : {
          allDay: false,
          start: startDate.toJSDate(),
          end: endDate ? endDate.toJSDate() : null,
        };

    events.push({
      source: { type: 'ical', iCalUid: event.uid },
      title: event.summary?.trim() ?? '',
      categories,
      timing,
      location: event.location?.trim() || null,
      description: event.description?.trim() || null,
    });
  }

  return events;
}
