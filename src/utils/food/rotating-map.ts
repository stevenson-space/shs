import { RotatingStation, WeeklyEntries } from "./rotating-schema";

import comfort from "../../data/lunch-rotating/comfort.json";
import mindful from "../../data/lunch-rotating/mindful.json";
import sides from "../../data/lunch-rotating/sides.json";
import soup from "../../data/lunch-rotating/soup.json";
import international from "../../data/lunch-rotating/international.json";

export class RotatingMenuMap {
  validFrom: Date
  validTo: Date
  // which week in the lunch menu does 'validFrom' correspond to?
  offset: number
  stations: Record<RotatingStation, WeeklyEntries>

  constructor(validFrom: Date, validTo: Date, offset: number, stations: Record<RotatingStation, unknown>) {
    if (validFrom >= validTo) {
      throw new RangeError("validFrom must be before validTo");
    }

    if (0 > offset || offset >= 4) {
      throw new RangeError("offset must be in [0,4)");
    }

    this.validFrom = validFrom;
    this.validTo = validTo;
    this.offset = offset;

    this.stations = Object.fromEntries(
      RotatingStation.options.map(key => [key, WeeklyEntries.parse(stations[key])])
    ) as Record<RotatingStation, WeeklyEntries>;
  }
}

export const rotatingMenuMap = new RotatingMenuMap(
  new Date("2025-08-11"),
  new Date("2026-05-22"),
  0,
  { comfort, mindful, sides, soup, international },
);
