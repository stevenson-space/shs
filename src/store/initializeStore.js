import defaultSchedules from 'src/data/schedules.json';
import { query } from 'vue-analytics';

export default function(store, ga) {
  if (localStorage.color) {
    store.commit('setColor', localStorage.color);
    query('set', 'dimension1', localStorage.color)
  } else {
    query('set', 'dimension1', 'unset');
  }

  store.commit('setSchedules', defaultSchedules);

  if (localStorage.defaultSchedule) {
    store.commit('setScheduleMode', localStorage.defaultSchedule);
  }
}