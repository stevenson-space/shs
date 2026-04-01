<template>
  <card v-if="showIlcCard" ref="cardRef" class="card">
    <p class="title">Upper ILC</p>
    <div class="green-line" />

    <div class="countdown">
      <p>{{ isOpen ? countdownTime : openingStatus }}</p>
      <p class="time-text">{{ isOpen ? 'Time remaining until closure' : timeStatus }}</p>
    </div>

    <collapsible-section
      v-model="isExpanded"
      :title="isExpanded ? 'Less' : 'More'"
      class="ilc-collapsible"
    >
      <div class="expanded-content">
        <a
          class="reserve-link"
          href="https://docs.google.com/forms/d/e/1FAIpQLSfuUtBcvAd9fV4N3hMXQ3jjVmvL54EA5eBg_jCKa205IcCwEA/viewform"
          target="_blank"
          rel="noopener noreferrer"
        >
          Reserve an Upper ILC study room
        </a>

        <p class="rules-title">Regulations for using Upper ILC study rooms:</p>
        <ol class="rules-list">
          <li>Every student must check in at the main desk before using a room.</li>
          <li>Food is not allowed inside study rooms.</li>
          <li>Occupancy is limited to available seats, with a maximum of 6 students per room.</li>
          <li>Each student may use study rooms up to 3 times in a 2-week period.</li>
          <li>Online reservations must be submitted at least 24 hours in advance (excluding weekends and school holidays).</li>
          <li>Unreserved rooms are first-come, first-served, and still require main desk check-in.</li>
          <li>If you are over 20 minutes late, your reservation may be released.</li>
        </ol>
      </div>
    </collapsible-section>
  </card>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import Bell from '@/utils/bell';
import Card from '@/components/Card.vue';
import CollapsibleSection from '@/components/CollapsibleSection.vue';
import useClockStore from '@/stores/clock';
import useScheduleStore from '@/stores/schedules';

type IlcHours = {
  start: string;
  end: string;
};

const STANDARD_HOURS: IlcHours = { start: '7:00', end: '18:30' };
const LATE_ARRIVAL_HOURS: IlcHours = { start: '10:30', end: '17:30' };
const EARLY_DISMISSAL_HOURS: IlcHours = { start: '7:00', end: '17:30' };
const FINAL_DAY_EARLY_DISMISSAL_HOURS: IlcHours = { start: '7:00', end: '12:30' };

const clockStore = useClockStore();
const scheduleStore = useScheduleStore();
const isExpanded = ref(false);
const cardRef = useTemplateRef<{ setHeight: () => void }>('cardRef');

const currentTimeMs = computed(() => clockStore.currentTime);
const currentTime = computed(() => new Date(currentTimeMs.value));

const currentBell = computed(() => clockStore.bell);

const isFinalEarlyDismissalDay = computed(() => {
  if (currentBell.value?.type !== 'Early Dismissal Day') {
    return false;
  }

  const nextBell = new Bell(
    currentBell.value.nextSchoolDay,
    scheduleStore.schedules,
    scheduleStore.scheduleMode,
  );

  return nextBell.type !== 'Early Dismissal Day';
});

function getIlcHours(scheduleType = '', isFinalDay = false): IlcHours {
  if (scheduleType === 'Late Arrival') {
    return LATE_ARRIVAL_HOURS;
  }

  if (scheduleType === 'Early Dismissal') {
    return EARLY_DISMISSAL_HOURS;
  }

  if (scheduleType === 'Early Dismissal Day' || scheduleType === 'Extra Early Dismissal') {
    return isFinalDay ? FINAL_DAY_EARLY_DISMISSAL_HOURS : EARLY_DISMISSAL_HOURS;
  }

  return STANDARD_HOURS;
}

function getTimeInMs(date: Date, time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  const dateWithTime = new Date(date);
  dateWithTime.setHours(hours, minutes, 0, 0);
  return dateWithTime.getTime();
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

function setCardHeight(): void {
  cardRef.value?.setHeight();
}

watch(isExpanded, () => {
  // Keep masonry layout in sync while the collapsible enters/leaves.
  nextTick(() => {
    setCardHeight();
    setTimeout(setCardHeight, 320);
  });
});

const todayHours = computed(() => getIlcHours(currentBell.value?.type, isFinalEarlyDismissalDay.value));

const currentOpeningTime = computed(() =>
  getTimeInMs(currentTime.value, todayHours.value.start));

const currentClosingTime = computed(() =>
  getTimeInMs(currentTime.value, todayHours.value.end));

const nextOpeningTime = computed(() => {
  if (currentTimeMs.value < currentOpeningTime.value) {
    return currentOpeningTime.value;
  }

  const nextSchoolDay = currentBell.value?.nextSchoolDay
    ? new Date(currentBell.value.nextSchoolDay)
    : new Date(currentTime.value.getTime() + 24 * 60 * 60 * 1000);

  const nextBell = new Bell(
    nextSchoolDay,
    scheduleStore.schedules,
    scheduleStore.scheduleMode,
  );

  const nextDayHours = getIlcHours(nextBell.type);
  return getTimeInMs(nextSchoolDay, nextDayHours.start);
});

const isOpen = computed(() =>
  currentTimeMs.value >= currentOpeningTime.value && currentTimeMs.value <= currentClosingTime.value);

const openingStatus = computed(() =>
  isOpen.value ? 'Open' : `Opens at ${formatTime(nextOpeningTime.value)}`);

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

const showIlcCard = computed(() => {
  const bell = currentBell.value;
  const schoolDay = bell?.isSchoolDay && bell.type !== 'Summer';

  const scheduleDate = new Date(clockStore.date);
  const today = currentTime.value;
  const isToday = scheduleDate.getDate() === today.getDate()
    && scheduleDate.getMonth() === today.getMonth()
    && scheduleDate.getFullYear() === today.getFullYear();

  return schoolDay && isToday;
});
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.card
  padding: 0 8px 10px

.title
  margin: 15px 0
  text-align: center
  font-size: 20px

.countdown
  margin-top: 10px
  text-align: center
  font-size: 20px

.countdown p
  margin: 5px 0
  text-align: center

.time-text
  color: var(--accent)
  font-size: 15px

.green-line
  width: 100%
  height: 1px
  margin-bottom: 10px
  background-color: var(--accent)

.ilc-collapsible
  margin-top: 10px

  :deep(.group-title)
    color: var(--accent)
    font-weight: 600

.expanded-content
  padding-top: 2px
  text-align: left

.reserve-link
  display: inline-block
  margin-bottom: 10px
  color: var(--accent)
  font-weight: 700

.rules-title
  margin: 0 0 8px
  font-weight: 700

.rules-list
  margin: 0
  padding-left: 18px
  font-size: .93rem
  line-height: 1.35rem
</style>
