import { query } from 'vue-analytics';
import defaultSchedules from 'src/data/schedules.json';

function parseUrlDateTime(route) {
  // If date and/or time is specified in URL, return that date
  // Otherwise, return current date
  let { date='', time='' } = route.query;
  time = time.replace(/\./g, ':'); // lets you use "." (url safe) instead of ":" (not url safe)
  date = date.replace(/-/g, '/'); // lets you use "-" instead of "/"

  const today = new Date();
  const todayDate = today.toLocaleDateString();
  const todayTime = today.toLocaleTimeString();
  
  return new Date(`${date || todayDate} ${time || todayTime}`);
}

export default {
  setMode(state, route) {
    // if 'date' url parameter is specified, 'day' mode is triggered
    // the 'time' url parameter is to be used for testing and forces the mode to 'current' regardless of date
    const { date, time } = route.query;
    state.mode = (!date || time) ? 'current' : 'day';
  },
  setColor(state, color) {
    state.color = color;
    localStorage.color = color;
    query('set', 'dimension1', color);
  },
  setUrlDate(state, route) {
    state.urlDate = parseUrlDateTime(route);
  },
  setStartTime(state) {
    state.startTime = Date.now();
  },
  setCurrentTime(state) {
    state.currentTime = Date.now();
  },
  setScheduleMode(state, scheduleMode) {
    state.scheduleMode = scheduleMode;
  },
  setSchedules(state, schedules) {
    state.schedules = schedules;
    localStorage.schedules = JSON.stringify(schedules);
  },
  addScheduleMode(state, { scheduleType, scheduleToAdd, scheduleToReplace }) {
    state.schedules.forEach(schedule => {
      if (schedule.name === scheduleType) {
        const replaceIndex = schedule.modes.map(mode => mode.name).indexOf(scheduleToReplace);
        if (scheduleToReplace && replaceIndex > -1) {
          schedule.modes.splice(replaceIndex, 1, scheduleToAdd);
        } else {
          schedule.modes.push(scheduleToAdd);
        }
      }
    });
    localStorage.schedules = JSON.stringify(state.schedules);
  },
  removeScheduleMode(state, { scheduleType, scheduleToRemove }) {
    state.schedules.forEach(schedule => {
      if (!scheduleType || schedule.name === scheduleType) {
        const removeIndex = schedule.modes.map(mode => mode.name).indexOf(scheduleToRemove);
        if (removeIndex > -1) {
          schedule.modes.splice(removeIndex, 1);
        }
      }
    });
    localStorage.schedules = JSON.stringify(state.schedules);
  },
  resetSchedules(state) {
    state.schedules = defaultSchedules;
    localStorage.schedules = JSON.stringify(defaultSchedules);
  }
}