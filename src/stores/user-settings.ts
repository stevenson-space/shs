import { defineStore } from "pinia";
import { ref } from "vue";

export default defineStore("grades", () => {
  const grade = ref('None');
  const showPWCSchedule = ref(true);

  // default order from Home.vue
  const defaultCardsLayout = [
    { id: 'end-of-year', component: 'EndOfYearCard' },
    { id: 'countdown', component: 'CountdownCard', props: { untilDate: 'May 23, 2025', message: '🌴 Summer Countdown 🐬' } },
    { id: 'new-feature', component: 'NewFeatureCard' },
    { id: 'new-theme', component: 'NewThemeCard' },
    { id: 'contribute', component: 'ContributeCard' },
    { id: 'april-fools', component: 'AprilFoolsCard' },
    { id: 'shs-hacks', component: 'ShsHacksCard' },
    { id: 'holiday', component: 'HolidayCard' },
    { id: 'schedule', component: 'ScheduleCard', props: { maxHeight: '270px' } },
    { id: 'weather', component: 'WeatherCard' },
    { id: 'pwc', component: 'PwcCard' },
    { id: 'lunch', component: 'LunchCard' },
    { id: 'events', component: 'UpcomingEventsCard' },
    { id: 'bell-schedules', component: 'IconTextCard', props: { iconName: 'faBell', text: 'Bell Schedules', link: 'bellschedules', invert: false } },
    { id: 'links', component: 'IconTextCard', props: { iconName: 'faLink', text: 'Links', link: 'links', invert: true } },
    { id: 'calendar', component: 'IconTextCard', props: { iconName: 'faCalendarDays', text: 'Calendar', link: 'calendar', invert: true } },
    { id: 'qr', component: 'IconTextCard', props: { iconName: 'faQrcode', text: 'QR Codes', link: 'qr' } },
    { id: 'jukebox', component: 'IconTextCard', props: { iconName: 'faRadio', text: 'Jukebox', link: 'jukebox' } },
    { id: 'gpa', component: 'IconTextCard', props: { iconName: 'faCalculator', text: 'GPA Calculator', link: 'gpaCalculator', linkProps: { type: 'a' }, invert: true } },
    { id: 'theme-switch', component: 'IconTextCard', props: { iconName: 'faDroplet', text: 'Switch Theme' } },
    { id: 'tools', component: 'IconTextCard', props: { iconName: 'faHourglass', text: 'Timer', link: 'tools', invert: true } },
    { id: 'documents', component: 'IconTextCard', props: { iconName: 'faFileLines', text: 'Documents', link: 'documents' } },
    { id: 'settings', component: 'IconTextCard', props: { iconName: 'faGear', text: 'Settings', link: 'settings', invert: true } },
  ];

  const cardsLayout = ref([...defaultCardsLayout]);
  const collapsedCards = ref<Record<string, boolean>>({});

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

  function initializeLayout(): void {
    if (localStorage.cardsLayout) {
      try {
        const parsed = JSON.parse(localStorage.cardsLayout);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with default to pick up any new cards added to the default config over time
          const savedIds = parsed.map(c => c.id);
          const newCards = defaultCardsLayout.filter(c => !savedIds.includes(c.id));
          cardsLayout.value = [...parsed, ...newCards];
        }
      } catch (e) {
        console.error("Failed to parse cards layout", e);
      }
    }
    if (localStorage.collapsedCards) {
      try {
        collapsedCards.value = JSON.parse(localStorage.collapsedCards);
      } catch (e) {
        console.error("Failed to parse collapsed cards", e);
      }
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

  function saveLayout(): void {
    localStorage.cardsLayout = JSON.stringify(cardsLayout.value);
  }

  function setCardCollapsed(id: string, collapsed: boolean): void {
    collapsedCards.value[id] = collapsed;
    localStorage.collapsedCards = JSON.stringify(collapsedCards.value);
  }

  return { grade, showPWCSchedule, cardsLayout, collapsedCards, initializeGrade, initializeShowPWCSchedule, initializeLayout, setGrade, setShowPWCSchedule, saveLayout, setCardCollapsed };
});
