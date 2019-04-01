import { query } from 'vue-analytics';

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
  setSchedules(state, schedules) {
    state.schedules = schedules;
  },
  setScheduleMode(state, scheduleMode) {
    state.scheduleMode = scheduleMode;
  }
}