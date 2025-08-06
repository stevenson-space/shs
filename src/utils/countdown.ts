import Bell from "@/utils/bell";
import {formatDate, periodToSeconds } from "@/utils/util";

export function intoCountdownString(secondsLeft: number): string {
  if (secondsLeft < 0) {
    return `0:00`;
  }

  // if more than 1 day of seconds left, display number of days left
  if (secondsLeft > 60 * 60 * 24) {
    const numDays = Math.ceil(secondsLeft / 60 / 60 / 24);
    return `${numDays} days`;
  }

  // return a nicely formatted string with remaining hours, minutes, and seconds left
  const seconds = secondsLeft % 60;
  const minutes = Math.floor(secondsLeft / 60) % 60;
  const hours = Math.floor(secondsLeft / 60 / 60);

  // hours are only displayed if > 0
  const h = hours > 0 ? `${hours}:` : '';
  // minutes always has 2 digits if hours are displayed
  const mm = `${minutes < 10 && hours > 0 ? '0' : ''}${minutes}:`;
  // seconds always has 2 digits
  const ss = `${seconds < 10 ? '0' : ''}${seconds}`;

  return `${h}${mm}${ss}`;
}

// Returns when school resumes
export function schoolResumesString(bell: Bell, date: Date): string | null {
  // Only displayed when not in school (either no school, before school, or after school)
  if (bell.inSchool || date >= bell.nextSchoolDay) {
    return null;
  }

  // get days since January 1, 1970
  const getEpochDay = (ofDate: Date) => Math.floor(ofDate.getTime() / 1000 / 60 / 60 / 24);

  // if school resumes on the same day or the next day, use 'today' or 'tomorrow' instead of the date
  let str;
  if (bell.isSchoolDay && bell.period!.beforeSchool /* FIXME(Bell.schoolDay) */) {
    str = '\ntoday';
  } else {
    const dayDifference = getEpochDay(bell.nextSchoolDay) - getEpochDay(date);
    if (dayDifference === 1) {
      str = '\ntomorrow';
    } else {
      str = formatDate(bell.nextSchoolDay);
    }
  }
  return `School resumes ${str}`;
}

export function getSecondsUntilTargetPeriod(bell: Bell, date: Date): number {
  if (bell.inSchool) {
    // @ts-ignore FIXME(period-enum)
    return periodToSeconds(bell.period!.end);
  }
  // if not currently in school, return seconds left until school starts
  const { isSchoolDay, period, nextSchoolDay } = bell;
  let dayDifference = 0;

  // if before school, get the seconds until the first period today
  let nextBell = bell;

  // if no school or after school, get the first period on the next school day
  if (!isSchoolDay || period!.afterSchool) {
    dayDifference = Math.floor(
      (nextSchoolDay.getTime() - date.getTime())
      / 1000
      / 60
      / 60
      / 24,
    );
    nextBell = new Bell(nextSchoolDay);
  }

  // return the start time of the next first period + 24 hours for each day elapsed in between
  const firstPeriod = nextBell.schedule!.start[0];
  return periodToSeconds(firstPeriod) + dayDifference * 24 * 60 * 60;
}
