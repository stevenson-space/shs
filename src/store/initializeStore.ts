import { query } from 'vue-analytics';
import { Store } from 'vuex';
import { tryParseJSON } from '@/utils/util';
import { State } from './state';

const initializeStore = (store: Store<State>): void => {
  if (localStorage.color) {
    store.commit('setColor', localStorage.color);
    query('set', 'dimension1', localStorage.color);
  } else {
    query('set', 'dimension1', 'unset');
  }

  if (localStorage.theme) {
    const data = { theme: null, choice: '' };
    data.theme = JSON.parse(localStorage.theme);
    data.choice = 'yes';
    store.commit('setTheme', data);
  }

  store.commit('setCustomSchedules', tryParseJSON(localStorage.customSchedules));

  // defaultScheduleMode used to (inappropriately) be called defaultSchedule, so to preserve backwards compatibility:
  localStorage.defaultScheduleMode = localStorage.defaultSchedule; // TODO: remove during or after summer 2021

  if (localStorage.defaultScheduleMode) {
    store.commit('setDefaultScheduleMode', localStorage.defaultScheduleMode);
    store.commit('setScheduleMode', localStorage.defaultScheduleMode);
  }

  if (localStorage.grade) {
    store.commit('setGrade', localStorage.grade);
  }
};

export default initializeStore;
