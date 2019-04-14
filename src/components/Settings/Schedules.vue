<template>
  <div class="schedules">
    <section-heading title="Schedules">
      <switch-by-device>
        <rounded-button @click="restoreSchedules" text="Restore to Defaults" :icon="icons.faHistory"/>
        <rounded-button slot="mobile" @click="restoreSchedules" text="Restore" :icon="icons.faHistory"/>
      </switch-by-device>
    </section-heading>

    <div class="schedule-cards">
      <schedule-card
        v-for="schedule in scheduleModes"
        class="card"
        :schedule="schedule"
        :title="schedule.name"
        :key="schedule.name">
          <div class="actions">
            <div class="action" @click="deleteSchedule(schedule.name)">
              <font-awesome-icon :icon="icons.faTrashAlt"/> Delete
            </div>
            
            <div class="action" @click="editSchedule(schedule.name)">
              <font-awesome-icon :icon="icons.faPencilAlt"/> Edit
            </div>
          </div>
      </schedule-card>

      <card>
        <div class="add-new-card" @click="$router.push('/add-schedule')">
          <font-awesome-icon :icon="icons.faPlus"/>
          <div class="text">Add Custom</div>
        </div>
      </card>
    </div>

    <confirm-popup ref="confirm-popup"/>
  </div>
</template>

<script>
import { mapState } from "vuex";

import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faPlus, faPencilAlt, faTrashAlt, faHistory } from '@fortawesome/free-solid-svg-icons'

import Bell from 'src/js/bell.js';
import SectionHeading from './SectionHeading.vue';
import SwitchByDevice from 'common/SwitchByDevice.vue';
import RoundedButton from 'common/RoundedButton.vue';
import ScheduleCard from 'common/cards/ScheduleCard.vue';
import Card from 'common/Card.vue';
import ConfirmPopup from 'common/ConfirmPopup.vue';

export default {
  data() {
    return {
      icons: {
        faPlus,
        faPencilAlt,
        faTrashAlt,
        faHistory,
      }
    }
  },
  computed: {
    ...mapState([
      'schedules',
    ]),
    scheduleModes() {
      const scheduleModes = [];
      const addedModeNames = new Set();

      // filtering out multiday schedules for now (too complex...), and no school days (indicated by modes.length === 0)
      const filteredSchedules = this.schedules.filter(schedule => 
        schedule.modes.length > 0 && !Bell.isMultiDay(schedule.modes[0])
      );

      filteredSchedules.forEach(schedule => {
        schedule.modes.forEach(mode => {
          if (!addedModeNames.has(mode.name)) {
            scheduleModes.push(mode);
            addedModeNames.add(mode.name);
          }
        });
      });

      return scheduleModes;
    }
  },
  methods: {
    deleteSchedule(name) {
      this.$refs['confirm-popup'].displayPopup(`Are you sure you want to delete the schedule '${name}'`)
        .then(() => {
          this.$store.commit('removeScheduleMode', { scheduleToRemove: name });
        }, () => {
          // don't need to do anything if the user cancels
        })
    },
    editSchedule(name) {
      this.$router.push({ name: 'editSchedules', params: { scheduleToEdit: name } });
    },
    restoreSchedules() {
      this.$refs['confirm-popup'].displayPopup('Are you sure you want to erase your changes')
        .then(() => {
          this.$store.commit('resetSchedules');
        }, () => {});
    }
  },
  components: {
    FontAwesomeIcon,
    SectionHeading,
    SwitchByDevice,
    RoundedButton,
    ScheduleCard,
    Card,
    ConfirmPopup,
  }
}
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.schedules
  width: 100%
  padding-left: 150px
  box-sizing: border-box
  +tablet
    padding-left: 50px
  +mobile
    padding-left: 20px

  .schedule-cards
    display: grid
    grid-template-columns: 1fr 1fr 1fr 1fr
    @media screen and (max-width: 1535px)
      grid-template-columns: 1fr 1fr 1fr
    @media screen and (max-width: 1150px)
      grid-template-columns: 1fr 1fr
    @media screen and (max-width: 500px)
      grid-template-columns: 1fr

    .card
      zoom: .8

      .actions
        display: flex
        padding: 10px 0 5px 0
        border-top: 1.5px solid var(--color)

        .action
          flex: 1
          text-align: center
          font-size: 1.25em
          color: var(--color)
          font-weight: bold
          cursor: pointer
    
    .add-new-card
      height: 200px
      display: flex
      justify-content: center
      align-items: center
      flex-direction: column
      font-size: 2.8em
      color: var(--color)
      cursor: pointer
      
      .text
        margin-top: 15px
        font-weight: bold
        font-size: .75em

</style>

