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

export type Theme = {
  name: string;
  suggestedColor: string;
  background: string;
  secondaryBackground: string;
  headerBackgroundColor: string;
  headerScheduleBackgroundColor: string;
  primary: string;
  secondary: string;
  tertiary: string;
  iconTextCardColor: string;
  iconTextCardInvertColor: string;
  schedule: string;
};

export type ThemeData = {
  theme: Theme;
  useThemeColor: boolean; // if the suggestedColor of the theme is persisted as opposed to your set color.
};

export type MapStateToComputed<S> = { // used for mapState()
  [K in keyof S]: () => S[K]
}
