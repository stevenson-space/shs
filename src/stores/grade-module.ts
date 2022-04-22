import { defineStore } from 'pinia';

interface State {
  grade: string
}

export default defineStore('grades', {
  // convert to a function
  state: (): State => ({
    grade: 'None',
  }),
  actions: {
    initializeGrade(): void {
      if (localStorage.grade) {
        this.setGrade(localStorage.grade);
      }
    },
    setGrade(grade: string): void {
      this.grade = grade;
      localStorage.grade = grade;
    },
  },
});
