import { FoodInformation, MenuItem } from "./types";

export type NutritionalDatabase = Record<string, FoodInformation>;
export type MenuDatabase = MenuItem[];

export type EagerComponentModules = Record<string, { default: unknown[] }>;
type EagerMenuModules = Record<string, { default: unknown[] }>;

export function buildNutritionalDatabase(modules: EagerComponentModules): NutritionalDatabase {
  const db: NutritionalDatabase = {};

  for (const { default: items } of Object.values(modules)) {
    for (const item of items) {
      const parsed = FoodInformation.parse(item);
      db[parsed.metadata.name] = parsed;
    }
  }

  return db;
}

export function buildMenuDatabase(modules: EagerMenuModules): MenuDatabase {
  return Object.values(modules).flatMap(({ default: items }) =>
    items.map(item => MenuItem.parse(item))
  );
}
