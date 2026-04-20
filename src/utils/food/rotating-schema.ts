import { z } from "zod";

const WEEKS_COUNT: number = 4;
const WEEKDAYS_COUNT: number = 5;

export const DayMenu = z.object({
  comfort: z.string(),
  mindful: z.string(),
  sides: z.tuple([z.string(), z.string()]),
  soup: z.tuple([z.string(), z.string()]),
  international: z.string(),
});

export const RotatingStation = z.enum([
  "comfort", "mindful", "sides",
  "soup", "international",
]);

const WeeklyData = z.union([
  z.array(z.string()).length(WEEKS_COUNT),
  z.array(z.tuple([z.string(), z.string()])).length(WEEKS_COUNT),
]);

const DailyData = z.union([
  z.array(z.array(z.string()).length(WEEKDAYS_COUNT)).length(WEEKS_COUNT),
  z.array(z.array(z.tuple([z.string(), z.string()])).length(WEEKDAYS_COUNT)).length(WEEKS_COUNT),
]);

export const WeeklyEntries = z.discriminatedUnion("cadence", [
  z.object({ cadence: z.literal("weekly"), data: WeeklyData }),
  z.object({ cadence: z.literal("daily"), data: DailyData }),
]);

export type RotatingStation = z.infer<typeof RotatingStation>;
export type DayMenu = z.infer<typeof DayMenu>;
export type WeeklyEntries = z.infer<typeof WeeklyEntries>;
