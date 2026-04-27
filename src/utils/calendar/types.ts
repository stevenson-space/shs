import { z } from "zod";

export const EventCategory = z.enum([
  "Activity Period",
  "Athletics",
  "CCC",
  "Clubs and Activities",
  "Early Dismissal",
  "Fine Arts",
  "Foundation Events",
  "Fundraisers",
  "Late Arrival",
  "Non-Attendance Days",
  "Orientations",
  "Parent Calendar",
  "Student Check-In Days",
  "Summer School",
  "Testing Day",
]);

export const EventSource = z.discriminatedUnion("type", [
  z.object({ type: z.literal("scraper"), occurId: z.number().int() }),
  z.object({ type: z.literal("ical"), iCalUid: z.string() }),
  z.object({ type: z.literal("merged"), occurId: z.number().int(), iCalUid: z.string() }),
]);

export const EventTiming = z.discriminatedUnion("allDay", [
  z.object({ allDay: z.literal(true),  date: z.string().date() }),
  z.object({ allDay: z.literal(false), start: z.coerce.date(), end: z.coerce.date().nullable() })
    .refine(({ start, end }) => end === null || start <= end, {
      message: "start must be before or equal to end",
    }),
]);

export const CalendarEvent = z.object({
  source: EventSource,
  title: z.string(),
  categories: z.array(EventCategory),
  timing: EventTiming,
  location: z.string().nullable(),
  description: z.string().nullable(),
});

export type EventSource = z.infer<typeof EventSource>;
export type EventCategory = z.infer<typeof EventCategory>;
export type EventTiming = z.infer<typeof EventTiming>;
export type CalendarEvent = z.infer<typeof CalendarEvent>;
