import { defineStore } from 'pinia';
import { RouteLocationNormalized } from 'vue-router';
import { CustomSchedules, ScheduleCollection } from '@/utils/types';
import { tryParseJSON, getNameWithoutConflicts } from '@/utils/util';
import Bell from '@/utils/bell';
import officialSchedules from '@/data/schedules.json';

interface State {
  customSchedules: CustomSchedules,
  defaultScheduleMode: string,
  scheduleMode: string,
  mode: string,
  urlDate: Date,
  startTime: any,
  currentTime: any,
}

function parseUrlDateTime(route: RouteLocationNormalized): Date {
  // If date and/or time is specified in URL, return that date
  // Otherwise, return current date
  let { date = '', time = '' } = route.query;
  if (!date) date = '';
  if (!time) time = '';

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

export default defineStore('schedules', {
  // convert to a function
  state: (): State => ({
    customSchedules: {} as CustomSchedules,
    defaultScheduleMode: 'Normal',
    scheduleMode: '',
    mode: 'current',
    urlDate: new Date(), // relative to URL specified time (will be set when URL changes)
    startTime: Date.now(), // relative to real time
    currentTime: Date.now(), // relative to real time
  }),
  getters: {
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
    date(state): Date {
      const { urlDate, startTime, currentTime } = this;
      const date = new Date(
        urlDate.getTime() + (currentTime - startTime),
      );
      // if mode is 'day' return date at time 0:00 instead (to get range string for whole day instead for current period)
      return state.mode === 'current'
        ? date
        : new Date(date.toLocaleDateString());
    },
  },
  actions: {
    initialize() {
      this.setCustomSchedules(tryParseJSON(localStorage.customSchedules));
      // defaultScheduleMode used to (inappropriately) be called defaultSchedule, so to preserve backwards compatibility:
      localStorage.defaultScheduleMode = localStorage.defaultSchedule; // TODO: remove during or after summer 2021
      if (localStorage.defaultScheduleMode) {
        this.setDefaultScheduleMode(localStorage.defaultScheduleMode);
        this.setScheduleMode(localStorage.defaultScheduleMode);
      }
    },
    pageLoaded(route: RouteLocationNormalized) {
      console.log(route);
      this.setMode(route);
      this.setUrlDate(route);
      this.setStartTime();
      this.setCurrentTime();
    },
    countdownDone() {
      this.setCurrentTime();
    },

    setUrlDate(route: RouteLocationNormalized) {
      this.urlDate = parseUrlDateTime(route);
    },
    setStartTime() {
      this.startTime = Date.now();
    },
    setCurrentTime() {
      this.currentTime = Date.now();
    },

    addCustomScheduleMode({ scheduleType, scheduleToAdd, scheduleToReplace }:any) {
      // If scheduleToReplace is not defined, then we want to just add to end of scheduleModes list
      const scheduleModes = (this.customSchedules || {})[scheduleType] || [];
      const replaceIndex = scheduleModes.map((mode:any) => mode.name).indexOf(scheduleToReplace);
      // Notice that scheduleModes only contains schedules from customSchedules, so if scheduleToReplace is an
      // official schedule, then replaceIndex will be -1, and we'll just add the new schedule without replacing anything
      // (this is the expected behavior because official schedules can't be modified or replaced)
      if (replaceIndex !== -1) {
        scheduleModes.splice(replaceIndex, 1, scheduleToAdd);
      } else {
        scheduleModes.push(scheduleToAdd);
      }
      this.setCustomSchedules({ ...this.customSchedules, [scheduleType]: scheduleModes });
    },
    removeCustomScheduleMode({ scheduleType, scheduleToRemove }:any) {
      // if scheduleType is not provided, then we remove scheduleToRemove for all schedule types
      for (const [type, scheduleModes] of Object.entries(this.customSchedules || {})) {
        if (!scheduleType || scheduleType === type) {
          const removeIndex = scheduleModes.map((mode:any) => mode.name).indexOf(scheduleToRemove);
          if (removeIndex > -1) {
            scheduleModes.splice(removeIndex, 1);
          }
        }
      }
      this.setCustomSchedules(this.customSchedules);
    },
    setCustomSchedules(schedules: CustomSchedules) {
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
      this.customSchedules = schedules;
      localStorage.customSchedules = JSON.stringify(schedules);
    },
    resetSchedules() {
      this.customSchedules = {};
      localStorage.customSchedules = {};
    },
    setDefaultScheduleMode(schedule: string) {
      this.defaultScheduleMode = schedule;
      localStorage.defaultScheduleMode = schedule;
    },
    setScheduleMode(scheduleMode: string) {
      this.scheduleMode = scheduleMode;
    },
    setMode(route: RouteLocationNormalized) {
      // if 'date' url parameter is specified, 'day' mode is triggered
      // the 'time' url parameter is to be used for testing and forces the mode to 'current' regardless of date
      const { date, time } = route.query;
      this.mode = !date || time ? 'current' : 'day';
    },
    bell(otherGetters: any) {
      return new Bell(otherGetters.date, otherGetters.schedules, this.scheduleMode);
    },
  },
});
