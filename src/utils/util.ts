export function getNameWithoutConflicts(name: string, doesNameExistFunction: (n: string) => boolean): string {
  let newName = name;
  for (let i = 2; doesNameExistFunction(newName); i++) {
    newName = `${name} ${i}`;
  }
  return newName;
}

// Returns an empty object ({}) if it can't parse the JSON
export function tryParseJSON(json: string) {
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
