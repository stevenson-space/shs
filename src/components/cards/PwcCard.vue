<template>
    <card v-if="showPWCSchedule && showPWCCard" class="card">
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

<script>
import { mapState } from 'pinia';
import Card from '@/components/Card.vue';
import useUserSettingsStore from '@/stores/user-settings';
import useScheduleStore from '@/stores/schedules';

export default {
  components: { Card },
  data() {
    return {
      openingTimes: [
        { day: 1, start: '15:30', end: '20:00' }, // Monday
        { day: 2, start: '15:30', end: '20:00' }, // Tuesday
        { day: 3, start: '15:30', end: '20:00' }, // Wednesday
        { day: 4, start: '15:30', end: '20:00' }, // Thursday
        { day: 5, start: '15:30', end: '18:00' }, // Friday
        { day: 6, start: '10:00', end: '15:00' }, // Saturday
        { day: 0, start: '10:00', end: '15:00' }, // Sunday
      ],
      closedDays: [
        // Add dates in 'YYYY-MM-DD' format for holidays or special closures
        '2023-10-09',
        '2023-11-22',
        '2023-11-23',
        '2023-11-24',
        '2023-12-22',
        '2023-12-25',
        '2023-12-26',
        '2023-12-27',
        '2023-12-28',
        '2023-12-29',
      ],
      currentTimeMs: 0,
    };
  },
  computed: {
    ...mapState(useScheduleStore, ['date']),
    ...mapState(useUserSettingsStore, ['showPWCSchedule']),
    currentTime() {
      return new Date(this.currentTimeMs);
    },
    showPWCCard() {
      const scheduleDate = new Date(this.date);
      const today = new Date();
      return scheduleDate.getDate() === today.getDate() &&
              scheduleDate.getMonth() === today.getMonth() &&
              scheduleDate.getFullYear() === today.getFullYear();
    },
    currentDay() {
      return this.currentTime.getDay();
    },
    currentOpeningTime() {
      const openingTime = this.openingTimes.find(
        (time) => time.day === this.currentDay,
      );
      return this.getTimeInMs(
        this.currentTime.toDateString(),
        openingTime.start,
      );
    },
    currentClosingTime() {
      const closingTime = this.openingTimes.find(
        (time) => time.day === this.currentDay,
      );
      return this.getTimeInMs(
        this.currentTime.toDateString(),
        closingTime.end,
      );
    },
    nextOpeningTime() {
      const currentDate = this.currentTime.toISOString().substr(0, 10);
      if (this.currentTime < this.currentOpeningTime) {
        const openingTime = this.openingTimes.find((time) => time.day === this.currentDay);
        return this.getTimeInMs(currentDate, openingTime.start);
      }

      let nextDay = (this.currentDay + 1) % 7;
      while (this.closedDays.includes(this.getTimeInMs(this.getNextDate(nextDay), ''))) {
        nextDay = (nextDay + 1) % 7;
      }
      const openingTime = this.openingTimes.find((time) => time.day === nextDay);
      return this.getTimeInMs(currentDate, openingTime.start);
    },
    isOpen() {
      const isClosedDay = this.closedDays.includes(this.currentTime.toISOString().substr(0, 10));
      if (isClosedDay) {
        return false;
      }

      return (
        this.currentTime >= this.currentOpeningTime && this.currentTime <= this.currentClosingTime
      );
    },
    openingStatus() {
      if (this.closedDays.includes(this.currentTime.toISOString().substr(0, 10))) {
        return 'Closed Today';
      }

      return this.isOpen ? 'Open' : `Opens at ${this.formatTime(this.nextOpeningTime)}`;
    },
    timeStatus() {
      return this.isOpen ? 'Closes' : 'Closed';
    },
    countdownTime() {
      const targetTime = this.isOpen? this.currentClosingTime : this.nextOpeningTime;
      const timeDiff = targetTime - this.currentTimeMs;
      if (timeDiff <= 0) {
        return '00:00:00';
      }
      const hours = String(Math.floor(timeDiff / (1000 * 60 * 60))).padStart(2, '0');
      const minutes = String(Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      const seconds = String(Math.floor((timeDiff % (1000 * 60)) / 1000)).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    },
  },
  methods: {
    getTimeInMs(dateString, timeString) {
      const dateTimeString = `${dateString} ${timeString}`;
      return new Date(dateTimeString).getTime();
    },
    getNextDate(day) {
      const today = this.currentTime.getDay();
      const difference = (day - today + 7) % 7;
      const nextDate = new Date(this.currentTime);
      nextDate.setDate(this.currentTime.getDate() + difference);
      return nextDate.toDateString();
    },
    formatTime(timeInMs) {
      const date = new Date(timeInMs);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const period = hours >= 12 ? 'pm' : 'am';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = String(minutes).padStart(2, '0');
      return `${formattedHours}:${formattedMinutes} ${period}`;
    },
    updateCurrentTime() {
      this.currentTimeMs = Date.now();
    },
  },
  created() {
    // Initialize countdown immediately
    this.updateCurrentTime();

    // Update currentTime every second
    this.timer = setInterval(() => {
      this.updateCurrentTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

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
  color: var(--color)

.green-line
  width: 100%
  height: 1px
  background-color: var(--color)
  margin-bottom: 10px
</style>