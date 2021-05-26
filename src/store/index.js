import Vue from 'vue';
import Vuex from 'vuex';
import officialSchedules from '@/data/schedules.json';
import Bell from '@/utils/bell';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // in 'current' mode, everything is configured as if the specified date is current (e.g. countdown shown)
    // in 'day' mode, only details about that date are displayed (e.g. calendar events, lunch)
    mode: 'current',

    scheduleMode: '',
    color: '#1b5e20',

    // date indicates Date object, time indicates epoch time in milliseconds
    urlDate: new Date(), // relative to URL specified time (will be set when URL changes)
    startTime: Date.now(), // relative to real time
    currentTime: Date.now(), // relative to real time
    // such that urlDate.getTime() + (currentTime - startTime) will equal the current time relative to the URL specified time

    customSchedules: {},
    defaultScheduleMode: 'Normal',

    grade: 'None',

    // authenticated with a student.d125.org google email
    isAuthenticated: false,
  },
  getters: {
    date(state) {
      const { urlDate, startTime, currentTime } = state;
      const date = new Date(
        urlDate.getTime() + (currentTime - startTime),
      );

      // if mode is 'day' return date at time 0:00 instead (to get range string for whole day instead for current period)
      return state.mode === 'current'
        ? date
        : new Date(date.toLocaleDateString());
    },
    schedules(state) { // we merge the officialSchedules provided by us and the user defined customSchedules
      const schedules = JSON.parse(JSON.stringify(officialSchedules)); // begin with copying the officialSchedules

      // customSchedules is an object with `schedule type` keys and values containing a
      // list of schedule mode objects for the corresponding schedule type
      const { customSchedules } = state;
      if (customSchedules) {
        for (const schedule of schedules) {
          const customScheduleModes = customSchedules[schedule.name];
          if (customScheduleModes) { // if there exist custom schedules for the current schedule type
            for (const scheduleMode of customScheduleModes) {
              // add the scheduleMode, and also include an `isCustom` flag to later be able to distinguish them
              schedule.modes.push({ ...scheduleMode, isCustom: true });
            }
          }
        }
      }
      return schedules;
    },
    bell(state, getters) {
      return new Bell(getters.date, getters.schedules, state.scheduleMode);
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
  },
  mutations,
  actions,
});
