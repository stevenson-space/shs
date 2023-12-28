<template>
  <card v-if="weatherData" class="card">
    <div class="title">{{ title }}</div>
    <div class="weather">
      <div v-for="weather in weatherData" :key="weather.day">
        <div class="info-container">
          <p class="info date">{{ weather.day }}</p>
          <div class="info condition">
         
            <svg  v-if="weather.cloudcover > 70 && weather.rain_percent < 40" class="condition-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M400 240c-8.89-89.54-71-144-144-144-69 0-113.44 48.2-128 96-60 6-112 43.59-112 112 0 66 54 112 120 112h260c55 0 100-27.44 100-88 0-59.82-53-85.76-96-88z" fill="none" :stroke="color" stroke-linejoin="round" stroke-width="32"/></svg>
            <svg  v-else-if="weather.cloudcover > 70 && weather.rain_percent >= 40"  class="condition-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M114.61 162.85A16.07 16.07 0 00128 149.6C140.09 76.17 193.63 32 256 32c57.93 0 96.62 37.75 112.2 77.74a15.84 15.84 0 0012.2 9.87c50 8.15 91.6 41.54 91.6 99.59 0 59.4-48.6 100.8-108 100.8H130c-49.5 0-90-24.7-90-79.2 0-48.47 38.67-72.22 74.61-77.95z" fill="none" :stroke="color" stroke-linejoin="round" stroke-width="32"/><path fill="none" :stroke="color" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M144 384l-32 48M224 384l-64 96M304 384l-32 48M384 384l-64 96"/></svg>
            <svg  v-else-if="weather.cloudcover > 30 && weather.rain_percent < 40" class="condition-icon" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path d="M90.61 306.85A16.07 16.07 0 00104 293.6C116.09 220.17 169.63 176 232 176c57.93 0 96.62 37.75 112.2 77.74a15.84 15.84 0 0012.2 9.87c50 8.15 91.6 41.54 91.6 99.59 0 59.4-48.6 100.8-108 100.8H106c-49.5 0-90-24.7-90-79.2 0-48.47 38.67-72.22 74.61-77.95z" fill="none" :stroke="color" stroke-linejoin="round" stroke-width="32"/><path d="M384.8 271.4a80 80 0 10-123.55-92M464 208h32M336 48v32M222.86 94.86l22.63 22.63M449.14 94.86l-22.63 22.63" fill="none" :stroke="color" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
            <svg  v-else-if="weather.cloudcover > 30 && weather.rain_percent >= 40" class="condition-icon partly-rainy" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="770" height="770" viewBox="0 0 770 770">
            <defs>
              <clipPath id="clip-partly-rainy">
                <rect width="770" height="770"/>
              </clipPath>
            </defs>
            <g id="partly-rainy" clip-path="url(#clip-partly-rainy)">
              <g id="rainy-outline" transform="translate(83.668 167.541)">
                <path id="Path_1" data-name="Path 1" d="M114.61,162.85A16.07,16.07,0,0,0,128,149.6C140.09,76.17,193.63,32,256,32c57.93,0,96.62,37.75,112.2,77.74a15.84,15.84,0,0,0,12.2,9.87c50,8.15,91.6,41.54,91.6,99.59C472,278.6,423.4,320,364,320H130c-49.5,0-90-24.7-90-79.2C40,192.33,78.67,168.58,114.61,162.85Z" fill="none" :stroke="color" stroke-linejoin="round" stroke-width="32"/>
                <path id="Path_2" data-name="Path 2" d="M144,384l-32,48m112-48-64,96m144-96-32,48m112-48-64,96" fill="none" :stroke="color" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
              </g>
              <g id="sunny-outline_1_" data-name="sunny-outline (1)" transform="translate(444.168 74.459)">
                <path id="Path_3" data-name="Path 3" d="M125.082,48V65.788m0,118.587v17.788M179.587,70.576,167.01,83.154M83.154,167.01,70.576,179.588m131.588-54.506H184.375m-118.587,0H48m131.587,54.506L167.01,167.01M83.154,83.154,70.576,70.576" fill="none" :stroke="color" stroke-linecap="round" stroke-miterlimit="10" stroke-width="22"/>
                <circle id="Ellipse_1" data-name="Ellipse 1" cx="30" cy="30" r="30" transform="translate(95.082 95.082)" fill="none" :stroke="color" stroke-linecap="round" stroke-miterlimit="10" stroke-width="22"/>
              </g>
            </g>
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" class="condition-icon"  viewBox="0 0 512 512"><path fill="currentColor" :stroke="color" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M256 48v48M256 416v48M403.08 108.92l-33.94 33.94M142.86 369.14l-33.94 33.94M464 256h-48M96 256H48M403.08 403.08l-33.94-33.94M142.86 142.86l-33.94-33.94"/><circle cx="256" cy="256" r="80" fill="none" :stroke="color" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32"/></svg>
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
  </card>
</template>

<script>
import { mapState } from 'pinia';
import useThemeStore from '@/stores/themes';
import Card from '@/components/Card.vue';

export default {
  components: { Card },
  props: {
    title: { type: String, default: 'Weather' },
  },
  computed: {
    ...mapState(useThemeStore, ['color']),
  },
  data() {
    return {
      weatherData: null,
    };
  },
  mounted() {
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
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=42.26&longitude=-87.84&hourly=cloudcover&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&start_date=${startDate}&end_date=${endDate}&timezone=auto`)
        .then((response) => response.json())
        .then((data) => {
          const dailyData = [];
          for (let i = 0; i < 5; i++) {
            const avgCloudCover = data.hourly.cloudcover.slice(i * 24, (i + 1) * 24).reduce((a, c) => a + c, 0) / 24;
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let dayOfWeek = 'Today';
            if (i !== 0) {
              dayOfWeek = days[(currentDate.getDay() + i) % 7];
            }
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
        left: 85%
        transform: translate(-50%, 0)
        display: grid
        place-items: center

        .condition-icon
          width: 30px
        .partly-rainy
          width: 40px 
          position: relative
          left: 1px

  .attribution
    font-size: 0.5em
    text-align: center
    color: var(--color)

      </style>
