export function getNameWithoutConflicts(name: string, doesNameExistFunction: (n: string) => boolean): string {
  let newName = name;
  for (let i = 2; doesNameExistFunction(newName); i++) {
    newName = `${name} ${i}`;
  }
  return newName;
}

// Returns an empty object ({}) if it can't parse the JSON
export function tryParseJSON(json: string): object {
  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function is2DArray(arr: unknown[]): arr is unknown[][] {
  return Array.isArray(arr[0]);
}

export function toSeconds(hour = 0, minute = 0, second = 0): number {
  return (hour * 60 + minute) * 60 + second;
}

export function formatDate(date: Date): string {
  return date
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
}

// Calculates the number of seconds since 12:00AM on given date, up to the time
// on the given date
export function dateToSeconds(date: Date): number {
  return toSeconds(date.getHours(), date.getMinutes(), date.getSeconds());
}

// period is in the format of a human readable 24-hour time string (e.g. "13:40")
export function periodToSeconds(period: string): number {
  return toSeconds(...period.split(':').map(Number));
}
