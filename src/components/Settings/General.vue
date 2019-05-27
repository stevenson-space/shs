<template>
  <settings-section title="General">
    <div class="dropdown-row">
      <span class="title">Default Schedule:</span>
      <dropdown class="dropdown-select" :options="allModes" :value="defaultMode" @input="updateDefaultSchedule"/>
    </div>

    <div class="dropdown-row">
      <span class="title">Grade:</span>
      <dropdown class="dropdown-select" :options="grades" :value="selectedGrade" @input="updateGrade" :show-selected-as-option="false"/>
    </div>
  </settings-section>
</template>

<script>
import SettingsSection from './SettingsSection.vue';
import Dropdown from 'common/Dropdown.vue';

import { mapState } from "vuex";

export default {
  data() {
    return {
      grades: ['None', 'Freshman', 'Sophomore', 'Junior', 'Senior'],
    }
  },
  computed: {
    ...mapState([
      'schedules',
      'defaultSchedule',
      'grade',
    ]),
    allModes() {
      return this.schedules.reduce((arr, schedule) => {
        schedule.modes.forEach(mode => {
          if (!arr.includes(mode.name)) arr.push(mode.name);
        });
        return arr;
      }, []);
    },
    defaultMode() {
      const mode = this.allModes.indexOf(this.defaultSchedule);
      return mode === -1 ? 0 : mode;
    },
    selectedGrade() {
      const grade = this.grades.indexOf(this.grade);
      return grade === -1 ? 0 : grade;
    }
  },
  methods: {
    updateDefaultSchedule(scheduleIndex) {
      this.$store.commit('setDefaultSchedule', this.allModes[scheduleIndex]);
    },
    updateGrade(gradeIndex) {
      this.$store.commit('setGrade', this.grades[gradeIndex]);
    }
  },
  components: {
    SettingsSection,
    Dropdown,
  },
}
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

