import { set } from 'vue-gtag';
import { Store } from 'vuex';
import { ThemeData } from '@/utils/types';
import { tryParseJSON } from '@/utils/util';
import { State } from './state';

const initializeStore = (store: Store<State>): void => {
  if (localStorage.color && process.env.VUE_APP_EDIT_COLORS !== 'true') {
    store.commit('setColor', localStorage.color);
    set({ dimension1: localStorage.color });
  } else {
    set({ dimension1: 'unset' });
  }

  if (localStorage.theme && process.env.VUE_APP_EDIT_COLORS !== 'true') {
    const data:ThemeData = { theme: JSON.parse(localStorage.theme), useThemeColor: false };
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
