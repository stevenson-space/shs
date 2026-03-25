import { defineStore } from 'pinia';
import { ref } from 'vue';

export default defineStore('grades', () => {
  const grade = ref('None');
  const showPWCSchedule = ref(true);

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

  function setGrade(value: string): void {
    grade.value = value;
    localStorage.grade = value;
  }

  function setShowPWCSchedule(value: boolean): void {
    showPWCSchedule.value = value;
    localStorage.showPWCSchedule = value;
  }

  return { grade, showPWCSchedule, initializeGrade, initializeShowPWCSchedule, setGrade, setShowPWCSchedule };
});
