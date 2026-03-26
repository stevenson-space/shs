<template>
    <card v-if="userSettingsStore.showILCSchedule && showILCCard" class="card">
        <p class="title">ILC</p>
        <div class="green-line"></div>
        <div class="countdown">
            <p v-if="isOpen">{{ countdownTime }}</p>
            <p v-else>{{ openingStatus }}</p>
           <p v-if="isOpen" class="time-text">Time remaining until closure</p>
            <p v-else class="time-text">{{ timeStatus }}</p>
        </div>
        <a href="https://d125.libanswers.com/faq/376376" target="_blank" class="rent-link">
          Rent a room
        </a>
    </card>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import Card from '@/components/Card.vue';
import useUserSettingsStore from '@/stores/user-settings';
import useClockStore from '@/stores/clock';

const clockStore = useClockStore();
const userSettingsStore = useUserSettingsStore();

const openingTimes = [
  { day: 1, start: '7:00', end: '18:30' }, // Monday
  { day: 2, start: '7:00', end: '18:30' }, // Tuesday
  { day: 3, start: '7:00', end: '18:30' }, // Wednesday
  { day: 4, start: '7:00', end: '18:30' }, // Thursday
  { day: 5, start: '7:00', end: '18:30' }, // Friday
  { day: 6, start: '7:00', end: '14:00' }, // Saturday
  { day: 0, start: '10:00', end: '14:00' }, // Sunday
];

const closedDays = [
  // Add dates in 'YYYY-MM-DD' format for holidays or special closures
  '2024-02-18',
  '2024-02-19',
  '2024-03-03',
  '2024-03-04',
  '2024-03-31',
  '2024-05-12',
  '2024-05-22',
  '2024-05-23',
  '2024-05-24',
  '2024-05-25',
  '2024-05-26',
  '2024-05-27',
];

const currentTimeMs = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const currentTime = computed(() => new Date(currentTimeMs.value));

const showILCCard = computed(() => {
  const scheduleDate = new Date(clockStore.date);
  const today = new Date();
  return scheduleDate.getDate() === today.getDate() &&
          scheduleDate.getMonth() === today.getMonth() &&
          scheduleDate.getFullYear() === today.getFullYear();
});

const currentDay = computed(() => currentTime.value.getDay());

const currentOpeningTime = computed(() => {
  const openingTime = openingTimes.find(
    (time) => time.day === currentDay.value,
  )!;
  return getTimeInMs(
    currentTime.value.toDateString(),
    openingTime.start,
  );
});

const currentClosingTime = computed(() => {
  const closingTime = openingTimes.find(
    (time) => time.day === currentDay.value,
  )!;
  return getTimeInMs(
    currentTime.value.toDateString(),
    closingTime.end,
  );
});

const nextOpeningTime = computed(() => {
  const currentDate = currentTime.value.toISOString().substr(0, 10);
  if (currentTime.value < currentOpeningTime.value) {
    const openingTime = openingTimes.find((time) => time.day === currentDay.value)!;
    return getTimeInMs(currentDate, openingTime.start);
  }

  let nextDay = (currentDay.value + 1) % 7;
  while (closedDays.includes(new Date(getNextDate(nextDay)).toISOString().substr(0, 10))) {
    nextDay = (nextDay + 1) % 7;
  }
  const openingTime = openingTimes.find((time) => time.day === nextDay)!;
  return getTimeInMs(currentDate, openingTime.start);
});

const isOpen = computed(() => {
  const isClosedDay = closedDays.includes(currentTime.value.toISOString().substr(0, 10));
  if (isClosedDay) {
    return false;
  }

  return (
    currentTime.value >= currentOpeningTime.value && currentTime.value <= currentClosingTime.value
  );
});

const openingStatus = computed(() => {
  if (closedDays.includes(currentTime.value.toISOString().substr(0, 10)) || currentDay.value == 0 || currentDay.value == 6) { //if day is weekend, not opened
    return 'Closed Today';
  }

  return isOpen.value ? 'Open' : `Opens at ${formatTime(nextOpeningTime.value)}`;
});

const timeStatus = computed(() => isOpen.value ? 'Closes' : 'Closed');

const countdownTime = computed(() => {
  const targetTime = isOpen.value ? currentClosingTime.value : nextOpeningTime.value;
  const timeDiff = targetTime - currentTimeMs.value;
  if (timeDiff <= 0) {
    return '00:00:00';
  }
  const hours = String(Math.floor(timeDiff / (1000 * 60 * 60))).padStart(2, '0');
  const minutes = String(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
  const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
});

function getTimeInMs(dateString: string, timeString: string): number {
  const dateTimeString = `${dateString} ${timeString}`;
  return new Date(dateTimeString).getTime();
}

function getNextDate(day: number): string {
  const today = currentTime.value.getDay();
  const difference = (day - today + 7) % 7;
  const nextDate = new Date(currentTime.value);
  nextDate.setDate(currentTime.value.getDate() + difference);
  return nextDate.toDateString();
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
  padding-bottom: 15px

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

.rent-link
  display: block
  text-align: center
  margin-top: 10px
</style>
