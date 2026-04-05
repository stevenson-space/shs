import { FoodInformation, MenuItem } from "./types";

export type NutritionalDatabase = Record<string, FoodInformation>;
export type MenuDatabase = MenuItem[];

type EagerComponentModules = Record<string, { default: FoodInformation[] }>;

export function buildNutritionalDatabase(modules: EagerComponentModules): NutritionalDatabase {
  const db: NutritionalDatabase = {};

  for (const { default: items } of Object.values(modules)) {
    for (const item of items) {
      db[item.metadata.name] = item;
    }
  }

  return db;
}
