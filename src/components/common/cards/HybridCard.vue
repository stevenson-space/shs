<template>
  <card v-if="show">
    <!--would like to use v-show here instead of v-if however the card does not show correctly -->
      <div style="margin: 5px 5px">
        <!-- <div class="">Cycle Day {{ getCycleIndex()+1 }}/12</div> -->
        <div class="row">
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

export default {
  components: { Card, FontAwesomeIcon },
  computed: {
    show: function () {
       return this.bell.school &&
        this.bell.schedule.name == "Hybrid" &&
        this.getCycleIndex() >= 0;
       ;
    },
    ...mapGetters(["date", "bell"]),
  },
  methods: {
    getBusinessDateCount(startDate, endDate) {
      var count = 0;
      var curDate = startDate;
      while (curDate <= endDate) {
        var dayOfWeek = curDate.getDay();
        if (!(dayOfWeek == 6 || dayOfWeek == 0)) count++;
        curDate.setDate(curDate.getDate() + 1);
      }
      return count;
    },
    getCycleIndex() {
      var calibration = { date: new Date("January 19, 2021"), cycleDay: 1 }; //calebration date and corresponding cyclic day (1-12)
      var cycleDaysSince = this.getBusinessDateCount(
        calibration.date,
        this.date
      );
      var cyclicDay = ((cycleDaysSince - 1) % 12) + (calibration.cycleDay - 1);
      return cyclicDay;
    },
    getHybridSchedule() {
      var day = this.schedule[this.getCycleIndex()];
      var schedules = [];
      if (day.length == 2) {
        var morning = day.substring(0, 1);
        var afternoon = day.substring(1, 2);
        var allEL = !day.includes("Y") ? "Y" : !day.includes("G") ? "G" : "B";
        schedules.push({ color: morning, atSHS: [true, false] });
        schedules.push({ color: afternoon, atSHS: [false, true] });
        schedules.push({ color: allEL, atSHS: [false, false] });
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
.row
  border-radius: 40px
  margin: 8px 5px
  display: flex
  align-items: center
  justify-content: space-between
  padding: 1px 3px

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
