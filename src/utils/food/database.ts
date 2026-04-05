import { FoodInformation, MenuItem } from "./types";

export type NutritionalDatabase = Record<string, FoodInformation>;
export type MenuDatabase = MenuItem[];

export type EagerComponentModules = Record<string, { default: FoodInformation[] }>;
type EagerMenuModules = Record<string, { default: MenuItem[] }>;

export function buildNutritionalDatabase(modules: EagerComponentModules): NutritionalDatabase {
  const db: NutritionalDatabase = {};

  for (const { default: items } of Object.values(modules)) {
    for (const item of items) {
      db[item.metadata.name] = item;
    }
  }

  return db;
}

export function buildMenuDatabase(modules: EagerMenuModules): MenuDatabase {
  return Object.values(modules).flatMap(({ default: items }) => items);
}
