<template>
  <card v-show="showCard">
    <div class="container">
      <div class="message">
        <br>
          <h3 style="margin-bottom: 0px">{{ message ?? `Countdown to ${untilDate}` }}</h3>
        <br>
      </div>
      <div class="time">
        <div v-for="(time, name) in timeLeft" :key="name" class="inner">
          <div class="number">{{ time }}</div>
          <p class="unit">{{ time === '01' ? name.slice(0, -1) : time === '00' ? name : name }}</p>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import Card from '@/components/Card.vue';

export default {
  components: { Card },
  props: {
    untilDate: { type: String, required: true }, // example "May 22, 2021"
    message: { type: String, required: false },
  },
  data() {
    return {
      formattedUntilDate: new Date(this.untilDate),
      timeLeft: {
        days: '00',
        hours: '00',
        minutes: '00',
      },
    };
  },
  mounted() {
    setInterval(() => {
      this.getTimeLeft();
    }, 1000);
  },
  methods: {
    getTimeLeft() {
      const goalTime = this.formattedUntilDate.getTime();
      const now = new Date().getTime();
      const diff = goalTime - now;

      // diff is in milliseconds, so we need to do a little math to get the days, hours, and minutes
      const daysLeft = Math.floor(diff / 86400000);
      const hoursLeft = Math.floor((diff % 86400000) / 3600000);
      const minutesLeft = Math.floor((diff % 3600000) / 60000);

      // basic formatting to make sure the numbers are always two digits
      this.timeLeft.days = daysLeft < 10 ? `0${daysLeft}` : `${daysLeft}`;
      this.timeLeft.hours = hoursLeft < 10 ? `0${hoursLeft}` : `${hoursLeft}`;
      this.timeLeft.minutes = minutesLeft < 10 ? `0${minutesLeft}` : `${minutesLeft}`;
    },
  },
  computed: {
    showCard() {
      const today = new Date().getTime();
      return today < this.formattedUntilDate.getTime();
    },
  },
};
</script>

<style lang="sass" scoped>
a
  color: var(--color)
.container
  display: flex
  align-items: center
  text-decoration: none
  justify-content: center
  flex-direction: column
  color: var(--primary)
  padding-botton: 20px
  .message
    font-size: .85em
    text-align: left
    text-align: center
  .time
    display: flex
    .inner
      display: flex
      margin-left: 10px
      padding-bottom: 20px
      .number
        font-size: 2em
        font-weight: 600
        margin: 0 5px
        color: var(--color)
        background-color: rgba(var(--color), 100)
</style>
