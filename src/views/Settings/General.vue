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

<script lang="ts">
import { MapStateToComputed, Schedule, ScheduleCollection } from '@/utils/types';
import { mapState, mapActions } from 'pinia';
import Dropdown from '@/components/Dropdown.vue';
import useUserSettingsStore from '@/stores/user-settings';
import useScheduleStore from '@/stores/schedules';
import { defineComponent } from 'vue';
import SettingsSection from './SettingsSection.vue';

type ScheduleStoreTypes = {
  defaultScheduleMode: string;
  schedules: ScheduleCollection[]
}

type UserSettingStoreTypes = {
  grade: string;
}

type GradeLevels = 'None'| 'Freshman' |'Sophomore'| 'Junior'| 'Senior';

export default defineComponent({
  components: { SettingsSection, Dropdown },
  data() {
    return {
      grades: ['None', 'Freshman', 'Sophomore', 'Junior', 'Senior'] as GradeLevels[],
    };
  },
  computed: {
    ...(mapState(useScheduleStore, ['defaultScheduleMode', 'schedules']) as MapStateToComputed<ScheduleStoreTypes>),
    ...(mapState(useUserSettingsStore, ['grade']) as MapStateToComputed<UserSettingStoreTypes>),

    allModes(): string[] {
      return this.schedules.reduce((arr: string[], schedule: ScheduleCollection) => {
        schedule.modes.forEach((mode) => {
          if (!arr.includes(mode.name)) arr.push(mode.name);
        });
        return arr;
      }, []);
    },
    defaultMode(): number | string {
      const mode = (this.allModes as string[]).indexOf(this.defaultScheduleMode);
      return mode === -1 ? 0 : mode;
    },
    selectedGrade(): void {
      const grade = this.grades.indexOf(this.grade);
      return grade === -1 ? 0 : grade;
    },
  },
  methods: {
    ...mapActions(useScheduleStore, ['setDefaultScheduleMode']),
    ...mapActions(useUserSettingsStore, ['setGrade']),

    updateDefaultScheduleMode(scheduleIndex: number):void {
      this.setDefaultScheduleMode(this.allModes[scheduleIndex]);
    },
    updateGrade(gradeIndex: number): void {
      this.setGrade(this.grades[gradeIndex]);
    },
  },
});
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
