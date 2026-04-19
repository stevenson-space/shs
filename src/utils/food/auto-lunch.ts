import { z } from "zod";

export const DayMenu = z.object({
  comfort: z.string(),
  mindful: z.string(),
  sides: z.tuple([z.string(), z.string()]),
  soup: z.tuple([z.string(), z.string()]),
  international: z.string(),
});

export const RotatingStation = z.enum([
  "comfort", "mindful", "sides",
  "soup", "international", "special",
  // for special, not sure what the rotating station in the west is called
]);

const StationItems = z.union([
  z.tuple([z.string()]),
  z.tuple([z.string(), z.string()]),
]);

export const WeekEntries = z.discriminatedUnion("cadence", [
  // not sure if StationItems union is the best way to handle this
  z.object({ cadence: z.literal("weekly"), data: StationItems }),
  z.object({ cadence: z.literal("daily"), data: z.array(StationItems).length(5) }),
]);

export const WeekStations = z.map(RotatingStation, WeekEntries);

export const RotatingMenuMap = z.array(WeekStations).length(4);

export type RotatingStation = z.infer<typeof RotatingStation>;
export type DayMenu = z.infer<typeof DayMenu>;
export type WeekEntries = z.infer<typeof WeekEntries>;
export type WeekStations = z.infer<typeof WeekStations>;
export type RotatingMenuMap = z.infer<typeof RotatingMenuMap>;
