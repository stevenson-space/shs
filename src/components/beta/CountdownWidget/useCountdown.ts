import { ref, computed, onUnmounted, toValue, type MaybeRefOrGetter } from 'vue'

export type Unit = { value: string; label: string }

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatTargetDate(date: Date): string {
  const month = MONTH_NAMES[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  let hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  const mm = minutes.toString().padStart(2, '0')
  return `${month} ${day}, ${year} \u00b7 ${hours}:${mm} ${ampm}`
}

function computeMonthsAndRemainder(now: Date, target: Date) {
  let months = (target.getFullYear() - now.getFullYear()) * 12
    + (target.getMonth() - now.getMonth())

  const advanced = new Date(now)
  advanced.setMonth(advanced.getMonth() + months)
  if (advanced.getTime() > target.getTime()) {
    months--
    advanced.setTime(now.getTime())
    advanced.setMonth(advanced.getMonth() + months)
  }

  const remainingMs = target.getTime() - advanced.getTime()
  const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remainingMs - days * 24 * 60 * 60 * 1000) / (1000 * 60 * 60))
  return { months, days, hours }
}

function computeUnits(now: Date, target: Date): { units: [Unit, Unit, Unit]; isEnded: boolean } {
  const diffMs = target.getTime() - now.getTime()

  if (diffMs <= 0) {
    return {
      units: [
        { value: pad(0), label: 'Hrs' },
        { value: pad(0), label: 'Min' },
        { value: pad(0), label: 'Sec' },
      ],
      isEnded: true,
    }
  }

  const totalSeconds = Math.floor(diffMs / 1000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalDays = Math.floor(totalHours / 24)

  if (totalDays >= 28) {
    const { months, days, hours } = computeMonthsAndRemainder(now, target)
    if (months > 0) {
      return {
        units: [
          { value: pad(months), label: months === 1 ? 'Month' : 'Months' },
          { value: pad(days), label: days === 1 ? 'Day' : 'Days' },
          { value: pad(hours), label: 'Hrs' },
        ],
        isEnded: false,
      }
    }
  }

  if (totalDays > 0) {
    return {
      units: [
        { value: pad(totalDays), label: totalDays === 1 ? 'Day' : 'Days' },
        { value: pad(totalHours - totalDays * 24), label: 'Hrs' },
        { value: pad(totalMinutes - totalHours * 60), label: 'Min' },
      ],
      isEnded: false,
    }
  }

  return {
    units: [
      { value: pad(totalHours), label: 'Hrs' },
      { value: pad(totalMinutes - totalHours * 60), label: 'Min' },
      { value: pad(totalSeconds - totalMinutes * 60), label: 'Sec' },
    ],
    isEnded: false,
  }
}

export function useCountdown(targetDate: MaybeRefOrGetter<Date>, initialNow?: Date) {
  const now = ref(initialNow ?? new Date())

  const interval = setInterval(() => {
    const target = toValue(targetDate)
    if (target.getTime() <= Date.now()) {
      clearInterval(interval)
    }
    now.value = new Date()
  }, 1000)
  onUnmounted(() => clearInterval(interval))

  const result = computed(() => computeUnits(now.value, toValue(targetDate)))
  const units = computed(() => result.value.units)
  const isEnded = computed(() => result.value.isEnded)
  const formattedDate = computed(() => formatTargetDate(toValue(targetDate)))

  return { units, isEnded, formattedDate }
}
