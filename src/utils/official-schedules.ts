import rawSchedules from '../data/schedules.json';
import scheduleDates from '../data/schedule-dates.json';
import { ScheduleCollection } from './types';

// Schedules with `dates: null` pull their dates out of schedule-dates.json.
// Shared by the schedules store and the static data API (ingest/api.ts).
const officialSchedules: ScheduleCollection[] = rawSchedules.map((s) => {
  if (s.dates === null) {
    const dates = (scheduleDates as Record<string, string[]>)[s.name];
    if (!dates) throw new Error(`Schedule "${s.name}" has null dates but no entry in schedule-dates.json`);
    return { ...s, dates };
  }
  return s as ScheduleCollection;
});

export default officialSchedules;
