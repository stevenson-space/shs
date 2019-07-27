import defaultSchedules from 'src/data/schedules.json';
import testDate from './dateparser';

class Bell {
  /**
   * Creates a new Bell object with schedule info for the given date
   * @param {Date} date
   * @param {Array} [schedules] list of schedules to use (if different from those in schedules.json)
   * @param {Number} [scheduleMode] defaults to the first one specified
   */
  constructor(date, schedules = defaultSchedules, scheduleMode = '') {
    const scheduleType = Bell.getScheduleType(date, schedules);
    const schedule = Bell.getSchedule(scheduleType.modes, scheduleMode);

    this.date = date;
    this.school = !!schedule;
    this.type = scheduleType.name; // "Standard Schedule", "Late Arrival", "No School", ...
    this.schedule = schedule;
    this.modes = scheduleType.modes;
    this.dates = scheduleType.dates;

    if (schedule) { // if there is school today (schedule is undefined when no school)
      this.mode = schedule.name; // "Normal", "Half Periods", ...
      this.schedule = Bell.processMultiDay(schedule, date, scheduleType.dates);
      this.period = Bell.getPeriod(this.schedule, date);
    }

    this.nextSchoolDay = Bell.nextSchoolDay(date, schedules);
  }

  /**
   * @return {string} human readable range for current period or day (blank if no school)
   */
  getRange() {
    if (this.school) {
      let { start, end } = this.period;
      const { beforeSchool, afterSchool } = this.period;
      if (beforeSchool || afterSchool) { // show range for entire day
        [start] = this.schedule.start; // get first element
        [end] = this.schedule.end.slice(-1); // get last element
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
   * Get the schedule object for the specified date's schedule type
   *
   * Note: contains multiple schedules (1 for each schedule mode)
   *
   * @param {Date} date
   * @param {Array} [schedules] optional alternative list of schedules
   * @return {Object}
   */
  static getScheduleType(date, schedules = defaultSchedules) {
    let todaySchedule = null;
    schedules.forEach((schedule) => {
      if (testDate(date, schedule.dates)) {
        todaySchedule = schedule;
      }
    });
    return todaySchedule;
  }

  /**
   * Get the actual schedule from the set of schedule modes
   * @param {*} schedule
   * @param {*} scheduleMode
   */
  static getSchedule(scheduleModes, scheduleMode) {
    let schedule = scheduleModes[0]; // default to first schedule in array
    scheduleModes.forEach((mode) => {
      if (mode.name === scheduleMode) {
        schedule = mode;
      }
    });
    return schedule;
  }

  /**
   * Gets the period details for the given date
   * @param {Object} schedule schedule object containing start times, end times, and period names
   * @param {Date} date date including time
   * @param {Array} [dates] the dates for the given schedule (only necessary if multiday schdeule like Finals)
   * @return {Object} object containing period name, start/end time, and whether before/after school
   */
  static getPeriod(schedule, date) {
    const { start, end, periods } = schedule;

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
    let i;
    for (i = -1; i < 365 && testDate(newDate, dates); i++) {
      newDate.setDate(newDate.getDate() - 1);
    }

    // Replace all 2D arrays with the subarray corresponding to the index of today's date
    const is2D = arr => Array.isArray(arr[0]);
    start = is2D(start) ? start[i] : start;
    end = is2D(end) ? end[i] : end;
    periods = is2D(periods) ? periods[i] : periods;

    return { start, end, periods };
  }

  static processMultiDay(schedule, date, dates) {
    const newSchedule = JSON.parse(JSON.stringify(schedule)); // duplicate schedule (don't want to modify original)
    if (Bell.isMultiDay(schedule)) {
      // if it is a multiday schedule get the start, end, and periods corresponding to the day
      const { start, end, periods } = Bell.getMultiDay(schedule, date, dates);

      // replace the original start, end, periods (could be arrays) with the ones for today
      newSchedule.start = start;
      newSchedule.end = end;
      newSchedule.periods = periods;
    }
    return newSchedule;
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
    if (minute < 10) minute = `0${minute}`;
    return `${hour}:${minute}`;
  }

  /**
   * Returns the suffix ('AM' or 'PM') given a time in 24-hour format
   * @param {string} time
   * @return {string}
   */
  static getSuffix(time) {
    const [hours] = time.split(':').map(Number);
    return hours < 12 ? 'AM' : 'PM';
  }

  /**
   * Returns an integer representation of the time during the day (usually for comparison purposes)
   * @param {string} time
   * @return {number}
   */
  static timeToNumber(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Gets the next school day after the given date (not including that date)
   * @param {Date} date
   * @param {Array} schedules optional alternative list of schedules
   */
  static nextSchoolDay(date, schedules = defaultSchedules) {
    const isSchoolDay = (dateToCheck) => {
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
