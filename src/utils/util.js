export function getNameWithoutConflicts(name, doesNameExistFunction) {
  let newName = name;
  for (let i = 2; doesNameExistFunction(newName); i++) {
    newName = `${name} ${i}`;
  }
  return newName;
}

// Returns an empty object ({}) if it can't parse the JSON
export function tryParseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}
