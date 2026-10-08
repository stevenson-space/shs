import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("grades", () => {
  const grade = ref('None');
  const showPWCSchedule = ref(true);
  // where the countdown sits on a landscape iPad or laptop: a panel on the left, or across the top
  const heroPosition = ref<'left' | 'top'>('left');
  // the redesigned home page, or the old one for anyone who prefers it
  const homeStyle = ref<'new' | 'classic'>('new');

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

  function initializeHeroPosition(): void {
    if (localStorage.heroPosition === 'top' || localStorage.heroPosition === 'left') {
      heroPosition.value = localStorage.heroPosition;
    }
  }

  function setHeroPosition(value: 'left' | 'top'): void {
    heroPosition.value = value;
    localStorage.heroPosition = value;
  }

  function initializeHomeStyle(): void {
    if (localStorage.homeStyle === 'classic' || localStorage.homeStyle === 'new') {
      homeStyle.value = localStorage.homeStyle;
    }
  }

  function setHomeStyle(value: 'new' | 'classic'): void {
    homeStyle.value = value;
    localStorage.homeStyle = value;
  }

  function setGrade(value: string): void {
    grade.value = value;
    localStorage.grade = value;
  }

  function setShowPWCSchedule(value: boolean): void {
    showPWCSchedule.value = value;
    localStorage.showPWCSchedule = value;
  }

  return {
    grade,
    showPWCSchedule,
    heroPosition,
    homeStyle,
    initializeGrade,
    initializeShowPWCSchedule,
    initializeHeroPosition,
    initializeHomeStyle,
    setGrade,
    setShowPWCSchedule,
    setHeroPosition,
    setHomeStyle,
  };
});
