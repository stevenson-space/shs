import type { EagerComponentModules } from "./database";

export function checkNoDuplicateNutritionalKeys(modules: EagerComponentModules): void {
  const seen = new Map<string, string>(); // name -> source file

  for (const [file, { default: items }] of Object.entries(modules)) {
    for (const item of items) {
      const name = item.metadata.name;
      if (seen.has(name)) {
        console.warn(
          `Duplicate nutritional DB key "${name}" found in ${file} (also seen in ${seen.get(name)})`
        );
      } else {
        seen.set(name, file);
      }
    }
  }
}
