import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("grades", () => {
  const grade = ref('None');
  const showPWCSchedule = ref(true);
  const showILCSchedule = ref(true);

  function initializeGrade(): void {
    if (localStorage.grade) {
      setGrade(localStorage.grade);
    }
  }

  function initializeShowPWCSchedule(): void {
    if (localStorage.showPWCSchedule) {
      setShowPWCSchedule(localStorage.showPWCSchedule === 'true');
    }
  }

  function initializeShowILCSchedule(): void {
    if (localStorage.showILCSchedule) {
      setShowILCSchedule(localStorage.showILCSchedule === 'true');
    }
  }

  function setGrade(value: string): void {
    grade.value = value;
    localStorage.grade = value;
  }

  function setShowPWCSchedule(value: boolean): void {
    showPWCSchedule.value = value;
    localStorage.showPWCSchedule = value;
  }

  function setShowILCSchedule(value: boolean): void {
    showILCSchedule.value = value;
    localStorage.showILCSchedule = value;
  }

  return { grade, showPWCSchedule, showILCSchedule, initializeGrade, initializeShowPWCSchedule, initializeShowILCSchedule, setGrade, setShowPWCSchedule, setShowILCSchedule };
});
