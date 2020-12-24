<template>
  <settings-section title="General">
    <div class="dropdown-row">
      <span class="title">Default Schedule Mode:</span>
      <dropdown class="dropdown-select" :options="allModes" :value="defaultMode" @input="updateDefaultScheduleMode" />
    </div>

    <div class="dropdown-row">
      <span class="title">Grade:</span>
      <dropdown
        class="dropdown-select"
        :options="grades"
        :value="selectedGrade"
        :show-selected-as-option="false"
        @input="updateGrade"
      />
    </div>
  </settings-section>
</template>

<script>
import Dropdown from 'common/Dropdown.vue';

import { mapGetters, mapState } from 'vuex';
import SettingsSection from './SettingsSection.vue';

export default {
  components: { SettingsSection, Dropdown },
  data() {
    return {
      grades: ['None', 'Freshman', 'Sophomore', 'Junior', 'Senior'],
    };
  },
  computed: {
    ...mapState([
      'defaultScheduleMode',
      'grade',
    ]),
    ...mapGetters([
      'schedules',
    ]),
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
    updateDefaultScheduleMode(scheduleIndex) {
      this.$store.commit('setDefaultScheduleMode', this.allModes[scheduleIndex]);
    },
    updateGrade(gradeIndex) {
      this.$store.commit('setGrade', this.grades[gradeIndex]);
    },
  },
};
</script>

<style lang="sass" scoped>
@import 'src/styles/style.sass';

.dropdown-row
  margin: 25px 15px
  display: flex
  justify-content: space-between
  +desktop
    margin: 25px

  .title
    font-size: 1.15em

</style>
