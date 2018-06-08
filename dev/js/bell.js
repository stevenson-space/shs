import testDate from './dateparser.js';

// Look at const.js for the structure of schedules

class Bell {
  constructor(constants, date, scheduleMode = 0) {
    const { schedules } = constants;
    const schedule = this.getSchedule(schedules, date)
    const actualSchedule = schedule[scheduleMode];

    this.school = !!actualSchedule; 
    this.type = schedule.name // "Standard Schedule", "Late Arrival", "No School", ...

    if (actualSchedule) { // if there is school today (actualSchedule is undefined when no school)
      this.mode = actualSchedule.name // "Normal", "Half Periods", ...
      this.period = this.getPeriod(actualSchedule, date);
    }
  }

  static getSchedule(schedules, date) {
    let todaySchedule = null;
    schedules.forEach(schedule => {
      if (testDate(date, schedule.dates)) {
        todaySchedule = schedule;
      }
    });
    return todaySchedule;
  }

  static getPeriod({ start, end, periods }, date, dates) {
    // Check if anything is a 2D array, indicating that it varies by day (e.g. Finals)
    // the date selectors for that schedule type are also required to get which day
    const is2D = arr => Array.isArray(arr[0]);
    if ((is2D(start) || is2D(end) || is2D(periods)) && dates) {
      ({start, end, periods}) = this.getMultiDay({start, end, periods}, date, dates);
    }

    const createPeriod = (name, start, end) => ({
      beforeSchool: this.isBetweenTime(date, '0:00', start[0]),
      afterSchool: this.isBetweenTime(date, end[end.length - 1], '24:00'),
      name,
      start,
      end,
    });

    // check each period
    for (let i = 0; i < start.length; i++) {
      if (this.isBetweenTime(date, start[i], end[i])) {
        return createPeriod(periods[i], start[i], end[i]);
      }
    }

    // check each passing period
    for (let i = 1; i < start.length; i++) {
      if (this.isBetweenTime(date, end[i - 1], start[i])) {
        return createPeriod('Passing', end[i - 1], start[i]);
      }
    }

    return createPeriod();
  }

  static isBetweenTime(date, start, end) {
    const toMinutes = ([hour, minute]) => Number(hour) * 60 + Number(minute);

    const startMinutes = toMinutes(start.split(':'));
    const endMinutes = toMinutes(end.split(':'));
    const dateMinutes = toMinutes(date.getHours(), date.getMinutes());

    return startMinutes < dateMinutes && dateMinutes < endMinutes;
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
}