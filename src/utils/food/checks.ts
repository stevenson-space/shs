import type { EagerComponentModules, MenuDatabase, NutritionalDatabase } from "./database";
import { FoodInformation, type HiddenReason } from "./types";

export interface DuplicateKeyError {
  key: string;
  firstFile: string;
  secondFile: string;
  conflict: boolean;
}

export interface UnusedNutritionalEntry {
  key: string;
  file: string;
}

export interface MissingComponentError {
  menuItem: string;
  station: string;
  component: string;
  hidden?: HiddenReason;
}

export type ZeroPriceError = string;


export function checkNoDuplicateNutritionalKeys(modules: EagerComponentModules): DuplicateKeyError[] {
  const seen = new Map<string, { file: string; data: FoodInformation }>();
  const errors: DuplicateKeyError[] = [];

  for (const [file, { default: items }] of Object.entries(modules)) {
    for (const raw of items) {
      const parsed = FoodInformation.parse(raw);
      const key = parsed.metadata.name;
      if (seen.has(key)) {
        const first = seen.get(key)!;
        const conflict = JSON.stringify(first.data) !== JSON.stringify(parsed);
        errors.push({ key, firstFile: first.file, secondFile: file, conflict });
      } else {
        seen.set(key, { file, data: parsed });
      }
    }
  }

  return errors;
}

export function checkAllComponentsExist(menu: MenuDatabase, nutritionalDb: NutritionalDatabase): MissingComponentError[] {
  const errors: MissingComponentError[] = [];

  for (const item of menu) {
    for (const component of item.components) {
      const entry = nutritionalDb[component.item];
      if (entry === undefined) {
        errors.push({ menuItem: item.name, station: item.station, component: component.item });
      } else if (entry.metadata.hidden !== undefined) {
        errors.push({ menuItem: item.name, station: item.station, component: component.item, hidden: entry.metadata.hidden });
      }
    }
  }

  return errors;
}

export function checkNoZeroPriceItems(menu: MenuDatabase): ZeroPriceError[] {
  return menu.filter(item => item.price === 0).map(item => item.name);
}

export function checkAllNutritionalEntriesUsed(modules: EagerComponentModules, nutritionalDb: NutritionalDatabase, menu: MenuDatabase, skipHidden = true): UnusedNutritionalEntry[] {
  const used = new Set(menu.flatMap(item => item.components.map(c => c.item)));

  const keyToFile = new Map<string, string>();
  for (const [file, { default: items }] of Object.entries(modules)) {
    for (const raw of items) {
      const parsed = FoodInformation.parse(raw);
      keyToFile.set(parsed.metadata.name, file);
    }
  }

  return Object.keys(nutritionalDb)
    .filter(key => {
      if (skipHidden && nutritionalDb[key].metadata.hidden !== undefined) return false;
      return !used.has(key);
    })
    .map(key => ({ key, file: keyToFile.get(key) ?? 'unknown' }));
}
