import { z } from "zod";

export const DayMenu = z.object({
  comfort: z.string(),
  mindful: z.string(),
  sides: z.tuple([z.string(), z.string()]),
  soup: z.tuple([z.string(), z.string()]),
  international: z.string(),
});

const StationItems = z.union([
  z.tuple([z.string()]),
  z.tuple([z.string(), z.string()]),
]);

export const WeekEntries = z.discriminatedUnion("cadence", [
  // not sure if StationItems union is the best way to handle this
  z.object({ cadence: z.literal("weekly"), data: StationItems }),
  z.object({ cadence: z.literal("daily"), data: z.array(StationItems).length(5) }),
]);

export type DayMenu = z.infer<typeof DayMenu>;
export type WeekEntries = z.infer<typeof WeekEntries>;
