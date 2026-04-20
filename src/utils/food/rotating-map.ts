import { DayMenu, RotatingStation, WeeklyEntries, SpecialStationEntries } from "./rotating-schema";

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
  stations: Record<RotatingStation, WeeklyEntries>
  special: SpecialStationEntries

  constructor(validFrom: Date, validTo: Date, semesterSwitch: Date, offset: number, stations: Record<RotatingStation, unknown>, special: unknown) {
    if (validFrom >= validTo) {
      throw new RangeError("validFrom must be before validTo");
    }

    if (validFrom > semesterSwitch || semesterSwitch > validTo) {
      throw new RangeError("semesterSwitch must be a valid date");
    }

    if (0 > offset || offset >= 4) {
      throw new RangeError("offset must be in [0,4)");
    }

    this.validFrom = validFrom;
    this.validTo = validTo;
    this.semesterSwitch = semesterSwitch;
    this.offset = offset;

    this.stations = Object.fromEntries(
      RotatingStation.options.map(key => [key, WeeklyEntries.parse(stations[key])])
    ) as Record<RotatingStation, WeeklyEntries>;

    this.special = SpecialStationEntries.parse(special);
  }

  private weeksSince(date: Date) {
    return Math.floor((date.getTime() - this.validFrom.getTime()) / (7 * 24 * 60 * 60 * 1000));
  }

  private currentWeekIndex(date: Date) {
    return (this.weeksSince(date) + this.offset) % 4;
  }

  getMenuUnchecked(date: Date): DayMenu {
    if (this.validFrom > date || date > this.validTo) {
      throw new RangeError("date must be a valid date");
    }

    const week = this.currentWeekIndex(date);
    const day = (date.getDay() + 6) % 7; // mon = 0, fri = 4

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
  new Date(2025, 7, 11),
  new Date(2026, 4, 22),
  new Date(2026, 0, 1),
  0,
  { comfort, mindful, sides, soup, international },
  special,
);
