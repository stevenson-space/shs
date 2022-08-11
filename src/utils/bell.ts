import defaultSchedules from '@/data/schedules.json';
import testDate from './dateparser';
import { ScheduleCollection, Schedule, Period, SingleDaySchedule, SingleDayPeriods, MultiDaySchedule } from './types';
import { deepCopy, is2DArray } from './util';

// A type guard that states if `school` is true, then all the properties of bell (including `mode`,
// `schedule`, and `period`) will have values specified
export function isBellOnSchoolDay(bell: Bell): bell is Required<Bell> {
  return bell?.school;
}

class Bell {
  date: Date;
  school: boolean;
  type: string;
  modes: Schedule[];
  dates: string[];
  mode?: string;
  schedule?: SingleDaySchedule;
  period?: Period;
  nextSchoolDay: Date;

  /**
   * Creates a new Bell object with schedule info for the given date
   * @param {Date} date
   * @param {Array} [schedules] list of schedules to use (if different from those in schedules.json)
   * @param {string} [scheduleMode] defaults to the first one specified
   */
  constructor(date: Date, schedules: ScheduleCollection[] = defaultSchedules, scheduleMode = '') {
    const scheduleType = Bell.getScheduleType(date, schedules);
    const schedule = Bell.getSchedule(scheduleType.modes, scheduleMode);

    this.date = date;
    this.school = !!schedule;
    this.type = scheduleType.name; // "Standard Schedule", "Late Arrival", "No School", ...
    this.modes = scheduleType.modes;
    this.dates = scheduleType.dates;

    if (schedule) { // if there is school today (schedule is undefined when no school)
      this.mode = schedule.name; // "Normal", "Half Periods", ...
      this.schedule = Bell.processMultiDay(schedule, date, scheduleType.dates);
      this.period = Bell.getPeriod(this.schedule, date);
    }

    this.nextSchoolDay = Bell.getNextSchoolDay(date, schedules);
  }

  /**
   * @return {string} human readable range for current period or day (blank if no school)
   */
  getRange(): string {
    if (isBellOnSchoolDay(this)) {
      let start: string;
      let end: string;
      if (this.period.beforeSchool || this.period.afterSchool) { // show range for entire day
        start = this.schedule.start[0];
        end = this.schedule.end.slice(-1)[0]; // last element in `end`
      } else {
        ({ start, end } = this.period);
      }
      return `${Bell.convertMilitaryTime(start)} – ${Bell.convertMilitaryTime(end)}`;
    }
    return '';
  }

  /**
   * @return {string} name of current period (blank if not currently in school)
   */
  getPeriodName(): string {
    if (isBellOnSchoolDay(this)) {
      if (!this.period.beforeSchool && !this.period.afterSchool) { // if not before or after school, then period must have name
        return Bell.formatPeriodName(this.period.name);
      }
    }
    return '';
  }

  /**
   * Get the schedule object for the specified date's schedule type
   *
   * Note: contains multiple schedules (1 for each schedule mode)
   *
   * @param {Date} date
   * @param {Array} [schedules] optional alternative list of schedules
   * @return {Object}
   */
  static getScheduleType(date: Date, schedules: ScheduleCollection[] = defaultSchedules): ScheduleCollection {
    // notice that we're getting the last schedule that matches (in case multiple schedules match)
    let todaySchedule: ScheduleCollection | null = null;
    schedules.forEach((schedule) => {
      if (testDate(date, schedule.dates)) {
        todaySchedule = schedule;
      }
    });

    if (todaySchedule === null) {
      throw new Error("Error: Today's date doesn't match any schedules. Please ensure there's a default schedule specified that matches all dates.");
    }

    return todaySchedule;
  }

  /**
   * Get the actual schedule from the set of schedule modes
   */
  static getSchedule(scheduleModes: Schedule[], scheduleMode: string): Schedule | null {
    // default to first schedule in array (null if scheduleModes is empty, indicating no school)
    let schedule = scheduleModes.length > 0 ? scheduleModes[0] : null;
    scheduleModes.forEach((mode) => {
      if (mode.name === scheduleMode) {
        schedule = mode;
      }
    });
    return schedule;
  }

  /**
   * Gets the period details for the given date. The provided schedule must be single-day (you can
   * use processMultiDaySchedule to convert a multi-day schedule to a single-day one)
   */
  static getPeriod(schedule: SingleDaySchedule, date: Date): Period {
    const { start, end, periods } = schedule;

    const createPeriod = (name: string, startTime: string, endTime: string): Period => ({
      name,
      start: startTime,
      end: endTime,
    });

    // check each period
    for (let i = 0; i < start.length; i++) {
      if (Bell.isBetweenTime(date, start[i], end[i])) {
        return createPeriod(periods[i], start[i], end[i]);
      }
    }

    // check each passing period
    for (let i = 1; i < start.length; i++) {
      // check if we are between the end of the last period and the start of the current period
      if (Bell.isBetweenTime(date, end[i - 1], start[i])) {
        return createPeriod('!Passing', end[i - 1], start[i]);
      }
    }

    // If not in any period or passing period, then it is before or after school
    if (Bell.isBetweenTime(date, '0:00', start[0])) {
      return { beforeSchool: true };
    }
    // otherwise, Bell.isBetweenTime(date, end[end.length - 1], '24:00') must be true
    return { afterSchool: true };
  }

  /**
   * Checks if the given schedule is a single-day schedule (and not a multiday one like Finals)
   */
  static isSingleDaySchedule(schedule: Schedule): schedule is SingleDaySchedule {
    const is2D = is2DArray;
    return !is2D(schedule.start) && !is2D(schedule.end) && !is2D(schedule.periods);
  }

  static isMultiDaySchedule(schedule: Schedule): schedule is MultiDaySchedule {
    return !this.isSingleDaySchedule(schedule);
  }

  /**
   * Tests whether the given time falls between the given start and end times
   * @param {Date} date Date object including the time being tested
   * @param {string} start 24-hour start time string (inclusive)
   * @param {string} end 24-hour end time string (exclusive)
   * @return {boolean}
   */
  static isBetweenTime(date: Date, start: string, end: string): boolean {
    const toMinutes = ([hour, minute]: (number | string)[]): number => Number(hour) * 60 + Number(minute);

    const startMinutes = toMinutes(start.split(':'));
    const endMinutes = toMinutes(end.split(':'));
    const dateMinutes = toMinutes([date.getHours(), date.getMinutes()]);

    return startMinutes <= dateMinutes && dateMinutes < endMinutes;
  }

  static getMultiDay({ start, end, periods }: Schedule, date: Date, dates: string[]): SingleDayPeriods {
    const newDate = new Date(date); // prevent modifications to original date

    // Goes through up to 365 days preceding today to determine the index of today
    // relative to all consecutive dates with the same schedule
    let i;
    for (i = -1; i < 365 && testDate(newDate, dates); i++) {
      newDate.setDate(newDate.getDate() - 1);
    }

    // Replace all 2D arrays with the subarray corresponding to the index of today's date
    start = is2DArray(start) ? start[i] : start;
    end = is2DArray(end) ? end[i] : end;
    periods = is2DArray(periods) ? periods[i] : periods;

    return { start, end, periods };
  }

  static processMultiDay(schedule: Schedule, date: Date, dates: string[]): SingleDaySchedule {
    if (Bell.isSingleDaySchedule(schedule)) { // then we don't need to do anything
      return schedule;
    }

    // otherwise, it's a multi-day schedule and we create a single-day schedule corresponding to which
    // day it is in the sequence
    const newSchedule = deepCopy(schedule) as SingleDaySchedule;
    const { start, end, periods } = Bell.getMultiDay(schedule, date, dates);

    // replace the original start, end, periods (could be arrays) with the ones for today
    newSchedule.start = start;
    newSchedule.end = end;
    newSchedule.periods = periods;
    return newSchedule;
  }

  /**
   * Adds 'Period' to the period name if necessary
   * @param {string} name
   * @return {string}
   */
  static formatPeriodName(name: string): string {
    if (name[0] === '!') {
      return name.substring(1);
    }
    return `Period ${name}`;
  }

  /**
   * Converts from military (24-hour) time to 12-hour time
   * @param {string} time
   * @return {string}
   */
  static convertMilitaryTime(time: string): string {
    // we specify (number | string) in the type instead of just (number) to allow reassigning `minute` to a string later
    let [hour, minute]: (number | string)[] = time.split(':').map(Number);
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    if (minute < 10) minute = `0${minute}`;
    return `${hour}:${minute}`;
  }

  /**
   * Returns the suffix ('AM' or 'PM') given a time in 24-hour format
   * @param {string} time
   * @return {string}
   */
  static getSuffix(time: string): string {
    const [hours] = time.split(':').map(Number);
    return hours < 12 ? 'AM' : 'PM';
  }

  /**
   * Returns an integer representation of the time during the day (usually for comparison purposes)
   * @param {string} time
   * @return {number}
   */
  static timeToNumber(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Gets the next school day after the given date (not including that date)
   * @param {Date} date
   * @param {Array} schedules optional alternative list of schedules
   */
  static getNextSchoolDay(date: Date, schedules: ScheduleCollection[] = defaultSchedules): Date {
    const isSchoolDay = (dateToCheck: Date): Schedule => {
      // Day is school day only if a schedule exists for that day and that schedule contains
      // at least one mode
      const schedule = Bell.getScheduleType(dateToCheck, schedules);
      return schedule && schedule.modes[0];
    };

    // Initialize the date to the next day
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    // Keep adding a day until a school day is found
    while (!isSchoolDay(newDate)) { // TODO: Prevent infinite loop
      newDate.setDate(newDate.getDate() + 1);
    }

    return newDate;
  }
}

export default Bell;
