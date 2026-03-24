<template>
  <card v-if="showILCCard" class="card">
    <p class="title">ILC</p>
    <div class="green-line"></div>
    <div class="countdown">
      <p v-if="isOpen">{{ countdownTime }}</p>
      <p v-else>{{ openingStatus }}</p>
      <p v-if="isOpen" class="time-text">Time remaining until closure</p>
      <p v-else class="time-text">{{ timeStatus }}</p>
    </div>
    <button class="more-button" type="button" @click="showMore = !showMore">
      {{ showMore ? 'Less' : 'More' }}
    </button>
    <div v-if="showMore" class="details">
      <p class="details-title">Upper ILC - Study Room Regulations</p>
      <ul>
        <li>Each student using a study room must check in at the main desk.</li>
        <li>No food in the study rooms.</li>
        <li>The number of people per room is limited to the number of seats (6 maximum).</li>
        <li>Individuals are limited to using study rooms no more than 3 times in a 2 week period.</li>
        <li>This limitation ensures that all students have equal opportunity to use study rooms.</li>
        <li>Students may request study rooms online at least 24 hours in advance (not including weekends and school holidays).</li>
        <li>Rooms not reserved in advance are available to students on a first come, first served basis. Check in at the main desk upon arrival.</li>
        <li>If you are more than 20 minutes late for your reserved time slot, the room will be released to someone else.</li>
      </ul>
      <a
        class="form-link"
        href="https://docs.google.com/forms/d/e/1FAIpQLSfuUtBcvAd9fV4N3hMXQ3jjVmvL54EA5eBg_jCKa205IcCwEA/viewform"
        target="_blank"
        rel="noopener noreferrer"
      >
        Reserve a study room
      </a>
    </div>
  </card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import Card from '@/components/Card.vue';
import useClockStore from '@/stores/clock';

const clockStore = useClockStore();

const showMore = ref(false);
const currentTimeMs = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

const currentTime = computed(() => new Date(currentTimeMs.value));

const showILCCard = computed(() => {
  const scheduleDate = new Date(clockStore.date);
  const today = new Date();
  return scheduleDate.getDate() === today.getDate()
    && scheduleDate.getMonth() === today.getMonth()
    && scheduleDate.getFullYear() === today.getFullYear()
    && !!clockStore.bell?.isSchoolDay;
});

const currentOpeningTime = computed(() => getTimeInMs(currentTime.value.toDateString(), '07:30'));
const currentClosingTime = computed(() => getTimeInMs(currentTime.value.toDateString(), '17:30'));

const isOpen = computed(() => {
  return currentTimeMs.value >= currentOpeningTime.value
    && currentTimeMs.value <= currentClosingTime.value
    && !!clockStore.bell?.isSchoolDay;
});

const openingStatus = computed(() => {
  if (!clockStore.bell?.isSchoolDay) {
    return 'Closed Today';
  }

  return isOpen.value ? 'Open' : `Opens at ${formatTime(currentOpeningTime.value)}`;
});

const timeStatus = computed(() => {
  if (!clockStore.bell?.isSchoolDay) {
    return 'No school today';
  }

  if (currentTimeMs.value < currentOpeningTime.value) {
    return 'Closed until school day hours';
  }

  return 'Closed for today';
});

const countdownTime = computed(() => {
  const targetTime = isOpen.value ? currentClosingTime.value : currentOpeningTime.value;
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
  return new Date(`${dateString} ${timeString}`).getTime();
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
  padding: 0 8px 12px

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

.more-button
  display: block
  width: fit-content
  margin: 12px auto 0
  padding: 6px 16px
  border-radius: 999px
  border: 1px solid var(--accent)
  background: transparent
  color: var(--accent)
  cursor: pointer
  font: inherit

.details
  margin-top: 14px
  padding: 12px
  border-radius: 12px
  background: rgba(128, 128, 128, 0.08)
  font-size: 14px
  line-height: 1.45

.details-title
  margin: 0 0 10px
  font-weight: 700

.details ul
  margin: 0
  padding-left: 18px

.details li + li
  margin-top: 8px

.form-link
  display: inline-block
  margin-top: 14px
  color: var(--accent)
  font-weight: 600
</style>
