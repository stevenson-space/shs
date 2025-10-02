export type NonEmptyArray<T> = { 0: T } & T[];

export type ScheduleMode = string;

// A schedule can be multi-day (like Finals) or single-day (like pretty much every other schedule)

export type BaseSchedule = {
  name: ScheduleMode,
  isCustom?: boolean; // whether this schedule is a custom (user-defined) one
};
export type SingleDayPeriods = { start: string[], end: string[], periods: string[] };
export type SingleDaySchedule = BaseSchedule & SingleDayPeriods;

type MultiDayField = string[] | string[][];
export type MultiDaySchedule = BaseSchedule
  & { start: MultiDayField, end: MultiDayField, periods: MultiDayField };

export type Schedule = SingleDaySchedule | MultiDaySchedule;

// The following is the format used to store the user-defined schedules in localStorage/state
export type CustomSchedules = Record<string, Schedule[]>

export type ScheduleType = string;
export type ScheduleCollection = {
  name: ScheduleType;
  isSpecial: boolean;
  dates: string[];
  modes: Schedule[];
  eventAliases?: string[];
};

export type Period =
  { beforeSchool: true, afterSchool?: false }
  | { beforeSchool?: false, afterSchool: true }
  | { beforeSchool?: false, afterSchool?: false, name: string, start: string, end: string }

export type ThemeMetadata = {
  name: string;
  author: string;
};

export type ThemeSeasonal = {
  // the dates the theme will be visible
  dates: string;
  // the message on the homepage advertising the theme
  message?: string;
  // if the theme should be hidden from the themes page outside of the schedule
  // (this can be overridden using the debug date setting)
  limitedTime: boolean;
};

export type ThemeTextColors = {
  primary: string;
  secondary: string;
  tertiary: string;
};

export type ThemeHeaderConfig = {
  // background color of the header
  background: string;
  // background image
  image?: {
    full: string;
    mobile?: string;
  };
  // color of the bar below the header
  scheduleBar: string;
};

export type ThemeIconCards = {
  // text color of the icon cards on the homepage
  regular: string;
  invert: string;
};

export type ThemeParticles = {
  images: string[];
  speed?: number;
  count?: number;
  size?: number;
  opacity?: number;
  windPower?: number;
  interaction?: boolean;
};

export type ThemeStyling = {
  base?: "light" | "dark";
  background?: string;
  secondaryBackground?: string;
  accent?: string;
  text?: ThemeTextColors;
  header?: ThemeHeaderConfig;
  iconCards?: ThemeIconCards;
  particles?: ThemeParticles;
};

export type Theme = {
  metadata: ThemeMetadata;
  visibility: "show" | "draft" | "hide";
  seasonal?: ThemeSeasonal;
  styling: ThemeStyling;
};

export type MapStateToComputed<S> = { // used for mapState()
  [K in keyof S]: () => S[K]
}
