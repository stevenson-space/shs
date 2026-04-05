import type { EagerComponentModules, MenuDatabase, NutritionalDatabase } from "./database";

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

export function checkAllComponentsExist(menu: MenuDatabase, nutritionalDb: NutritionalDatabase): void {
  for (const item of menu) {
    for (const component of item.components) {
      if (!(component.item in nutritionalDb)) {
        console.warn(
          `Menu item "${item.name}" (${item.station}) references unknown component "${component.item}"`
        );
      }
    }
  }
}

export function checkAllNutritionalEntriesUsed(nutritionalDb: NutritionalDatabase, menu: MenuDatabase): void {
  const used = new Set(menu.flatMap(item => item.components.map(c => c.item)));

  for (const key of Object.keys(nutritionalDb)) {
    if (!used.has(key)) {
      console.warn(`Nutritional entry "${key}" is not referenced by any menu item`);
    }
  }
}
