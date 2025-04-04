<template>
  <settings-section title="Schedules">
    <template v-slot:heading-content>
      <switch-by-device class="restore-button">
        <template v-slot:desktop>
          <rounded-button text="Restore to Defaults" :icon="icons.faClockRotateLeft" :invert="true" @click="restoreSchedules" />
        </template>
        <template v-slot>
          <rounded-button text="Restore" :icon="icons.faClockRotateLeft" :invert="true" @click="restoreSchedules" />
        </template>
      </switch-by-device>
    </template>

    <div class="schedule-cards">
      <schedule-card
        v-for="schedule in scheduleModes"
        :key="schedule.name"
        class="card"
        :schedule="schedule"
        :title="schedule.name"
      >
        <div class="actions">
          <div v-if="schedule.isCustom" class="action" @click="deleteSchedule(schedule.name)">
            <font-awesome-icon :icon="icons.faTrashCan" />
            Delete
          </div>

          <div class="action" @click="editSchedule(schedule.name)">
            <font-awesome-icon :icon="icons.faPencil" />
            {{ schedule.isCustom ? 'Edit' : 'Copy & Edit' }}
          </div>
        </div>
      </schedule-card>

      <card>
        <div class="add-new-card" @click="$router.push('/add-schedule')">
          <font-awesome-icon :icon="icons.faPlus" />
          <div class="text">Add Custom</div>
        </div>
      </card>
    </div>

    <confirm-popup ref="confirm-popup" />
  </settings-section>
</template>

<script>

import { mapState, mapActions } from 'pinia';
import {
  faPlus, faPencil, faTrashCan, faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';

import SwitchByDevice from '@/components/SwitchByDevice.vue';
import RoundedButton from '@/components/RoundedButton.vue';
import ScheduleCard from '@/components/cards/ScheduleCard.vue';
import Card from '@/components/Card.vue';
import ConfirmPopup from '@/components/ConfirmPopup.vue';
import Bell from '@/utils/bell';
import useScheduleStore from '@/stores/schedules';
import SettingsSection from './SettingsSection.vue';

export default {
  components: {
    SettingsSection,
    SwitchByDevice,
    RoundedButton,
    ScheduleCard,
    Card,
    ConfirmPopup,
  },
  data() {
    return {
      icons: {
        faPlus,
        faPencil,
        faTrashCan,
        faClockRotateLeft,
      },
    };
  },
  computed: {
    ...mapState(useScheduleStore, ['schedules']),
    scheduleModes() {
      const scheduleModes = [];
      const addedModeNames = new Set();

      // filtering out multiday schedules for now (too complex...), and no school days (indicated by modes.length === 0)
      const filteredSchedules = this.schedules.filter(
        (schedule) => schedule.modes.length > 0 && !Bell.isMultiDaySchedule(schedule.modes[0]),
      );

      filteredSchedules.forEach((schedule) => {
        schedule.modes.forEach((mode) => {
          if (!addedModeNames.has(mode.name)) {
            scheduleModes.push(mode);
            addedModeNames.add(mode.name);
          }
        });
      });

      return scheduleModes;
    },
  },
  methods: {
    ...mapActions(useScheduleStore, ['removeCustomScheduleMode', 'resetSchedules']),
    deleteSchedule(name) {
      this.$refs['confirm-popup'].displayPopup(`Are you sure you want to delete the schedule '${name}'`)
        .then(() => {
          this.removeCustomScheduleMode({ scheduleToRemove: name });
        }, () => {
          // don't need to do anything if the user cancels
        });
    },
    editSchedule(name) {
      this.$router.push({ name: 'editSchedules', params: { scheduleToEdit: name } });
    },
    restoreSchedules() {
      this.$refs['confirm-popup'].displayPopup('Are you sure you want to erase your changes')
        .then(() => {
          this.resetSchedules();
        }, () => {});
    },
  },
};
</script>

<style lang="sass" scoped>
@import '@/styles/style.sass'

.schedule-cards
  margin-top: 10px
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
    +animate-fade-up
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
