export type NonEmptyArray<T> = { 0: T } & T[];

export type ScheduleMode = string;

// A schedule can be multi-day (like Finals) or single-day (like pretty much every other schedule)

export type BaseSchedule = { name: ScheduleMode };
export type SingleDayPeriods = { start: string[], end: string[], periods: string[] };
export type SingleDaySchedule = BaseSchedule & SingleDayPeriods;

type MultiDayField = string[] | string[][];
export type MultiDaySchedule = BaseSchedule
  & { start: MultiDayField, end: MultiDayField, periods: MultiDayField };

export type Schedule = SingleDaySchedule | MultiDaySchedule;

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
