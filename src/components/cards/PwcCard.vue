<template>
    <card v-if="userSettingsStore.showPWCSchedule && showPWCCard" class="card">
        <p class="title">PWC</p>
        <div class="green-line"></div>
        <div class="countdown">
            <p v-if="isOpen">{{ countdownTime }}</p>
            <p v-else>{{ openingStatus }}</p>
           <p v-if="isOpen" class="time-text">Time remaining until closure</p>
            <p v-else class="time-text">{{ timeStatus }}</p>
        </div>
    </card>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import Card from '@/components/Card.vue';
import useUserSettingsStore from '@/stores/user-settings';
import useClockStore from '@/stores/clock';
import useScheduleStore from '@/stores/schedules';
import Bell from '@/utils/bell';

const clockStore = useClockStore();
const userSettingsStore = useUserSettingsStore();
const scheduleStore = useScheduleStore();

type PwcHours = {
  start: string;
  end: string;
};

const regularOpeningTimes: Record<number, PwcHours> = {
  0: { start: '10:00', end: '14:00' }, // Sunday
  1: { start: '15:30', end: '20:00' }, // Monday
  2: { start: '15:30', end: '20:00' }, // Tuesday
  3: { start: '15:30', end: '20:00' }, // Wednesday
  4: { start: '15:30', end: '20:00' }, // Thursday
  5: { start: '15:30', end: '18:00' }, // Friday
  6: { start: '10:00', end: '14:00' }, // Saturday
};

const nonAttendanceOpeningTimes: PwcHours = { start: '08:00', end: '16:00' };

const closedDays = new Set([
  '2026-03-29',
  '2026-04-03',
  '2026-04-04',
  '2026-04-05',
  '2026-05-10',
  '2026-05-21',
  '2026-05-22',
  '2026-05-23',
  '2026-05-24',
  '2026-05-25',
  '2026-05-26',
  '2026-05-27',
  '2026-05-28',
  '2026-05-29',
  '2026-05-30',
  '2026-05-31',
]);

const currentTimeMs = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const currentTime = computed(() => new Date(currentTimeMs.value));

const showPWCCard = computed(() => {
  const scheduleDate = new Date(clockStore.date);
  const today = new Date();
  return scheduleDate.getDate() === today.getDate() &&
          scheduleDate.getMonth() === today.getMonth() &&
          scheduleDate.getFullYear() === today.getFullYear();
});

const todayHours = computed(() => getHoursForDate(currentTime.value));

const currentOpeningTime = computed(() => {
  if (!todayHours.value) {
    return null;
  }
  return getTimeInMs(currentTime.value, todayHours.value.start);
});

const currentClosingTime = computed(() => {
  if (!todayHours.value) {
    return null;
  }
  return getTimeInMs(currentTime.value, todayHours.value.end);
});

const nextOpeningTime = computed(() => getNextOpeningTime(currentTime.value));

const isOpen = computed(() => {
  if (!todayHours.value || currentOpeningTime.value === null || currentClosingTime.value === null) {
    return false;
  }

  return (
    currentTime.value.getTime() >= currentOpeningTime.value
    && currentTime.value.getTime() <= currentClosingTime.value
  );
});

const openingStatus = computed(() => {
  if (!todayHours.value) {
    return 'Closed Today';
  }

  if (isOpen.value) {
    return 'Open';
  }

  if (nextOpeningTime.value === null) {
    return 'Closed';
  }

  return `Opens at ${formatTime(nextOpeningTime.value)}`;
});

const timeStatus = computed(() => isOpen.value ? 'Closes' : 'Closed');

const countdownTime = computed(() => {
  const targetTime = isOpen.value ? currentClosingTime.value : nextOpeningTime.value;
  if (targetTime === null) {
    return '00:00:00';
  }
  const timeDiff = targetTime - currentTimeMs.value;
  if (timeDiff <= 0) {
    return '00:00:00';
  }
  const hours = String(Math.floor(timeDiff / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
});

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTimeInMs(date: Date, timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  const dateWithTime = new Date(date);
  dateWithTime.setHours(hours, minutes, 0, 0);
  return dateWithTime.getTime();
}

function getHoursForDate(date: Date): PwcHours | null {
  if (closedDays.has(getDateKey(date))) {
    return null;
  }

  const scheduleType = Bell.getScheduleType(date, scheduleStore.schedules).name;
  if (scheduleType === 'No School') {
    return nonAttendanceOpeningTimes;
  }

  return regularOpeningTimes[date.getDay()] || null;
}

function getNextOpeningTime(date: Date): number | null {
  const nowMs = date.getTime();
  const todayOpeningHours = getHoursForDate(date);

  if (todayOpeningHours) {
    const todayOpeningTime = getTimeInMs(date, todayOpeningHours.start);
    if (nowMs < todayOpeningTime) {
      return todayOpeningTime;
    }
  }

  const dateToCheck = new Date(date);
  dateToCheck.setHours(0, 0, 0, 0);

  for (let daysAhead = 0; daysAhead < 370; daysAhead++) {
    if (daysAhead > 0) {
      dateToCheck.setDate(dateToCheck.getDate() + 1);
    }

    const openingHours = getHoursForDate(dateToCheck);
    if (!openingHours) {
      continue;
    }

    const openingTime = getTimeInMs(dateToCheck, openingHours.start);
    if (openingTime > nowMs) {
      return openingTime;
    }
  }

  return null;
}

function formatTime(timeInMs: number): string {
  const date = new Date(timeInMs);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${formattedHours}:${formattedMinutes} ${period}`;
}

function updateCurrentTime(): void {
  currentTimeMs.value = Date.now();
}

// created() logic — runs immediately
updateCurrentTime();
timer = setInterval(() => {
  updateCurrentTime();
}, 1000);

onBeforeUnmount(() => {
  clearInterval(timer!);
});
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card
  padding: 0 8px
  padding-bottom: 5px

.title
    margin: 15px 0
    text-align: center
    font-size: 20px

.countdown
  font-size: 20px
  text-align: center
  margin-top: 10px

.countdown p
  margin: 5px 0
    text-align: center

.time-text
  font-size: 15px
  text-align: center
  color: var(--accent)

.green-line
  width: 100%
  height: 1px
  background-color: var(--accent)
  margin-bottom: 10px
</style>
