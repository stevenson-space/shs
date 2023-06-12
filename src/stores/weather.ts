import { defineStore } from 'pinia';

export default defineStore('weather', {
  state: () => ({
    dailyData: null,
  }),
  actions: {
    async fetchWeatherData() {
      const currentDate = new Date();
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      function formatDate(date) {
        let month = String(date.getMonth() + 1);
        if (month.length === 1) {
          month = `0${month}`;
        }
        return `${date.getFullYear()}-${month}-${date.getDate()}`;
      }
      const startDate = formatDate(currentDate);
      const endDate = formatDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));

      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=42.26&longitude=-87.84&hourly=cloudcover&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&start_date=${startDate}&end_date=${endDate}&timezone=auto`);
        const data = await response.json();

        const dailyData = [];
        for (let i = 0; i < 7; i++) {
          const avgCloudCover = data.hourly.cloudcover.slice(i * 24, (i + 1) * 24).reduce((a, c) => a + c, 0) / 24;
          let idate = `${currentDate.getMonth() + 1}/${currentDate.getDate() + i}`;
          const daily = {
            date: idate,
            temp_high: data.daily.temperature_2m_max[i],
            temp_low: data.daily.temperature_2m_min[i],
            rain_percent: data.daily.precipitation_probability_max[i],
            cloudcover: avgCloudCover,
          };
          dailyData.push(daily);
        }

        this.dailyData = dailyData;
      } catch (error) {
        this.dailyData = 'noData';
      }
    },
  },
});
\
