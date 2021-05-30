import { GetterTree } from 'vuex';
import officialSchedules from '@/data/schedules.json';
import Bell from '@/utils/bell';
import { ScheduleCollection } from '@/utils/types';
import { State } from './state';

const getters: GetterTree<State, State> = {
  date(state): Date {
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
    const schedules: ScheduleCollection[] = JSON.parse(JSON.stringify(officialSchedules)); // begin with copying the officialSchedules

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
  bell(state, otherGetters) {
    return new Bell(otherGetters.date, otherGetters.schedules, state.scheduleMode);
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
};

export default getters;
