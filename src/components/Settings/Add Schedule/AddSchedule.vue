<template>
  <div>
    <home-link class="home-link"/>

    <div class="header">
      <div class="title" @click="editScheduleName">
        <input
          v-show="editingScheduleName"
          class="schedule-name-input"
          :value="scheduleName"
          @blur="setScheduleName($event.target.value)"
          @keypress.enter.prevent="setScheduleName($event.target.value)"
          @click.stop=""
          maxlength="20"
          ref="schedule-name-input">
        
        <div class="text" v-show="!editingScheduleName">{{ scheduleName }}</div>

        <font-awesome-icon :icon="icons.faPencilAlt" class="icon"/>
      </div>

      <div class="buttons">
        <div class="button" @click="save">Save Schedule</div>
        <div class="button inverse" @click="addPeriod">
          <font-awesome-icon class="icon" :icon="icons.faPlus"/>
          Add Period To All
        </div>
        <div class="button inverse" @click="showDeleteAllPopup = true">Delete All</div>
      </div>

      <div class="mobile-disclaimer">
        For an easier experience, please use your iPad or a computer to create/edit the schedule and
        <router-link class="link" to="/settings#transfer">transfer</router-link> it to this device
      </div>
    </div>

    <div class="main">

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
import { mapState } from 'vuex';

import HomeLink from 'common/HomeLink.vue';
import ScheduleColumn from './ScheduleColumn.vue';
import TimePicker from './TimePicker.vue';
import ConfirmPopup from 'common/ConfirmPopup.vue';
import Bell from 'src/js/bell.js';

export default {
  props: {
    mode: { type: String, validator: val => ['add', 'edit'].includes(val), default: 'add'},
    scheduleToEdit: { type: String, default: null },
  },
  data() {
    return {
      scheduleName: '',
      editingScheduleName: false,
      schedules: null, // will be set in created()
      showDeleteAllPopup: false,
      icons: {
        faPlus,
        faPencilAlt,
      },
      dirty: false, // true if the data has been modified without having been saved yet
      beforeUnloadHandler: null,
    }
  },
  computed: mapState({
    existingSchedules: 'schedules'
  }),
  created() {
    // setting scheduleName to 'Untitled Schedule' here in case a schedule already exists with
    // that name (setScheduleName checks existing schedules and modifies name accordingly)
    this.setScheduleName('Untitled Schedule');

    // filtering out multiday schedules for now (too complex...), and no school days (indicated by modes.length === 0)
    const schedules = this.existingSchedules.filter(schedule => 
      schedule.modes.length > 0 && !Bell.isMultiDay(schedule.modes[0])
    );

    if (this.mode == 'add') {
      this.schedules = schedules.map(schedule => ({
        name: schedule.name,
        isEnabled: true,
        periods: [],
      }));

      this.addPeriod();
    }
    else { // we assume mode == 'edit' and pre populate the page based on the existing mode
      const removeExclamationMark = periodName => periodName[0] == '!' ? periodName.substring(1) : periodName;
      this.scheduleName = this.scheduleToEdit;
      this.schedules = schedules.map(schedule => {
        const result = {
          name: schedule.name,
          isEnabled: false,
          periods: [],
        }

        const modeNames = schedule.modes.map(mode => mode.name);
        const index = modeNames.indexOf(this.scheduleToEdit);
        if (index > -1) {
          result.isEnabled = true;
          for (let i = 0; i < schedule.modes[index].periods.length; i++) {
            result.periods.push({
              start: schedule.modes[index].start[i],
              end: schedule.modes[index].end[i],
              name: removeExclamationMark(schedule.modes[index].periods[i]),
            });
          }
        }

        return result;
      });
    }

    this.$nextTick(() => {
      this.dirty = false; // reset dirty to false after initializing schedules (the watcher will set dirty to true)
    })

    this.beforeUnloadHandler = event => {
      if (this.dirty) {
        event.returnValue = 'Are you sure you want to leave without saving?';
      }
    };
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  },
  watch: {
    schedules: {
      deep: true,
      handler() {
        this.dirty = true;
      }
    },
    scheduleName() {
      this.dirty = true;
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.dirty) {
      const answer = window.confirm('Are you sure you want to leave without saving?');
      if (answer) {
        next();
      } else {
        next(false); // prevent user from leaving page
      }
    } else {
      next();
    }
  },
  methods: {
    pickTimeFor(schedule, period, time) {
      // schedule is the index of the schedule type clicked on
      // period is the index of the period clicked on
      // time is either 'start' or 'end' depending on which the user click on

      const timePicker = this.$refs['time-picker'];

      const options = []
      this.existingSchedules[schedule].modes.forEach(scheduleMode => {
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
        userPeriod[time] = result.time;
        if (result.setOthers) {
          this.setOthers(userPeriod.name, result.name, result.scheduleMode, time);
        }
        this.sortPeriods();
      }, message => {
        // don't need to do anything if the user cancels
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
      this.existingSchedules[schedule].modes.forEach(mode => {
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
      this.schedules.forEach(schedule => {
        schedule.periods.sort((a, b) => Bell.timeToNumber(a.start) - Bell.timeToNumber(b.start));
      });
    },
    updateName(schedule, period, name, updateOthers) {
      name = this.getNameWithoutConflicts(name, this.doesNameExist);

      var oldName = this.schedules[schedule].periods[period].name;
      if (updateOthers) {
        this.schedules.forEach(schedule => {
          schedule.periods.forEach(period => {
            if (period.name === oldName) {
              period.name = name;
            }
          });
        });
      } else {
        this.schedules[schedule].periods[period].name = name;
      }
    },
    addPeriod(toSchedule) {
      const name = this.getNameWithoutConflicts(this.getRandomCourseName(), this.doesNameExist);
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
    getNameWithoutConflicts(name, doesNameExistFunction) {
      let newName = name;
      for(let i = 2; doesNameExistFunction(newName); i++) {
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
    },
    editScheduleName() {
      this.editingScheduleName = true;
      this.$nextTick(() => { // wait until the input appears (v-show = "editingScheduleName")
        this.$refs['schedule-name-input'].focus();
        // this.$refs['schedule-name-input'].select();
        this.$refs['schedule-name-input'].setSelectionRange(0, 9999);
      })
    },
    setScheduleName(name) {
      if (name && name != this.scheduleName) {
        let existingSchedulesNames = new Set();
        this.existingSchedules.forEach(schedule => {
          schedule.modes.map(mode => mode.name).forEach(name => existingSchedulesNames.add(name));
        });
        this.scheduleName = this.getNameWithoutConflicts(name, testName => existingSchedulesNames.has(testName));
      }

      this.editingScheduleName = false;
    },
    save() {
      const formatSchedule = periods => {
        const schedule = { name: this.scheduleName, start: [], end: [], periods: [] };
        periods.forEach(period => {
          schedule.start.push(period.start);
          schedule.end.push(period.end);

          // if the period name is not a number, then we want the exclamation mark to prevent inserting 'Period ' before the name when displayed
          schedule.periods.push( (isNaN(parseInt(period.name)) ? '!' : '') + period.name);
        });
        return schedule;
      }

      this.schedules.forEach(schedule => {
        if (schedule.isEnabled) {
          this.$store.commit('addScheduleMode', {
            scheduleType: schedule.name,
            scheduleToAdd: formatSchedule(schedule.periods),
            scheduleToReplace: this.mode == 'edit' ? this.scheduleToEdit : null,
          });
        }
        else if (this.mode == 'edit') { // if in edit mode and the user unchecks isEnabled, we need to delete the mode
          this.$store.commit('removeScheduleMode', {
            scheduleType: schedule.name,
            scheduleToRemove: this.scheduleToEdit,
          });
        }
      });

      this.dirty = false;
      this.$router.push('/settings');
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
  right: 20px

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
    align-items: center
    cursor: pointer

    +mobile-small
      font-size: 1.75em
      margin-left: 5px

    .schedule-name-input
      font-size: 1em
      font-family: inherit
      font-weight: inherit
      color: inherit
      max-width: calc(100vw - 55px) // 55px is the hardcoded space that the icon + margins take up

    .text
      padding: 5px
      max-width: calc(100vw - 55px) // 55px is the hardcoded space that the icon + margins take up
      overflow: hidden
      text-overflow: ellipses


    .icon
      font-size: .7em
      margin-left: 25px
      color: #bbb
      +mobile-small
        margin-left: 10px

  .buttons
    display: flex
    flex-direction: column
    align-items: flex-end
    margin-right: 20px
    margin-bottom: 10px
    
    .button
      background-color: var(--color)
      color: white
      border-radius: 100px
      padding: 5px 10px
      cursor: pointer
      font-weight: bold
      user-select: none
      margin: 3px 0
      display: flex
      align-items: center
      &.inverse
        border: var(--color) 1.5px solid
        background-color: white
        color: var(--color)

      .icon
        font-size: .85em
        margin-right: 5px

  .mobile-disclaimer
    font-size: .668em
    text-align: center
    display: none
    +mobile-small
      display: block

    .link
      color: var(--color)
      font-weight: bold
      font-size: 1.2em

.main
  margin-top: 25px

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

