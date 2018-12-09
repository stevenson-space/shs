import testDate from './dateparser.js';
import defaultSchedules from 'src/data/schedules.json';

class Bell {
  /**
   * Creates a new Bell object with schedule info for the given date
   * @param {Date} date
   * @param {Number} [scheduleMode] defaults to the first one specified 
   * @param {Array} [schedules] list of schedules to use (if different from those in schedules.json)
   */
  constructor(date, scheduleMode = 0, schedules = defaultSchedules) {
    const schedule = Bell.getSchedule(date, schedules);
    const actualSchedule = schedule.modes[scheduleMode];

    this.date = date;
    this.school = !!actualSchedule;
    this.type = schedule.name // "Standard Schedule", "Late Arrival", "No School", ...
    this.schedule = actualSchedule;
    this.scheduleModes = schedule.modes;
    this.dates = schedule.dates;

    if (actualSchedule) { // if there is school today (actualSchedule is undefined when no school)
      this.mode = actualSchedule.name // "Normal", "Half Periods", ...
      this.period = Bell.getPeriod(actualSchedule, date, schedule.dates);
    }

    this.nextSchoolDay = Bell.nextSchoolDay(date);
  }

  /**
   * @return {string} human readable range for current period or day (blank if no school)
   */
  getRange() {
    if (this.school) {
      let { start, end, beforeSchool, afterSchool } = this.period;
      if (beforeSchool || afterSchool) { // show range for entire day
        start = this.schedule.start[0];
        end = this.schedule.end.slice(-1)[0]; // last element
      }
      return `${Bell.convertMilitaryTime(start)} – ${Bell.convertMilitaryTime(end)}`;
    }
    return '';
  }

  /**
   * @return {string} name of current period (blank if not currently in school)
   */
  getPeriodName() {
    if (this.school) {
      const { beforeSchool, afterSchool, name } = this.period;
      if (!(beforeSchool || afterSchool)) {
        return Bell.formatPeriodName(name);
      }
    }
    return '';
  }

  /**
   * Get the schedule for a given date
   * @param {Date} date
   * @param {Array} [schedules] optional alternative list of schedules
   * @return {Object}
   */
  static getSchedule(date, schedules = defaultSchedules) {
    let todaySchedule = null;
     schedules.forEach(schedule => {
      if (testDate(date, schedule.dates)) {
        todaySchedule = schedule;
      }
    });
    return todaySchedule;
  }

  /**
   * Checks if the schedule for a given date is different from normal and returns the
   * schedule if it is special
   * @param {Date} date 
   * @param {Object} [schedule] schedule on given date (to avoid unnecessary recalculation of schedule)
   * @param {Array} [schedules] optional alternative list of schedules
   * @return {Object|boolean} schedule on date if it is special, false otherwise
   */
  static isSpecialSchedule(date, schedule = null, schedules = defaultSchedules) {
    const defaultSchedule = schedules[0];

    // check if there would normally be the default schedule on that date
    // (e.g. to prevent weekends from being counted as a 'No School' special event)
    if (testDate(date, defaultSchedule.dates)) {
      // then check if the actual schedule is different from the normal one
      schedule = schedule || Bell.getSchedule(date, schedules);
      if (schedule.name !== defaultSchedule.name) {
        return schedule;
      }
    }
    return false;
  }

  /**
   * Gets the period details for the given date
   * @param {Object} schedule schedule object containing start times, end times, and period names
   * @param {Date} date date including time
   * @param {Array} [dates] the dates for the given schedule (only necessary if multiday schdeule like Finals)
   * @return {Object} object containing period name, start/end time, and whether before/after school
   */
  static getPeriod(schedule, date, dates) {
    let { start, end, periods } = schedule;

    // if multiday schedule, the date selectors for that schedule type are also required
    // in order to get which consecutive day the current date is
    if (Bell.isMultiDay(schedule) && dates) {
      ({start, end, periods} = Bell.getMultiDay({start, end, periods}, date, dates));
    }

    const createPeriod = (name, startTime, endTime) => ({
      beforeSchool: Bell.isBetweenTime(date, '0:00', start[0]),
      afterSchool: Bell.isBetweenTime(date, end[end.length - 1], '24:00'),
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
    // and period details are unnecessary
    return createPeriod();
  }

  /**
   * Checks if the given schedule is a multiday schedule (like Finals)
   * @param {Object} schedule
   * @return {boolean}
   */
  static isMultiDay(schedule) {
    // Check if anything is a 2D array, indicating that it varies by day (e.g. Finals)
    const is2D = arr => Array.isArray(arr[0]);
    return is2D(schedule.start) || is2D(schedule.end) || is2D(schedule.periods);
  }

  /**
   * Tests whether the given time falls between the given start and end times
   * @param {Date} date Date object including the time being tested
   * @param {string} start 24-hour start time string (inclusive)
   * @param {string} end 24-hour end time string (exclusive)
   * @return {boolean}
   */
  static isBetweenTime(date, start, end) {
    const toMinutes = ([hour, minute]) => Number(hour) * 60 + Number(minute);

    const startMinutes = toMinutes(start.split(':'));
    const endMinutes = toMinutes(end.split(':'));
    const dateMinutes = toMinutes([date.getHours(), date.getMinutes()]);

    return startMinutes <= dateMinutes && dateMinutes < endMinutes;
  }

  static getMultiDay({ start, end, periods }, date, dates) {
    const newDate = new Date(date); // prevent modifications to original date

    // Goes through up to 365 days preceding today to determine the index of today
    // relative to all consecutive dates with the same schedule
    for (var i = -1; i < 365 && testDate(newDate, dates); i++) {
      newDate.setDate(newDate.getDate() - 1);
    }

    // Replace all 2D arrays with the subarray corresponding to the index of today's date
    const is2D = arr => Array.isArray(arr[0]);
    start = is2D(start) ? start[i] : start;
    end = is2D(end) ? end[i] : end;
    periods = is2D(periods) ? periods[i] : periods;

    return { start, end, periods };
  }

  /**
   * Adds 'Period' to the period name if necessary
   * @param {string} name
   * @return {string}
   */
  static formatPeriodName(name) {
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
  static convertMilitaryTime(time) {
    let [hour, minute] = time.split(':').map(Number);
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    if (minute < 10) minute = '0' + minute;
    return `${hour}:${minute}`;
  }

  /**
   * Gets the next school day after the given date (not including that date)
   * @param {Date} date 
   * @param {Array} schedules optional alternative list of schedules
   */
  static nextSchoolDay(date, schedules = defaultSchedules) {
    const isSchoolDay = date => {
      // Day is school day only if a schedule exists for that day and that schedule contains
      // at least one mode
      const schedule = Bell.getSchedule(date, schedules);
      return schedule && schedule.modes[0];
    };

    // Initialize the date to the next day
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    // Keep adding a day until a school day is found
    while(!isSchoolDay(newDate)) { // TODO: Prevent infinite loop
      newDate.setDate(newDate.getDate() + 1);
    }

    return newDate;
  }
}

export default Bell;