
export function getNameWithoutConflicts(name, doesNameExistFunction) {
  let newName = name;
  for (let i = 2; doesNameExistFunction(newName); i++) {
    newName = `${name} ${i}`;
  }
  return newName;
}
