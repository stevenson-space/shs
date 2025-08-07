import { defineStore } from 'pinia';
import Bell from '@/utils/bell';
import { RouteLocationNormalized } from 'vue-router';
import useScheduleStore from '@/stores/schedules'

interface State {
  urlDate: Date;
  clockMode: 'current' | 'day',
  startTime: number;
  currentTime: number;
  clockInterval: ReturnType<typeof setInterval> | null;
}

function parseDateTimeFromRoute(route: RouteLocationNormalized): Date {
  // If date and/or time is specified in URL, return that date
  // Otherwise, return current date
  let { date = '', time = '' } = route.query;
  // needed in case date or time is null, undefined handled above
  if (!date) date = '';
  if (!time) time = '';

  if (!Array.isArray(time) && !Array.isArray(date)) { // make sure multiple values weren't specified in URL for each
    time = time.replace(/\./g, ':'); // lets you use "." (url safe) instead of ":" (not url safe)
    date = date.replace(/-/g, '/'); // lets you use "-" instead of "/"

    const today = new Date();
    const todayDate = today.toISOString().split('T')[0].replace(/-/g, '/');
    const todayTime = today.toTimeString().split(' ')[0];

    const parsedDate = new Date(`${date || todayDate} ${time || todayTime}`);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }
  return new Date();
}

export default defineStore('clock', {
  state: (): State => ({
    urlDate: new Date(),
    clockMode: 'current',
    startTime: Date.now(),
    currentTime: Date.now(),
    clockInterval: null
  }),
  getters: {
    date(): Date {
      const { urlDate, startTime, currentTime } = this;
      const date = new Date(
        (urlDate.getTime()) + (currentTime - startTime),
      );
      // if mode is 'day' return date at time 0:00 instead (to get range string for whole day instead for current period)
      return this.clockMode === 'current'
        ? date
        : new Date(date.toLocaleDateString());
    },
    bell(getters: any): Bell {
      const scheduleStore = useScheduleStore();
      return new Bell(getters.date, scheduleStore.schedules, scheduleStore.scheduleMode);
    },
  },
  actions: {
    pageLoaded(route: RouteLocationNormalized): void {
      this.setStartTime();
      this.startClock();
      this.setModeFromRoute(route);
      this.urlDate = parseDateTimeFromRoute(route);
    },
    stopClock(): void {
      if (this.clockInterval) {
        clearInterval(this.clockInterval);
        this.clockInterval = null;
      }
    },
    startClock(): void {
      this.stopClock();
      this.currentTime = Date.now();
      this.clockInterval = setInterval(() => {
        this.currentTime = Date.now();
      }, 1000);
    },
    setStartTime(): void {
      this.startTime = Date.now();
    },
    setModeFromRoute(route: RouteLocationNormalized): void {
      // if 'date' url parameter is specified, 'day' mode is triggered
      // the 'time' url parameter is to be used for testing and forces the mode to 'current' regardless of date
      const { date, time } = route.query;
      this.clockMode = !date || time ? 'current' : 'day';

      if (this.clockMode === 'current') {
        this.startClock();
      } else {
        this.stopClock();
      }
    },
  }
});
