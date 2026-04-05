import type { EagerComponentModules, MenuDatabase, NutritionalDatabase } from "./database";
import { FoodInformation } from "./types";

export interface DuplicateKeyError {
  key: string;
  firstFile: string;
  secondFile: string;
  conflict: boolean;
}

export type UnusedNutritionalEntry = string;

export interface MissingComponentError {
  menuItem: string;
  station: string;
  component: string;
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
      if (!(component.item in nutritionalDb)) {
        errors.push({ menuItem: item.name, station: item.station, component: component.item });
      }
    }
  }

  return errors;
}

export function checkNoZeroPriceItems(menu: MenuDatabase): ZeroPriceError[] {
  return menu.filter(item => item.price === 0).map(item => item.name);
}

export function checkAllNutritionalEntriesUsed(nutritionalDb: NutritionalDatabase, menu: MenuDatabase): UnusedNutritionalEntry[] {
  const used = new Set(menu.flatMap(item => item.components.map(c => c.item)));
  return Object.keys(nutritionalDb).filter(key => !used.has(key));
}
