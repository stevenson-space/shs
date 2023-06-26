<template>
  <card v-if="weatherData != null" class="card">
    <div class="title">{{ title }}</div>
    <div class="weather">
      <div v-for="weather in weatherData" :key="weather.date">
        <div class="info-container">
          <p class="info date">{{ weather.date }}</p>
          <div class="info condition">
            <font-awesome-icon
              class="condition-icon"
              :icon="icons.faSun"
              v-if="weather.cloudcover < 40"
            />
            <div v-else-if="weather.cloudcover < 60" class="condition-icon">
              <font-awesome-icon
              class="partly-sun"
              :icon="icons.faSun"
              />
              <font-awesome-icon
              class="partly-cloud"
              :icon="icons.faCloud"
              />
            </div>
            <font-awesome-icon
              class="condition-icon"
              :icon="icons.faCloud"
              v-else
            />
            <div class="condition-rain" v-if="weather.rain_percent > 30">
              <font-awesome-icon
                :icon="icons.faTint"
                class="rain-icon"
              />
              <p class="rain-text">{{ weather.rain_percent }}%</p>
            </div>
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
import Card from '@/components/Card.vue';

export default {
  components: { Card },
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
    let currentDate = new Date();
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
    const endDate = formatDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    currentDate = new Date();

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=42.26&longitude=-87.84&hourly=cloudcover&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&start_date=${startDate}&end_date=${endDate}&timezone=auto`)
      .then((response) => response.json())
      .then((data) => {
        const dailyData = [];
        for (let i = 0; i < 7; i++) {
          const avgCloudCover = data.hourly.cloudcover.slice(i * 24, (i + 1) * 24).reduce((a, c) => a + c, 0) / 24;
          const idate = `${currentDate.getMonth() + 1}/${currentDate.getDate() + i}`;
          const daily = {
            date: idate,
            temp_high: data.daily.temperature_2m_max[i],
            temp_low: data.daily.temperature_2m_min[i],
            rain_percent: data.daily.precipitation_probability_max[i],
            cloudcover: avgCloudCover,
          };
          dailyData.push(daily);
        }
        console.log(dailyData)
        this.weatherData = dailyData;
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
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
        font-size: 1em
        position: absolute
        left:10%

      .temp
        font-size: 1em
        position: absolute
        left:55%

      .condition
        position: absolute
        left:40%
        transform: translate(-50%, 0)
        display: grid
        place-items: center

        .condition-icon
          font-size: 1.5em
          color: var(--color)
          margin: 1px 0

          .partly-sun
            position: absolute
            font-size: 0.9em
            left: 42%
            top: 8%

          .partly-cloud
            font-size: 0.9em

        .condition-rain
          margin: 0
          display: flex
          align-items: center

          .rain-icon
            margin: 1px 2px
            font-size: 0.75em

          .rain-text
            margin: 1px 2px
            font-size: 0.75em
</style>
