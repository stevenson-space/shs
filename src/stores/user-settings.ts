import { defineStore } from "pinia";

interface State {
  grade: string;
  showPWCSchedule: boolean;
}

export default defineStore("grades", {
  state: (): State => ({
    grade: 'None',
    showPWCSchedule: true,
  }),
  actions: {
    initializeGrade(): void {
      if (localStorage.grade) {
        this.setGrade(localStorage.grade);
      }
    },
    initializeShowPWCSchedule(): void {
      //console.log(localStorage.showPWCSchedule);
      ////if (localStorage.showPWCSchedule) {
      //  this.setShowPWCSchedule(localStorage.showPWCSchedule === 'true');
      ////}
      .setShowPWCSchedule(true)
    },
    setGrade(grade: string): void {
      this.grade = grade;
      localStorage.grade = grade;
    },
    setShowPWCSchedule(showPWCSchedule: boolean): void {
      this.showPWCSchedule = showPWCSchedule;
      localStorage.showPWCSchedule = showPWCSchedule;
    },
  },
});
