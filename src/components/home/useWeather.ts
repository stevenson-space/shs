import { ref, type Ref } from 'vue';

/*
  Forecast for Stevenson from Open-Meteo, shared by every weather widget on
  the page and cached for a few hours so the home screen opens instantly.
*/

export type WeatherDay = {
  // 'Today', then 'Mon', 'Tue'...
  label: string;
  high: number;
  low: number;
  rain: number;
  cloud: number;
};

export type Weather = {
  current: number;
  days: WeatherDay[];
};

export type WeatherState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: Weather };

const CACHE_KEY = 'weatherDataCache_v3';
const CACHE_TTL = 3 * 60 * 60 * 1000;
const DAY_COUNT = 6;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const state = ref<WeatherState>({ status: 'loading' });
let started = false;

const pad = (n: number): string => String(n).padStart(2, '0');
const isoDate = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

function isWeather(value: unknown): value is Weather {
  const weather = value as Weather;

  return !!weather
    && isNumber(weather.current)
    && Array.isArray(weather.days)
    && weather.days.length > 0
    && weather.days.every((day) => !!day
      && typeof day.label === 'string'
      && isNumber(day.high) && isNumber(day.low) && isNumber(day.rain) && isNumber(day.cloud));
}

async function fetchWeather(): Promise<Weather> {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + DAY_COUNT - 1);
  const url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=42.26&longitude=-87.84' // Stevenson High School, Lincolnshire IL
    + '&current=temperature_2m'
    + '&hourly=cloudcover'
    + '&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max'
    + '&temperature_unit=fahrenheit'
    + `&start_date=${isoDate(now)}&end_date=${isoDate(end)}&timezone=auto`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Weather fetch failed: ${response.status}`);

  const raw = await response.json();
  const days: WeatherDay[] = [];

  for (let i = 0; i < DAY_COUNT; i++) {
    const hours: number[] = (raw.hourly?.cloudcover ?? []).slice(i * 24, (i + 1) * 24);
    const [year, month, day] = String(raw.daily?.time?.[i] ?? '').split('-').map(Number);

    if (!hours.length || !year) break;

    days.push({
      label: i === 0 ? 'Today' : WEEKDAYS[new Date(year, month - 1, day).getDay()],
      high: Math.round(raw.daily.temperature_2m_max[i]),
      low: Math.round(raw.daily.temperature_2m_min[i]),
      rain: Math.round(raw.daily.precipitation_probability_max[i] ?? 0),
      cloud: Math.round(hours.reduce((sum, value) => sum + value, 0) / hours.length),
    });
  }

  const weather = { current: Math.round(raw.current?.temperature_2m), days };
  if (!isWeather(weather)) throw new Error('Weather response was missing data');
  return weather;
}

function readCache(): Weather | null {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    const fresh = cached && isNumber(cached.timestamp) && Date.now() - cached.timestamp < CACHE_TTL;
    // a cache from an earlier day would label the wrong day as "Today"
    const sameDay = cached && cached.day === isoDate(new Date());
    return fresh && sameDay && isWeather(cached.data) ? cached.data : null;
  } catch {
    return null;
  }
}

async function start(): Promise<void> {
  const cached = readCache();

  if (cached) {
    state.value = { status: 'ready', data: cached };
    return;
  }

  try {
    const data = await fetchWeather();
    state.value = { status: 'ready', data };

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), day: isoDate(new Date()), data }));
    } catch {
      // storage being full only costs us the cache
    }
  } catch (error) {
    console.warn('Weather: failed to load', error);
    state.value = { status: 'error' };
    // let the next widget that mounts try again
    started = false;
  }
}

export function useWeather(): { state: Ref<WeatherState> } {
  if (!started) {
    started = true;
    start();
  }

  return { state };
}
