import Vue from 'vue';
import Vuex from 'vuex';
import mutations from 'src/store/mutations.js';
import actions from 'src/store/actions.js';

import Bell from 'src/js/bell.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // in 'current' mode, everything is configured as if the specified date is current (e.g. countdown shown)
    // in 'day' mode, only details about that date are displayed (e.g. calendar events, lunch)
    mode: 'current',

    scheduleMode: '',
    color: '#00796b',

    // date indicates Date object, time indicates epoch time in milliseconds
    urlDate: new Date(), // relative to URL specified time (will be set when URL changes)
    startTime: Date.now(), // relative to real time
    currentTime: Date.now(), // relative to real time
    // such that urlDate.getTime() + (currentTime - startTime) will equal the current time relative to the URL specified time

    schedules: {},
    defaultSchedule: 'Normal', // actually the default schedule mode

    grade: 'None',
  },
  getters: {
    date(state) {
      const { urlDate, startTime, currentTime } = state;
      const date = new Date(urlDate.getTime() + (currentTime - startTime));

      // if mode is 'day' return date at time 0:00 instead (to get range string for whole day instead for current period)
      return (state.mode === 'current') ? date : new Date(date.toLocaleDateString());
    },
    bell(state, getters) {
      return new Bell(getters.date, state.schedules, state.scheduleMode);
    }
  },
  mutations,
  actions,
});