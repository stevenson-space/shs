<template>
  <card v-if="show">
    <!--would like to use v-show here instead of v-if however the card does not show correctly -->
    <div style="margin: 5px 5px">
    <div class="row">
      <div style="width:15px"></div>
      <div class="title">Hybrid Schedule</div>
      <what-is-this :showInfoIcon="true">
        Cycle Day {{ getCycleIndex() + 1 }}/12
      </what-is-this>
    </div>

      <div class="timeRow">
        <div>Morning</div>
        <div>Afternoon</div>
      </div>
      <div
        v-for="n in getHybridSchedule()"
        :key="n.color"
        class="row"
        v-show="n.atSHS[0] != n.atSHS[1]"
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
  </card>
</template>
<script>
import Card from "common/Card.vue";
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { mapState, mapGetters } from "vuex";
import WhatIsThis from "common/WhatIsThis.vue";

export default {
  components: { Card, FontAwesomeIcon, WhatIsThis },
  computed: {
    show: function () {
      return (
        this.bell.type == "Hybrid" &&
        this.date.getDay() != 3 &&
        this.bell.school &&
        this.getCycleIndex() >= 0
      );
    },
    ...mapGetters(["date", "bell"]),
  },
  methods: {
    getBusinessDateCount(startDate, endDate) {
      var count = 0;
      var curDate = startDate;
      while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if (!(dayOfWeek == 6 || dayOfWeek == 0 || dayOfWeek == 3)) count++;
        curDate.setDate(curDate.getDate() + 1);
      }
      return count;
    },
    getCycleIndex() {
      var calibration = { date: new Date("January 19, 2021"), cycleDay: 2 }; //calebration date and corresponding cyclic day (1-12)
      if (this.date < calibration.date) {
        return -1;
      }
      var cycleDaysSince = this.getBusinessDateCount(
        calibration.date,
        this.date
      );
      var cyclicDay = (cycleDaysSince - 1 + calibration.cycleDay - 1) % 12;
      console.log(cyclicDay);
      return cyclicDay;
    },
    getHybridSchedule() {
      var day = this.schedule[this.getCycleIndex()];
      var schedules = [];
      if (day.length == 2) {
        var morning = day.substring(0, 1);
        var afternoon = day.substring(1, 2);
        schedules.push({ color: morning, atSHS: [true, false] });
        schedules.push({ color: afternoon, atSHS: [false, true] });
      }
      return schedules;
    },
  },
  data() {
    return {
      colors: { Y: "#c99a2c", G: "#1f5d39", B: "#2471A3" },
      icons: {
        faArrowRight,
      },
      schedule: [
        //letter represents who goes on campus, 0th index is morning, 1st index is afternoon
        "YG",
        "BY",
        "GB",
        "YG",
        "BY",
        "GB",
        "YG",
        "BY",
        "GB",
        "YG",
        "BY",
        "GB",
      ],
    };
  },
};
</script>
<style lang="sass" scoped>
.title
  text-align: center
  font-size: 1.5em
  margin: 5px 0

.row
  border-radius: 40px
  display: flex
  align-items: center
  justify-content: space-between
  padding: 2px 3px
  margin: 3px 5px 7px 5px

.timeRow
  display: flex
  justify-content: space-between
  margin: 4px 7px

.directionChip
  margin: 2px 1px
  background: white
  border-radius: 25px
  font-size: 17px
  padding: 5px 8px

.arrow
  position: relative
  color: white
</style>
