import type { EagerComponentModules, MenuDatabase, NutritionalDatabase } from "./database";
import { FoodInformation } from "./types";

export interface DuplicateKeyError {
  key: string;
  firstFile: string;
  secondFile: string;
}

export type UnusedNutritionalEntry = string;

export interface MissingComponentError {
  menuItem: string;
  station: string;
  component: string;
}


export function checkNoDuplicateNutritionalKeys(modules: EagerComponentModules): DuplicateKeyError[] {
  const seen = new Map<string, string>();
  const errors: DuplicateKeyError[] = [];

  for (const [file, { default: items }] of Object.entries(modules)) {
    for (const raw of items) {
      const key = FoodInformation.parse(raw).metadata.name;
      if (seen.has(key)) {
        errors.push({ key, firstFile: seen.get(key)!, secondFile: file });
      } else {
        seen.set(key, file);
      }
    }
  }

  return errors;
}

export function checkAllComponentsExist(menu: MenuDatabase, nutritionalDb: NutritionalDatabase): MissingComponentError[] {
  const errors: MissingComponentError[] = [];

  for (const item of menu) {
    for (const component of item.components) {
      if (!(component.item in nutritionalDb)) {
        errors.push({ menuItem: item.name, station: item.station, component: component.item });
      }
    }
  }

  return errors;
}

export function checkAllNutritionalEntriesUsed(nutritionalDb: NutritionalDatabase, menu: MenuDatabase): UnusedNutritionalEntry[] {
  const used = new Set(menu.flatMap(item => item.components.map(c => c.item)));
  return Object.keys(nutritionalDb).filter(key => !used.has(key));
}
