import Bell from '@/utils/bell';
import type { ScheduleCollection } from '@/utils/types';

/*
  Finds the school's big breaks (Thanksgiving, Winter, Spring...) from the
  official schedules: any stretch of days off, weekends included, with at
  least three school days off in it. A long weekend doesn't count. Summer
  starts the day after the calendar's Last Day of School.
*/

export type SchoolBreak = {
  key: string;
  name: string;
  // first and last day off (weekends at either end included)
  start: Date;
  end: Date | null;
  // first day back at school, when the data knows it
  back: Date | null;
};

type Options = {
  from: Date;
  schedules?: ScheduleCollection[];
  // the school calendar's name for a day off ("Thanksgiving Break"), or ''
  nameFor?: (date: Date) => string;
  lastDayOfSchool?: Date | null;
  // school days off needed to count as a break
  minDaysOff?: number;
  // how far ahead to look when the end of the school year is unknown
  lookaheadDays?: number;
};

const DAY_OFF = 'No School';
const WEEKEND = 'No School (Weekend)';

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

// When the calendar has no name for it, go by the time of year.
function fallbackName(date: Date): string {
  const month = date.getMonth();
  if (month === 10) return 'Thanksgiving Break';
  if (month === 11 || month === 0) return 'Winter Break';
  if (month === 2 || month === 3) return 'Spring Break';
  return 'Break';
}

export function findBreaks({
  from,
  schedules,
  nameFor = () => '',
  lastDayOfSchool = null,
  minDaysOff = 3,
  lookaheadDays = 400,
}: Options): SchoolBreak[] {
  const today = startOfDay(from);
  const typeOf = (date: Date) => Bell.getScheduleType(date, schedules).name;
  const isOff = (date: Date) => {
    const name = typeOf(date);
    return name === DAY_OFF || name === WEEKEND || date.getDay() % 6 === 0;
  };

  // start a little before today, so a break that is already on still shows
  let day = today;
  for (let i = 0; i < 30 && isOff(addDays(day, -1)); i++) day = addDays(day, -1);

  const last = lastDayOfSchool ? startOfDay(lastDayOfSchool) : addDays(today, lookaheadDays);
  const breaks: SchoolBreak[] = [];
  let run: { start: Date; end: Date; daysOff: number; name: string } | null = null;

  for (; day <= last; day = addDays(day, 1)) {
    const name = typeOf(day);
    const dayOff = name === DAY_OFF;

    if (dayOff || name === WEEKEND || day.getDay() % 6 === 0) {
      if (!run) run = { start: day, end: day, daysOff: 0, name: '' };
      run.end = day;

      if (dayOff) {
        run.daysOff += 1;
        // the first proper name in the stretch wins ("Spring Break", not "Non-attendance Day")
        if (!run.name) run.name = nameFor(day);
      }
    } else {
      if (run && run.daysOff >= minDaysOff) {
        breaks.push({
          key: `break-${run.start.getTime()}`,
          name: run.name || fallbackName(run.start),
          start: run.start,
          end: run.end,
          back: day,
        });
      }
      run = null;
    }
  }

  if (lastDayOfSchool) {
    breaks.push({
      key: 'summer',
      name: 'Summer Break',
      start: addDays(lastDayOfSchool, 1),
      end: null,
      back: null,
    });
  }

  // anything that hasn't ended yet
  return breaks.filter((entry) => !entry.end || entry.end >= today);
}
