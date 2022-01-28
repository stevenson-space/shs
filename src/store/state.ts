import { CustomSchedules, Theme } from '@/utils/types';
import _themeIdeas from '@/data/themeIdeas.json';
import _themes from '@/data/themes.json';

const themes: Theme[] = _themes;
const themeIdeas: Theme[] = _themeIdeas;

const state = {
  // in 'current' mode, everything is configured as if the specified date is current (e.g. countdown shown)
  // in 'day' mode, only details about that date are displayed (e.g. calendar events, lunch)
  mode: 'current',

  scheduleMode: '',
  color: process.env.VUE_APP_EDIT_COLORS === 'true' ? themeIdeas[themeIdeas.length - 1].suggestedColor : themes[0].suggestedColor,
  theme: process.env.VUE_APP_EDIT_COLORS === 'true' ? themeIdeas[themeIdeas.length - 1] : themes[0],
  // date indicates Date object, time indicates epoch time in milliseconds
  urlDate: new Date(), // relative to URL specified time (will be set when URL changes)
  startTime: Date.now(), // relative to real time
  currentTime: Date.now(), // relative to real time
  // such that urlDate.getTime() + (currentTime - startTime) will equal the current time relative to the URL specified time

  customSchedules: {} as CustomSchedules,
  defaultScheduleMode: 'Normal',

  grade: 'None',

  backgroundImages: {},
  // authenticated with a student.d125.org google email
  isAuthenticated: process.env.NODE_ENV === 'development',
};

export type State = typeof state;

export default state;
