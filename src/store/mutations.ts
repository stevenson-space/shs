/* eslint-disable no-param-reassign */
import officialSchedules from '@/data/schedules.json';
import { MutationTree } from 'vuex';
import { CustomSchedules, ThemeData } from '@/utils/types';
import { getNameWithoutConflicts } from '@/utils/util';
import { set as GASet } from 'vue-gtag';
import { State } from './state';

function parseUrlDateTime(route: any): Date {
  // If date and/or time is specified in URL, return that date
  // Otherwise, return current date
  let { date = '', time = '' } = route.query;
  if (!Array.isArray(time) && !Array.isArray(date)) { // make sure multiple values weren't specified in URL for each
    time = time.replace(/\./g, ':'); // lets you use "." (url safe) instead of ":" (not url safe) //FIX
    date = date.replace(/-/g, '/'); // lets you use "-" instead of "/"

    const today = new Date();
    const todayDate = today.toLocaleDateString();
    const todayTime = today.toLocaleTimeString();

    return new Date(`${date || todayDate} ${time || todayTime}`);
  }

  return new Date();
}

// For each variable that is saved to localStorage, there must be a setter with the appropriate name
// (e.g. color -> setColor) in order to ensure that the Transfer option in Settings works

const mutations: MutationTree<State> = {
  setMode(state, route) {
    // if 'date' url parameter is specified, 'day' mode is triggered
    // the 'time' url parameter is to be used for testing and forces the mode to 'current' regardless of date
    const { date, time } = route.query;
    state.mode = !date || time ? 'current' : 'day';
  },
  setColor(state, color) {
    state.color = color;
    localStorage.color = color;
    GASet({ user_properties: {
      dimension1: color,
    } });
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
  setCustomSchedules(state, schedules: CustomSchedules) {
    // If there are any schedule modes with the same name as an official schedule mode, we want to rename the custom one
    const officalScheduleModeNames = new Set();
    for (const schedule of officialSchedules) {
      for (const scheduleMode of schedule.modes) {
        officalScheduleModeNames.add(scheduleMode.name);
      }
    }
    for (const scheduleModes of Object.values(schedules)) {
      for (const scheduleMode of scheduleModes) {
        scheduleMode.name = getNameWithoutConflicts(
          scheduleMode.name,
          (name) => officalScheduleModeNames.has(name),
        );
      }
    }

    state.customSchedules = schedules;
    localStorage.customSchedules = JSON.stringify(schedules);
  },

  setTheme(state, data: ThemeData) {
    const { useThemeColor, theme } = data;
    const color = theme.suggestedColor;
    if (useThemeColor) {
      state.color = color;
      localStorage.color = color;
      GASet({ user_properties: {
        dimension1: color,
      } });
    }

    state.theme = theme;
    localStorage.theme = JSON.stringify(theme);
  },

  resetSchedules(state) {
    state.customSchedules = {};
    localStorage.customSchedules = {};
  },
  setDefaultScheduleMode(state, schedule) {
    state.defaultScheduleMode = schedule;
    localStorage.defaultScheduleMode = schedule;
  },
  setGrade(state, grade) {
    state.grade = grade;
    localStorage.grade = grade;
  },
  setAuthenticated(state, authenticated) {
    state.isAuthenticated = authenticated;
    // explicitly do not use local storage for handling authentication
    // google will automatically perform token refreshes/sign ins
    // localStorage.isAuthenticated = authenticated;
  },
};

export default mutations;
