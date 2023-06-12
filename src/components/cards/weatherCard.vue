<template>
  <card v-if="weatherData != 'noData'" class="card">
    <div class="title">{{ title }}</div>
    <div class="weather">
      <div v-for="weather in weatherData" :key="weather.date">
        <div class="info-container">
          <p class="info date">{{ weather.date }}</p>
          <div class="info condition">
            <font-awesome-icon
              class="condition-icon"
              :icon="faSun"
              v-if="weather.cloudcover < 50"
            />
            <font-awesome-icon
              class="condition-icon"
              :icon="faCloud"
              v-else
            />
            <p class="condition-text" v-if="weather.rain_percent>0">{{ weather.rain_percent }}%</p>
          </div>
          <p class="info temp">{{ weather.temp_low }}°F — {{ weather.temp_high }}°F</p>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import { faTint, faCloud, faSun } from '@fortawesome/free-solid-svg-icons';
import { mapState } from 'pinia';
import useWeatherStore from '@/stores/weather';
import Card from '@/components/Card.vue';

export default {
  components: { Card },
  props: {
    title: { type: String, default: 'Weather' },
  },
  data() {
    return {
      icons: { faCloud, faTint, faSun },
    };
  },
  computed: {
    ...mapState('weather', ['dailyData']),
  },
  methods: {
    getWeatherIcon(condition) {
      const iconNames = { Sunny: faSun, Cloudy: faCloud, Rainy: faTint };
      return iconNames[condition];
    },
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

  .weather
    margin-top: 10px

    .info-container
      display: flex
      align-items: center
      border-top: 2px solid var(--color)
      height: 55px

      .info
        padding: 0

      .date
        position: absolute
        left:15%

      .temp
        position: absolute
        left:65%

      .condition
        position: absolute
        left:50%
        transform: translate(-50%, 0)
        display: grid
        place-items: center

        .condition-icon
          font-size: 1.5em
          color: var(--color)
          margin: 1px 0

        .condition-text
          font-size: 2vh
          margin: 1px 0
</style>
