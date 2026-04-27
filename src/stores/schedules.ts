import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { RouteLocationNormalized } from 'vue-router';
import rawSchedules from '@/data/schedules.json';
import scheduleDates from '@/data/schedule-dates.json';
import { CustomSchedules, Schedule, ScheduleCollection } from '@/utils/types';
import { tryParseJSON, getNameWithoutConflicts } from '@/utils/util';

const officialSchedules: ScheduleCollection[] = rawSchedules.map((s) => {
  if (s.dates === null) {
    const dates = (scheduleDates as Record<string, string[]>)[s.name];
    if (!dates) throw new Error(`Schedule "${s.name}" has null dates but no entry in schedule-dates.json`);
    return { ...s, dates };
  }
  return s as ScheduleCollection;
});

export default defineStore('schedules', () => {
  const customSchedules = ref<CustomSchedules>({} as CustomSchedules);
  const defaultScheduleMode = ref('Normal');
  const scheduleMode = ref('');

  // we merge the officialSchedules provided by us and the user defined customSchedules
  const schedules = computed((): ScheduleCollection[] => {
    const scheduleList: ScheduleCollection[] = JSON.parse(JSON.stringify(officialSchedules)); // begin with copying the officialSchedules
    // customSchedules is an object with `schedule type` keys and values containing a
    // list of schedule mode objects for the corresponding schedule type
    const custom = customSchedules.value;
    if (custom) {
      for (const schedule of scheduleList) {
        const customScheduleModes = custom[schedule.name];
        if (customScheduleModes) { // if there exist custom schedules for the current schedule type
          for (const scheduleMode of customScheduleModes) {
            // add the scheduleMode, and also include an `isCustom` flag to later be able to distinguish them
            schedule.modes.push({ ...scheduleMode, isCustom: true });
          }
        }
      }
    }
    return scheduleList;
  });

  function initializeSchedule(): void {
    setCustomSchedules(tryParseJSON(localStorage.customSchedules) as CustomSchedules);
    if (localStorage.defaultScheduleMode) {
      setDefaultScheduleMode(localStorage.defaultScheduleMode);
      setScheduleMode(localStorage.defaultScheduleMode);
    }
  }

  function addCustomScheduleMode({ scheduleType, scheduleToAdd, scheduleToReplace }: { scheduleType: string, scheduleToAdd: { start: string[], end: string[], name: string, periods: string[] }, scheduleToReplace: string }): void {
    // If scheduleToReplace is not defined, then we want to just add to end of scheduleModes list
    const scheduleModes = (customSchedules.value || {})[scheduleType] || [] as Schedule[];
    const replaceIndex = scheduleModes.map((mode: Schedule) => mode.name).indexOf(scheduleToReplace);
    // Notice that scheduleModes only contains schedules from customSchedules, so if scheduleToReplace is an
    // official schedule, then replaceIndex will be -1, and we'll just add the new schedule without replacing anything
    // (this is the expected behavior because official schedules can't be modified or replaced)
    if (replaceIndex !== -1) {
      scheduleModes.splice(replaceIndex, 1, scheduleToAdd);
    } else {
      scheduleModes.push(scheduleToAdd);
    }
    setCustomSchedules({ ...customSchedules.value, [scheduleType]: scheduleModes });
  }

  function removeCustomScheduleMode({ scheduleType, scheduleToRemove }: { scheduleType: string, scheduleToRemove: string}): void {
    // if scheduleType is not provided, then we remove scheduleToRemove for all schedule types
    for (const [type, scheduleModes] of Object.entries(customSchedules.value || {}) as [any, Schedule[]]) {
      if (!scheduleType || scheduleType === type) {
        const removeIndex = scheduleModes.map((mode: Schedule) => mode.name).indexOf(scheduleToRemove);
        if (removeIndex > -1) {
          scheduleModes.splice(removeIndex, 1);
        }
      }
    }
    setCustomSchedules(customSchedules.value);
  }

  function setCustomSchedules(value: CustomSchedules): void {
    // If there are any schedule modes with the same name as an official schedule mode, we want to rename the custom one
    const officalScheduleModeNames = new Set();
    for (const schedule of officialSchedules) {
      for (const scheduleMode of schedule.modes) {
        officalScheduleModeNames.add(scheduleMode.name);
      }
    }
    for (const scheduleModes of Object.values(value)) {
      for (const scheduleMode of scheduleModes) {
        scheduleMode.name = getNameWithoutConflicts(
          scheduleMode.name,
          (name) => officalScheduleModeNames.has(name),
        );
      }
    }
    customSchedules.value = value;
    localStorage.customSchedules = JSON.stringify(value);
  }

  function resetSchedules(): void {
    customSchedules.value = {} as CustomSchedules;
    localStorage.customSchedules = JSON.stringify({});
  }

  function setDefaultScheduleMode(value: string): void {
    defaultScheduleMode.value = value;
    localStorage.defaultScheduleMode = value;
  }

  function setScheduleMode(value: string): void {
    scheduleMode.value = value;
  }

  return { customSchedules, defaultScheduleMode, scheduleMode, schedules, initializeSchedule, addCustomScheduleMode, removeCustomScheduleMode, setCustomSchedules, resetSchedules, setDefaultScheduleMode, setScheduleMode };
});
