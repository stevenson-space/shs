<template>
  <div>
    <home-link class="home-link"/>

    <div class="header">
      <div class="title">
        <div class="text">Untitled Schedule</div>
        <font-awesome-icon :icon="icons.faPencilAlt" class="icon"/>
      </div>

      <div class="buttons">
        <div class="button" @click="addPeriod">
          <font-awesome-icon class="icon" :icon="icons.faPlus"/>
          Add Period To All
        </div>
        <div class="button inverse" @click="showDeleteAllPopup = true">Delete All</div>
      </div>
    </div>

    <div class="main">
      <div class="add-period">
      </div>

      <div class="columns">
        <schedule-column
          v-for="(schedule, i) in schedules"
          class="column"
          v-bind="schedule"
          @enable="schedules[i].isEnabled = true"
          @disable="schedules[i].isEnabled = false"
          @pick-time="pickTimeFor(i, $event.period, $event.time)"
          @update-name="updateName(i, $event.period, $event.name, $event.updateOthers)"
          @delete-period="deletePeriod(i, $event.period, $event.deleteOthers)"
          @add-period="addPeriod(i)"
          :key="schedule.name"/>
      </div>
    </div>

    <time-picker ref="time-picker"/>
    <confirm-popup :show="showDeleteAllPopup" @cancel="showDeleteAllPopup = false" @ok="deleteAllPeriods">
      <div class="delete-all-popup">Are you sure you want to delete all periods?</div>
    </confirm-popup>
  </div>
</template>

<script>
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faPlus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import HomeLink from 'common/HomeLink.vue';
import ScheduleColumn from './ScheduleColumn.vue';
import TimePicker from './TimePicker.vue';
import ConfirmPopup from 'common/ConfirmPopup.vue';
import defaultSchedules from 'src/data/schedules.json';
import Bell from 'src/js/bell.js';

export default {
  data() {
    return {
      schedules: null, // will be set in created()
      showDeleteAllPopup: false,
      icons: {
        faPlus,
        faPencilAlt,
      }
    }
  },
  created() {
    // filtering out multiday schedules for now (too complex...), and no school days (indicated by modes.length === 0)
    const schedules = defaultSchedules.filter(schedule => {
      if (schedule.modes.length === 0 || Bell.isMultiDay(schedule.modes[0])) {
        return false;
      }
      return true;
    });

    this.schedules = schedules.map(schedule => ({
      name: schedule.name,
      isEnabled: true,
      periods: [],
    }));

    this.addPeriod();
  },
  methods: {
    pickTimeFor(schedule, period, time) {
      // schedule is the index of the schedule type clicked on
      // period is the index of the period clicked on
      // time is either 'start' or 'end' depending on which the user click on

      const timePicker = this.$refs['time-picker'];

      const options = []
      defaultSchedules[schedule].modes.forEach(scheduleMode => {
        scheduleMode.periods.forEach((period, i) => {
          options.push({
            text: Bell.formatPeriodName(period), 
            time: scheduleMode[time][i],

            // only 'text' and 'time are used by the timePicker, 'scheduleMode' and 'name' are metadata that we will use later
            scheduleMode: scheduleMode.name,
            name: period,
          });
        });
      });

      const userPeriod = this.schedules[schedule].periods[period];
      timePicker.pickTime(options, userPeriod[time]).then(result => {
        console.log(result);
        userPeriod[time] = result.time;
        if (result.setOthers) {
          this.setOthers(userPeriod.name, result.name, result.scheduleMode, time);
        }
        this.sortPeriods();
      }, message => {
        console.log(message);
      });
    },
    setOthers(userPeriodName, periodName, scheduleMode, time) { // time is 'start' or 'end'
      this.schedules.forEach((userSchedule, i) => {
        userSchedule.periods.forEach(period => {
          if (period.name == userPeriodName) {
            let newTime = this.searchScheduleForTime(periodName, scheduleMode, time, i);
            if (newTime) {
              period[time] = newTime;
            }
          }
        });
      });
    },
    searchScheduleForTime(periodName, scheduleMode, time, schedule) { // time is 'start' or 'end'
      let result = null;
      defaultSchedules[schedule].modes.forEach(mode => {
        if (mode.name === scheduleMode) {
          mode.periods.forEach((period, i) => {
            if (period === periodName) {
              result = mode[time][i]
            }
          });
        }
      });
      return result;
    },
    sortPeriods() {

    },
    updateName(schedule, period, name, updateOthers) {
      name = this.getNameWithoutConflicts(name);

      var oldName = this.schedules[schedule].periods[period].name;
      if (updateOthers) {
        this.schedules.forEach(schedule => {
          schedule.periods.forEach(period => {
            if (period.name === oldName) {
              period.name = name;
            }
          })
        })
      } else {
        this.schedules[schedule].periods[period].name = name;
      }
    },
    addPeriod(toSchedule) {
      const name = this.getNameWithoutConflicts(this.getRandomCourseName());
      const getPeriod = () => ({ name, start: '23:59', end: '23:59' }); // function, so that a different object is created every time
      
      if (Number.isInteger(toSchedule)) { // add it to all schedules
        this.schedules[toSchedule].periods.push(getPeriod());
      } else {
        this.schedules.forEach(schedule => {
          schedule.periods.push(getPeriod());
        });
      }

      this.sortPeriods();
    },
    getNameWithoutConflicts(name) {
      let newName = name;
      for(let i = 2; this.doesNameExist(newName); i++) {
        newName = name + ' ' + i;
      }
      return newName;
    },
    doesNameExist(name) {
      let result = false;
      this.schedules.forEach(schedule => {
        schedule.periods.forEach(period => {
          if (period.name == name) {
            result = true;
          }
        });
      });
      return result;
    },
    getRandomCourseName() {
      const courses = ['English', 'Chemistry', 'Physics', 'Biology', 'Math', 'History', 'Computer Science', 'Engineering'];
      return courses[Math.floor(Math.random() * courses.length)];
    },
    deletePeriod(schedule, period, deleteOthers) {
      if (deleteOthers) {
        const periodName = this.schedules[schedule].periods[period].name;
        this.schedules.forEach(schedule => {
          schedule.periods = schedule.periods.filter(period => period.name !== periodName);
        });
      } else {
        this.schedules[schedule].periods.splice(period, 1);
      }
    },
    deleteAllPeriods() {
      this.schedules.forEach(schedule => {
        schedule.periods = [];
      });
      this.showDeleteAllPopup = false;
    }
  },
  components: {
    HomeLink,
    ScheduleColumn,
    TimePicker,
    ConfirmPopup,
    FontAwesomeIcon,
  }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'
.home-link
  position: absolute
  top: 10px
  right: 10px

.header
  width: 95%
  margin: auto
  margin-top: 50px
  position: relative
  padding-top: 1px

  .title
    font-size: 2em
    color: #444
    font-weight: bold
    margin-left: 10px
    display: flex
    // justify-content: space-between
    align-items: center
    cursor: pointer

    .icon
      font-size: .7em
      margin-left: 25px
      color: #bbb

  .buttons
    display: flex
    flex-direction: column
    align-items: flex-end
    margin-right: 20px
    margin-bottom: 25px
    
    .button
      background-color: var(--color)
      color: white
      border-radius: 100px
      padding: 5px 10px
      cursor: pointer
      font-weight: bold
      user-select: none
      margin: 5px 0
      display: flex
      align-items: center
      &.inverse
        border: var(--color) 1.5px solid
        background-color: white
        color: var(--color)

      .icon
        font-size: .85em
        margin-right: 5px

.main
  margin-top: 50px

  .columns
    display: flex
    overflow: auto
    -webkit-overflow-scrolling: touch;

    .column
      margin: 0 20px 50px 20px

.delete-all-popup
  max-width: 300px
  padding: 20px 35px
  font-size: 1.2em
  text-align: center
  font-weight: bold

</style>

