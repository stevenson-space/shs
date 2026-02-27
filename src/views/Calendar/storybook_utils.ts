import allEvents from '@/data/events.json'
import allSchedules from '@/data/schedules.json'

// Return the special schedule for a date (matching Calendar.vue logic), or null
function getSpecialSchedule(year: number, month: number, day: number): object | null {
  const date = new Date(year, month, day)
  const dateKey = `${month + 1}/${day}/${year}`
  // Match the first special schedule whose dates array includes this date string
  // (simplified: just check exact date string match for storybook purposes)
  for (const schedule of allSchedules) {
    if (!schedule.isSpecial) continue
    if ((schedule.dates as string[]).includes(dateKey)) {
      return schedule
    }
  }
  return null
}

export function makeDates(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const dates: any[] = []
  for (let i = 0; i < firstDay; i++) dates.push(i)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d)
    // Use m/d/yyyy format — matches the real app (Calendar.vue)
    const dateString = `${month + 1}/${d}/${year}`
    const rawEvents: any[] = (allEvents as Record<string, any[]>)[dateString] ?? []
    dates.push({
      dateString,
      date: d,
      schedule: getSpecialSchedule(year, month, d),
      events: rawEvents,
      isToday: dateObj.toDateString() === today.toDateString(),
    })
  }
  return dates
}
