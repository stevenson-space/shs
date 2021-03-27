<template>
  <card v-if="show">
    <!--would like to use v-show here instead of v-if however the card does not show correctly -->
    <div class="container">
      <div class="title">Hybrid Schedule</div>

      <div class="timeRow">
        <div>Morning</div>
        <div>Afternoon</div>
      </div>

      <div style="padding-bottom: 3px">
        <div
          v-for="n in getHybridSchedule()"
          v-show="n.atSHS[0] !== n.atSHS[1]"
          :key="n.color"
          class="row"
          :style="{
            background: colors[n.color],
          }"
        >
          <div class="directionChip">
            {{ n.atSHS[0] ? "SHS" : "Home" }}
          </div>
          <font-awesome-icon
            class="arrow"
            :style="{ left: n.atSHS[0] ? '8px' : '-8px' }"
            :icon="icons.faArrowRight"
          />
          <div class="directionChip">
            {{ n.atSHS[1] ? "SHS" : "Home" }}
          </div>
        </div>
      </div>
    </div>
  </card>
</template>
<script>
import Card from "common/Card.vue";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { mapGetters } from "vuex";

export default {
  components: { Card, FontAwesomeIcon },
  data() {
    return {
      colors: { Y: "#c99a2c", G: "#1f5d39", B: "#2471A3" },
      icons: {
        faArrowRight,
      },
    };
  },
  computed: {
    // letter represents who goes on campus, 0th index is morning, 1st index is afternoon
    schedule() {
      return [
       "GB",
       "BG"
      ];
    },
    show() {
      return (
        this.bell.type === "Patriot Hybrid" &&
        this.bell.school &&
        this.getCycleIndex() >= 0
      );
    },
    ...mapGetters(["date", "bell"]),
  },
  methods: {
    getBusinessDateCount(startDate, endDate) {
      let count = 0;
      const curDate = startDate;
      while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();

        const dd = curDate.getDate(); //temp
        const mm = curDate.getMonth(); //temp
        if (
          !(dd == 16 && mm == 1) &&
          (!(dayOfWeek === 6 || dayOfWeek === 0 || dayOfWeek === 3) ||
            (dd == 20 && mm == 0) ||
            (dd == 17 && mm == 1) ||  (dd == 31 && mm == 2))
        )
          count++; //TEMP: these are edge cases for the schedule
        // if (!(dayOfWeek === 6 || dayOfWeek === 0 || dayOfWeek === 3)) count++;
        curDate.setDate(curDate.getDate() + 1);
      }
      return count;
    },
    getCycleIndex() {
      const calibration = { date: new Date("March 2, 2021"), cycleDay: 1 };
      if (this.date < calibration.date) {
        return -1;
      }
      const cycleDaysSince = this.getBusinessDateCount(
        calibration.date,
        this.date
      );
      const cyclicDay = (cycleDaysSince - 1 + calibration.cycleDay - 1) % 2;
      return cyclicDay;
    },
    getHybridSchedule() {
      const day = this.schedule[this.getCycleIndex()];
      const schedules = [];
      if (day.length === 2) {
        const morning = day.substring(0, 1);
        const afternoon = day.substring(1, 2);
        schedules.push({ color: morning, atSHS: [true, false] });
        schedules.push({ color: afternoon, atSHS: [false, true] });
      }
      return schedules;
    },
  },
};
</script>

<style lang="sass" scoped>
.container
  margin: 5px 5px

.title
  text-align: center
  font-size: 1.5em
  margin: 10px 0

.row
  border-radius: 40px
  display: flex
  align-items: center
  justify-content: space-between
  padding: 2px 3px
  margin: 5px 6px 3px 6px

.timeRow
  display: flex
  justify-content: space-between
  margin: 4px 7px

.directionChip
  margin: 2px 1px
  background: white
  border-radius: 25px
  font-size: 17px
  padding: 3px 8px

.arrow
  position: relative
  color: white
</style>
