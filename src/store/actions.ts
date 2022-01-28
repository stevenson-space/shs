import { Route } from 'vue-router';
import { ActionTree } from 'vuex';
import { State } from './state';

const actions: ActionTree<State, State> = {
  pageLoaded({ commit }, route: Route) {
    commit('setMode', route);
    commit('setUrlDate', route);
    commit('setStartTime');
    commit('setCurrentTime');
  },
  countdownDone({ commit }) {
    commit('setCurrentTime');
  },
  addCustomScheduleMode({ commit, state }, { scheduleType, scheduleToAdd, scheduleToReplace }) {
    // If scheduleToReplace is not defined, then we want to just add to end of scheduleModes list
    const scheduleModes = (state.customSchedules || {})[scheduleType] || [];
    const replaceIndex = scheduleModes.map((mode) => mode.name).indexOf(scheduleToReplace);
    // Notice that scheduleModes only contains schedules from customSchedules, so if scheduleToReplace is an
    // official schedule, then replaceIndex will be -1, and we'll just add the new schedule without replacing anything
    // (this is the expected behavior because official schedules can't be modified or replaced)
    if (replaceIndex !== -1) {
      scheduleModes.splice(replaceIndex, 1, scheduleToAdd);
    } else {
      scheduleModes.push(scheduleToAdd);
    }

    commit('setCustomSchedules', { ...state.customSchedules, [scheduleType]: scheduleModes });
  },
  removeCustomScheduleMode({ commit, state }, { scheduleType, scheduleToRemove }) {
    // if scheduleType is not provided, then we remove scheduleToRemove for all schedule types
    for (const [type, scheduleModes] of Object.entries(state.customSchedules || {})) {
      if (!scheduleType || scheduleType === type) {
        const removeIndex = scheduleModes.map((mode) => mode.name).indexOf(scheduleToRemove);
        if (removeIndex > -1) {
          scheduleModes.splice(removeIndex, 1);
        }
      }
    }
    commit('setCustomSchedules', state.customSchedules);
  },

  async fetchBackgroundImages({ commit, state }) {
    if (!Object.keys(state.backgroundImages).includes('sys')) { // If the data hasn't already been cached into state - this is done to reduce CDN traffic
      const response = await fetch(`https://cdn.contentful.com/spaces/${process.env.VUE_APP_CONTENTFUL_SPACE_ID}/entries?access_token=${process.env.VUE_APP_CONTENTFUL_ACCESS_TOKEN}`);
      if (response.status === 200) {
        const body = await response.json();
        commit('setBackgroundImages');
      }
    }
  },
};

export default actions;
