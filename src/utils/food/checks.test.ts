import { describe, it, expect } from "vitest";
import { buildNutritionalDatabase, buildMenuDatabase } from "./database";
import {
  checkNoDuplicateNutritionalKeys,
  checkAllComponentsExist,
  checkAllNutritionalEntriesUsed,
  checkNoZeroPriceItems,
} from "./checks";

const componentModules = import.meta.glob<{ default: unknown[] }>("/src/data/food/components/*.json", { eager: true });
const menuModules = import.meta.glob<{ default: unknown[] }>("/src/data/food/items/*.json", { eager: true });

const nutritionalDb = buildNutritionalDatabase(componentModules);
const menu = buildMenuDatabase(menuModules);

describe("nutritional database", () => {
  it("has no duplicate keys", () => {
    expect(checkNoDuplicateNutritionalKeys(componentModules)).toEqual([]);
  });

  it("has no unused entries", () => {
    expect(checkAllNutritionalEntriesUsed(nutritionalDb, menu)).toEqual([]);
  });
});

describe("menu database", () => {
  it("all components exist in the nutritional db", () => {
    expect(checkAllComponentsExist(menu, nutritionalDb)).toEqual([]);
  });

  it("no items have a zero price", () => {
    expect(checkNoZeroPriceItems(menu)).toEqual([]);
  });
});
