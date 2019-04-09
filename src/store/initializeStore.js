import defaultSchedules from 'src/data/schedules.json';
import { query } from 'vue-analytics';

export default function(store) {
  if (localStorage.color) {
    store.commit('setColor', localStorage.color);
    query('set', 'dimension1', localStorage.color)
  } else {
    query('set', 'dimension1', 'unset');
  }

  const localSchedules = localStorage.schedules ? tryParseJSON(localStorage.schedules) : null
  const schedules = Array.isArray(localSchedules) ? localSchedules : defaultSchedules;
  store.commit('setSchedules', schedules);

  if (localStorage.defaultSchedule) {
    store.commit('setScheduleMode', localStorage.defaultSchedule);
  }
}

function tryParseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}