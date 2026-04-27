import rawEvents from '@/data/events.json'
import allSchedules from '@/data/schedules.json'

const allEvents: Record<string, any[]> = {}
for (const event of rawEvents as any[]) {
  const t = event.timing
  const date: Date = t.allDay
    ? (() => { const [y, m, d] = t.date.split('-').map(Number); return new Date(y, m - 1, d) })()
    : new Date(t.start)
  const key = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  if (!allEvents[key]) allEvents[key] = []
  allEvents[key].push(event)
}

function getSpecialSchedule(year: number, month: number, day: number): object | null {
  const dateKey = `${month + 1}/${day}/${year}`
  for (const schedule of allSchedules) {
    if (!schedule.isSpecial) continue
    if ((schedule.dates as string[]).includes(dateKey)) {
      return schedule
    }
  }
  return null
}

export function makeDates(year: number, month: number, today: Date = new Date()) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dates: any[] = []
  for (let i = 0; i < firstDay; i++) dates.push(i)
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d)
    const dateString = `${month + 1}/${d}/${year}`
    dates.push({
      dateString,
      date: d,
      schedule: getSpecialSchedule(year, month, d),
      events: allEvents[dateString] ?? [],
      isToday: dateObj.toDateString() === today.toDateString(),
    })
  }
  return dates
}
