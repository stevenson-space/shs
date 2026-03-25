import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { z } from 'zod'

const WeatherDaySchema = z.object({
  day: z.string(),
  temp_high: z.number(),
  temp_low: z.number(),
  rain_percent: z.number(),
  cloudcover: z.number(),
})

const WeatherDataSchema = z.object({
  currentTemp: z.number(),
  today: WeatherDaySchema,
  forecast: z.tuple([WeatherDaySchema, WeatherDaySchema]),
})

const RawWeatherSchema = z.object({
  current: z.object({
    temperature_2m: z.number(),
  }),
  hourly: z.object({
    cloudcover: z.array(z.number()).min(72),
  }),
  daily: z.object({
    time: z.array(z.string()).min(3),
    temperature_2m_max: z.array(z.number()).min(3),
    temperature_2m_min: z.array(z.number()).min(3),
    precipitation_probability_max: z.array(z.number()).min(3),
  }),
})

const CachedWeatherSchema = z.object({
  timestamp: z.number(),
  data: WeatherDataSchema,
})

export type WeatherDay = z.infer<typeof WeatherDaySchema>
export type WeatherData = z.infer<typeof WeatherDataSchema>
type CachedWeather = z.infer<typeof CachedWeatherSchema>

export type WidgetState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'loaded'; data: WeatherData }

const CACHE_KEY = 'weatherDataCache_v2'
const CACHE_TTL = 6 * 60 * 60 * 1000

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function dayAbbr(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return DAYS[new Date(y, m - 1, d).getDay()] ?? ''
}

export async function fetchWeatherData(): Promise<WeatherData> {
  const now = new Date()
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const start = fmt(now)
  const end = fmt(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2))
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=42.26&longitude=-87.84` + // Stevenson High School, Lincolnshire IL
    `&current=temperature_2m` +
    `&hourly=cloudcover` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&temperature_unit=fahrenheit` +
    `&start_date=${start}&end_date=${end}&timezone=auto`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather fetch failed: ${res.status}`)
  const raw = RawWeatherSchema.parse(await res.json())

  const days: WeatherDay[] = [0, 1, 2].map((i) => {
    const slice = raw.hourly.cloudcover.slice(i * 24, (i + 1) * 24)
    const avgCloud = Math.round(
      slice.reduce((a, c) => a + c, 0) / slice.length
    )
    return {
      day: dayAbbr(raw.daily.time[i]),
      temp_high: Math.round(raw.daily.temperature_2m_max[i]),
      temp_low: Math.round(raw.daily.temperature_2m_min[i]),
      rain_percent: raw.daily.precipitation_probability_max[i],
      cloudcover: avgCloud,
    }
  })

  return {
    currentTemp: Math.round(raw.current.temperature_2m),
    today: days[0],
    forecast: [days[1], days[2]],
  }
}

export function useWeatherData(): { state: Ref<WidgetState> } {
  const state = ref<WidgetState>({ status: 'loading' })

  onMounted(async () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const cached: CachedWeather = CachedWeatherSchema.parse(JSON.parse(raw))
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          state.value = { status: 'loaded', data: cached.data }
          return
        }
      }
    } catch (e) {
      console.warn('WeatherWidget: failed to parse cached data', e)
    }

    try {
      const data = await fetchWeatherData()
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), data })
      )
      state.value = { status: 'loaded', data }
    } catch (e) {
      console.warn('WeatherWidget: failed to fetch weather data', e)
      state.value = { status: 'error' }
    }
  })

  return { state }
}
