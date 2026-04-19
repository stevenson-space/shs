import { z } from "zod";

export const DayMenu = z.object({
  comfort: z.string(),
  mindful: z.string(),
  sides: z.tuple([z.string(), z.string()]),
  soup: z.tuple([z.string(), z.string()]),
  international: z.string(),
});

export type DayMenu = z.infer<typeof DayMenu>;
