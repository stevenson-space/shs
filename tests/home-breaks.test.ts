import { describe, expect, it } from "vitest";
import { findBreaks } from "../src/components/home/breaks";
import { loadDayOffNamer, loadLastDayOfSchool } from "../src/components/home/calendarNames";

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d);
const short = (date: Date | null) => (date ? `${date.getMonth() + 1}/${date.getDate()}` : null);

describe("big breaks in the 2026-27 school year", () => {
  it("finds Thanksgiving, Winter, Spring and Summer, and skips long weekends", async () => {
    const from = day(2026, 10, 7);
    const breaks = findBreaks({
      from,
      nameFor: await loadDayOffNamer(),
      lastDayOfSchool: await loadLastDayOfSchool(from),
    });

    expect(breaks.map((b) => [b.name, short(b.start), short(b.end), short(b.back)])).toEqual([
      ["Thanksgiving Break", "11/25", "11/29", "11/30"],
      ["Winter Break", "12/19", "1/5", "1/6"],
      ["Spring Break", "3/19", "3/28", "3/29"],
      ["Summer Break", "5/27", null, null],
    ]);
  });

  it("still lists a break while it is happening", async () => {
    const breaks = findBreaks({ from: day(2026, 12, 23), nameFor: await loadDayOffNamer() });
    expect(breaks[0].name).toBe("Winter Break");
    expect(short(breaks[0].start)).toBe("12/19");
  });

  it("drops a break once it is over", async () => {
    const breaks = findBreaks({ from: day(2026, 12, 1), nameFor: await loadDayOffNamer() });
    expect(breaks.map((b) => b.name)).not.toContain("Thanksgiving Break");
  });
});
