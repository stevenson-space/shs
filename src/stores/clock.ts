import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { RouteLocationNormalized } from 'vue-router';
import Bell from '@/utils/bell';
import useScheduleStore from '@/stores/schedules';

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
    const todayDate = today.toLocaleDateString();
    const todayTime = today.toTimeString().split(' ')[0];

    const parsedDate = new Date(`${date || todayDate} ${time || todayTime}`);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }
  return new Date();
}

export default defineStore('clock', () => {
  const scheduleStore = useScheduleStore();

  const urlDate = ref(new Date());
  const clockMode = ref<'current' | 'day'>('current');
  const startTime = ref(Date.now());
  const currentTime = ref(Date.now());
  let clockInterval: ReturnType<typeof setInterval> | null = null;

  const date = computed((): Date => {
    const d = new Date(urlDate.value.getTime() + (currentTime.value - startTime.value));
    // if mode is 'day' return date at time 0:00 instead (to get range string for whole day instead for current period)
    if (clockMode.value === 'current') return d;
    const normalized = new Date(d);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  });

  const bell = computed((): Bell => new Bell(date.value, scheduleStore.schedules, scheduleStore.scheduleMode));

  function stopClock(): void {
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  }

  function startClock(): void {
    stopClock();
    currentTime.value = Date.now();
    clockInterval = setInterval(() => {
      currentTime.value = Date.now();
    }, 1000);
  }

  function setStartTime(): void {
    startTime.value = Date.now();
  }

  function setModeFromRoute(route: RouteLocationNormalized): void {
    // if 'date' url parameter is specified, 'day' mode is triggered
    // the 'time' url parameter is to be used for testing and forces the mode to 'current' regardless of date
    const { date: dateParam, time } = route.query;
    clockMode.value = !dateParam || time ? 'current' : 'day';

    if (clockMode.value === 'current') {
      startClock();
    } else {
      stopClock();
    }
  }

  function pageLoaded(route: RouteLocationNormalized): void {
    setStartTime();
    startClock();
    setModeFromRoute(route);
    urlDate.value = parseDateTimeFromRoute(route);
  }

  return { urlDate, clockMode, startTime, currentTime, date, bell, pageLoaded, stopClock, startClock, setStartTime, setModeFromRoute };
});
