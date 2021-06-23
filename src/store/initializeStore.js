import { query } from 'vue-analytics';
import { tryParseJSON } from '@/utils/util';

export default function (store) {
  if (localStorage.color) {
    store.commit('setColor', localStorage.color);
    query('set', 'dimension1', localStorage.color);
  } else {
    query('set', 'dimension1', 'unset');
  }

  if (localStorage.theme) {
    var data = {};
    data.theme = JSON.parse(localStorage.theme)
    data.choce = 'yes'
    store.commit('setTheme', data);
  } 

  store.commit('setCustomSchedules', tryParseJSON(localStorage.customSchedules));

  // defaultScheduleMode used to (innapropriately) be called defaultSchedule, so to preserve backwards compatibility:
  localStorage.defaultScheduleMode = localStorage.defaultSchedule; // TODO: remove during or after summer 2021

  if (localStorage.defaultScheduleMode) {
    store.commit('setDefaultScheduleMode', localStorage.defaultScheduleMode);
    store.commit('setScheduleMode', localStorage.defaultScheduleMode);
  }

  if (localStorage.grade) {
    store.commit('setGrade', localStorage.grade);
  }
}
