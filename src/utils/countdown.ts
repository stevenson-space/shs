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
