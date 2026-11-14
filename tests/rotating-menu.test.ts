import { describe, expect, it } from "vitest";
import { rotatingMenuMap } from "../src/utils/food/rotating-map";

describe("September 2026 lunch calendar", () => {
  it("serves the published September 14 menu", () => {
    expect(rotatingMenuMap.getMenuUnchecked(new Date(2026, 8, 14))).toEqual({
      comfort: "Cheese Tortellini",
      mindful: "Lemon Garlic Baked Chicken",
      sides: ["Roasted Carrots", "Roasted Red Potatoes"],
      soup: ["Smoky Poblano", "Chicken Noodle"],
      international: "Asian Bowl",
      special: "Sushi",
    });
  });

  it.each([
    [31, 7, "Macaroni and Cheese Bowl", "Street Corn Soup"],
    [7, 8, "Mediterranean", "Garden Vegetable Soup"],
    [14, 8, "Asian Bowl", "Smoky Poblano"],
    [21, 8, "Pasta Bowl", "Chicken & Dumplings"],
    [28, 8, "Burrito Bowl", "Lasagna Soup"],
  ])("keeps the rotation consistent for the week beginning %s/%s", (day, month, station, soup) => {
    for (let weekday = 0; weekday < 5; weekday++) {
      const menu = rotatingMenuMap.getMenuUnchecked(new Date(2026, month, day + weekday));
      expect(menu.international).toBe(station);
      expect(menu.soup[0]).toBe(soup);
    }
  });

  it.each([
    [18, "Southwest Beefy Mac and Cheese", "Blackened Tilapia"],
    [28, "Vegetarian Paella", "Baked Chicken Parmesan"],
  ])("serves the updated entrees on September %s", (day, comfort, mindful) => {
    const menu = rotatingMenuMap.getMenuUnchecked(new Date(2026, 8, day));
    expect(menu.comfort).toBe(comfort);
    expect(menu.mindful).toBe(mindful);
  });
});
