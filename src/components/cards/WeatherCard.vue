<template>
  <card v-if="weatherData" class="card">
    <div class="title">{{ title }}</div>
    <div class="weather">
      <div v-for="weather in weatherData" :key="weather.day">
        <div class="info-container">
          <p class="info date">{{ weather.day }}</p>
          <div class="info condition">
            <Cloudy class="condition-icon" v-if="weather.cloudcover > 70 && weather.rain_percent < 40" />
            <Rainy class="condition-icon" v-else-if="weather.cloudcover > 70 && weather.rain_percent >= 40" />
            <div class="condition-icon" v-else-if="weather.cloudcover > 30 && weather.rain_percent < 40" >
              <Sunny class="partly-sun" />
              <Cloudy class="partly-cloudy" />
            </div>
            <div class="condition-icon" v-else-if="weather.cloudcover > 30 && weather.rain_percent >= 40" >
              <Sunny class="partly-sun" />
              <Rainy class="partly-rainy" />
            </div>
            <Sunny class="condition-icon" v-else/>
          </div>
          <div class="info temp">
            <p class="temp-high">{{ weather.temp_high }}°</p>
            <p class="temp-low">{{ weather.temp_low }}°</p>
          </div>
        </div>
      </div>
    </div>
    <a class="attribution-link" href="https://open-meteo.com/">
      <div class="attribution">Weather data by Open-Meteo.com</div>
    </a>
    <CloudIcon />
  </card>
</template>

<script>
import { faTint, faCloud, faSun } from '@fortawesome/free-solid-svg-icons';
import { mapState } from 'pinia';
import Cloudy from 'vue-ionicons/dist/ios-cloudy.vue';
import Rainy from 'vue-ionicons/dist/ios-rainy.vue';
import Sunny from 'vue-ionicons/dist/ios-sunny.vue';
import Card from '@/components/Card.vue';

export default {
  components: { Card, Cloudy, Rainy, Sunny },
  props: {
    title: { type: String, default: 'Weather' },
  },
  data() {
    return {
      icons: { faCloud, faTint, faSun },
      weatherData: null,
    };
  },
  mounted() {
    // localStorage.getItem('weatherDataCache')
    const cacheKey = 'weatherDataCache';

    let cacheData = localStorage.getItem(cacheKey);
    if (cacheData) {
      cacheData = JSON.parse(cacheData);
      const currentTime = new Date().getTime();
      const sixHours = 6 * 60 * 60 * 1000;
      if (currentTime - cacheData.timestamp < sixHours) {
        this.weatherData = cacheData.dailyData;
      } else {
        this.fetchWeatherData(cacheKey);
      }
    } else {
      this.fetchWeatherData(cacheKey);
    }
  },
  methods: {
    fetchWeatherData(cacheKey) {
      let currentDate = new Date();
      /**
       * Format the date in the specified format.
       * @param {Date} date - The date to format.
       * @returns {string} The formatted date string.
       */
      function formatDate(date) {
        let month = String(date.getMonth() + 1);
        if (month.length === 1) {
          month = `0${month}`;
        }
        let day = String(date.getDate());
        if (day.length === 1) {
          day = `0${day}`;
        }
        return `${date.getFullYear()}-${month}-${day}`;
      }
      const startDate = formatDate(currentDate);
      const endDate = formatDate(new Date(currentDate.setDate(currentDate.getDate() + 5)));
      currentDate = new Date();
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=42.26&longitude=-87.84&hourly=cloudcover&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&start_date=${startDate}&end_date=${endDate}&timezone=auto`)
        .then((response) => response.json())
        .then((data) => {
          const dailyData = [];
          for (let i = 0; i < 5; i++) {
            const avgCloudCover = data.hourly.cloudcover.slice(i * 24, (i + 1) * 24).reduce((a, c) => a + c, 0) / 24;
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfWeek = days[(currentDate.getDay() + i) % 7];
            const daily = {
              day: dayOfWeek,
              temp_high: Math.round(data.daily.temperature_2m_max[i]),
              temp_low: Math.round(data.daily.temperature_2m_min[i]),
              rain_percent: data.daily.precipitation_probability_max[i],
              cloudcover: avgCloudCover,
            };
            dailyData.push(daily);
          }
          this.weatherData = dailyData;
          const cachedData = { timestamp: currentDate.getTime(), dailyData };
          localStorage.setItem(cacheKey, JSON.stringify(cachedData));
        });
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
      border-top: 1px solid var(--color)
      height: 55px

      .info
        padding: 0

      .date
        font-size: 1em
        position: absolute
        left:18%

      .temp
        position: absolute
        left:60%
        text-align: center

        .temp-high
          font-size: 1em
          margin: 0

        .temp-low
          font-size: 0.7em
          opacity: 52%
          margin: 0

      .condition
        position: absolute
        left: 78%
        transform: translate(-50%, 0)
        display: grid
        place-items: center

        .condition-icon
          font-size: 2em
          color: var(--color)
          margin: 0.5px 0
          position: absolute
          top:-15px

          .partly-cloudy,
          .partly-rainy
            font-size: 1em

          .partly-sun
            font-size: 0.8em
            position: absolute
            left: 35%
            bottom: 45%

  .attribution
    font-size: 0.5em
    text-align: center
    color: var(--color)
</style>
