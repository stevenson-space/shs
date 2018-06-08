<template>
  <div>
    <schedule-header :color="color" logo="images/patriot.png" :date="date"/>
    <card-container>
      <card></card>
      <card></card>
      <card></card>
      <card></card>
      <card></card>
      <card></card>
      <card></card>
      <card></card>
    </card-container>
  </div>
</template>

<script>
import ScheduleHeader from '../components/Header.vue';
import CardContainer from '../components/CardContainer.vue';
import Card from '../components/Card.vue' //basic card for testing purposes

export default {
  data() {
    return {
      initialDate: Date.now(), // relative to url specified date (set in created())
      startDate: Date.now(), // relative to real time
      currentDate: Date.now(), // relative to real time
      color: '#000000',
    };
  },
  created() {
    const { date, time } = this.$route.query;
    const today = new Date();
    const todayDate = today.toLocaleDateString();
    const todayTime = today.toLocaleTimeString();
    this.initialDate = new Date(`${date || todayDate} ${time || todayTime}`).getTime();
  },
  computed: {
    mode() {
      // in 'current' mode, everything is configured as if the specified date is current (ex. countdown shown)
      // in 'day' mode, only details about that date are displayed (ex. calendar events, lunch)
      // if 'date' url parameter is specified, 'day' mode is triggered
      // the 'time' url parameter is to be used for testing and always sets mode to 'current'
      const { date, time } = this.$route.query;
      return (!date || time) ? 'current' : 'day';
    },
    date() {
      const { initialDate, startDate, currentDate } = this;
      return new Date(initialDate + (currentDate - startDate));
    }
  },
  components: { ScheduleHeader, CardContainer, Card},
}
</script>

<style lang="sass" scoped>
  
</style>
