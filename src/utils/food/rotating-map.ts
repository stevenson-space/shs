import { DayMenu, RotatingStation, WeeklyEntries, SpecialStationEntries, WEEKS_COUNT } from "./rotating-schema";

import comfort from "../../data/lunch-rotating/comfort.json";
import mindful from "../../data/lunch-rotating/mindful.json";
import sides from "../../data/lunch-rotating/sides.json";
import soup from "../../data/lunch-rotating/soup.json";
import international from "../../data/lunch-rotating/international.json";
import special from "../../data/lunch-rotating/special.json";

export class RotatingMenuMap {
  validFrom: Date
  validTo: Date
  // what's a date beween first semester and second?
  semesterSwitch: Date
  // which week in the lunch menu does 'validFrom' correspond to?
  offset: number
  // how many weeks before the menu loops back
  cycle_period: number
  stations: Record<RotatingStation, WeeklyEntries>
  special: SpecialStationEntries

  constructor(validFrom: Date, validTo: Date, semesterSwitch: Date, offset: number, stations: Record<RotatingStation, unknown>, special: unknown, cycle_period: number = 5) {
    if (validFrom >= validTo) {
      throw new RangeError("validFrom must be before validTo");
    }

    if (validFrom > semesterSwitch || semesterSwitch > validTo) {
      throw new RangeError("semesterSwitch must be a valid date");
    }

    if (!Number.isInteger(offset) || 0 > cycle_period) {
      throw new RangeError("cycle period must be positive integer");
    }

    if (!Number.isInteger(cycle_period) || 0 > offset || offset >= cycle_period) {
      throw new RangeError("offset must be integer in [0,cycle_period)");
    }

    this.validFrom = validFrom;
    this.validTo = validTo;
    this.semesterSwitch = semesterSwitch;
    this.offset = offset;
    this.cycle_period = cycle_period

    this.stations = Object.fromEntries(
      RotatingStation.options.map(key => [key, WeeklyEntries.parse(stations[key])])
    ) as Record<RotatingStation, WeeklyEntries>;

    this.special = SpecialStationEntries.parse(special);
  }

  private weeksSince(date: Date) {
    return Math.floor((date.getTime() - this.validFrom.getTime()) / (7 * 24 * 60 * 60 * 1000));
  }

  private currentWeekIndex(date: Date) {
    return (this.weeksSince(date) + this.offset) % this.cycle_period;
  }

  getMenuUnchecked(date: Date): DayMenu {
    if (date < this.validFrom || date > this.validTo) {
      throw new RangeError(`date ${date.toDateString()} is outside valid range`);
    }

    const day = (date.getDay() + 6) % 7; // mon = 0, fri = 4
    if (day >= 5) {
      throw new RangeError(`date ${date.toDateString()} is a weekend`);
    }

    const week = this.currentWeekIndex(date);

    return {
      ...Object.fromEntries(
        RotatingStation.options.map(key => {
          const entry = this.stations[key];
          const item = entry.cadence === "weekly"
            ? entry.data[week]
            : entry.data[week][day];
          return [key, item];
        })
      ),
      special: (date < this.semesterSwitch)
        ? this.special[0][day]
        : this.special[1][day],
    } as DayMenu;
  }
}

export const rotatingMenuMap = new RotatingMenuMap(
  // months here are zero indexed!
  new Date(2026, 7, 11),
  new Date(2027, 4, 31),
  new Date(2027, 0, 1),
  0,
  { comfort, mindful, sides, soup, international },
  special,
);

// can't use assert in client code; this is fine
if (rotatingMenuMap.cycle_period !== WEEKS_COUNT) {
  throw new Error("cycle_period must match WEEKS_COUNT in rotating-schema.ts");
}

