<template>
    <card v-if="showPWCSchedule" class="card">
        <p class="title">PWC Hours</p>
        <div class="green-line"></div>
        <div class="countdown">
            <p>{{ openingStatus }}</p>
            <p class="time-text">{{ timeStatus }}</p>
        </div>
    </card>
</template>

<script>
import { mapState } from 'pinia';
import Card from '@/components/Card.vue';
import useUserSettingsStore from '@/stores/user-settings';

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
      
    };
  },
  computed: {
    ...mapState(useUserSettingsStore, ['showPWCSchedule']),
    currentTime() {
      return new Date(this.currentTimeMs);
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
      if (this.currentTime < this.currentOpeningTime) {
        const openingTime = this.openingTimes.find(
          (time) => time.day === this.currentDay,
        );
        return this.getTimeInMs(
          this.getNextDate(this.currentDay),
          openingTime.start,
        );
      }
      const nextDay = (this.currentDay + 1) % 7;
      const openingTime = this.openingTimes.find(
        (time) => time.day === nextDay,
      );
      return this.getTimeInMs(this.getNextDate(nextDay), openingTime.start);
    },
    isOpen() {
      return (
        this.currentTime >= this.currentOpeningTime
                    && this.currentTime <= this.currentClosingTime
      );
    },
    openingStatus() {
      return this.isOpen ? 'Open' : `Opens at ${this.formatTime(this.nextOpeningTime)}`;
    },
    timeStatus() {
      return this.isOpen ? 'Closes' : 'Closed';
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
  color: #333

.green-line
  width: 100%
  height: 1px
  background-color: var(--color)
  margin-bottom: 10px

</style>
