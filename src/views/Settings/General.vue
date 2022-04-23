<template>
  <settings-section title="General">
    <div class="dropdown-row">
      <span class="title">Default Schedule Mode:</span>
      <dropdown class="dropdown-select" :options="allModes" :modelValue="defaultMode" @update:modelValue="updateDefaultScheduleMode" />
    </div>

    <div class="dropdown-row">
      <span class="title">Grade:</span>
      <dropdown
        class="dropdown-select"
        :options="grades"
        :modelValue="selectedGrade"
        :show-selected-as-option="false"
        @update:modelValue="updateGrade"
      />
    </div>
  </settings-section>
</template>

<script>
import Dropdown from '@/components/Dropdown.vue';

import useUserSettingsStore from '@/stores/user-settings';
import useScheduleStore from '@/stores/schedules';
import { mapState, mapActions } from 'pinia';
import SettingsSection from './SettingsSection.vue';

export default {
  components: { SettingsSection, Dropdown },
  data() {
    return {
      grades: ['None', 'Freshman', 'Sophomore', 'Junior', 'Senior'],
    };
  },
  computed: {
    ...mapState(useScheduleStore, ['defaultScheduleMode', 'schedules']),
    ...mapState(useUserSettingsStore, ['grade']),

    allModes() {
      return this.schedules.reduce((arr, schedule) => {
        schedule.modes.forEach((mode) => {
          if (!arr.includes(mode.name)) arr.push(mode.name);
        });
        return arr;
      }, []);
    },
    defaultMode() {
      const mode = this.allModes.indexOf(this.defaultScheduleMode);
      return mode === -1 ? 0 : mode;
    },
    selectedGrade() {
      const grade = this.grades.indexOf(this.grade);
      return grade === -1 ? 0 : grade;
    },
  },
  methods: {
    ...mapActions(useScheduleStore, ['setDefaultScheduleMode']),
    ...mapActions(useUserSettingsStore, ['setGrade']),

    updateDefaultScheduleMode(scheduleIndex) {
      this.setDefaultScheduleMode(this.allModes[scheduleIndex]);
    },
    updateGrade(gradeIndex) {
      this.setGrade(this.grades[gradeIndex]);
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass'

.dropdown-row
  margin: 25px 15px
  display: flex
  justify-content: space-between
  +desktop
    margin: 25px

  .title
    font-size: 1.15em

</style>
