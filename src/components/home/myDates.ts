import { ref } from 'vue';
import { createId } from './layout';

/*
  Dates that matter to the student (an AP exam, prom, a project due),
  added from the Breaks & Dates widget and kept in this browser only.
  A date stays listed through its day, then drops off by itself.
*/

export type MyDate = {
  id: string;
  title: string;
  // local date, "YYYY-MM-DD"
  date: string;
};

const STORAGE_KEY = 'myDates';

const dates = ref<MyDate[]>([]);
let loaded = false;

const isDay = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

// today as "YYYY-MM-DD", which sorts and compares like the saved dates
function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function dayOf(value: string): Date {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dates.value));
  } catch (error) {
    console.error('Failed to save your dates:', error);
  }
}

function load(): void {
  if (loaded) return;
  loaded = true;

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return;

    dates.value = parsed
      .filter((entry) => entry && typeof entry.title === 'string' && entry.title.trim() && isDay(entry.date))
      // dates that have passed are let go here, so the list never fills up with old ones
      .filter((entry) => entry.date >= todayKey())
      .map((entry) => ({ id: typeof entry.id === 'string' ? entry.id : createId(), title: entry.title.slice(0, 40), date: entry.date }));
  } catch {
    dates.value = [];
  }
}

function add(title: string, date: string): void {
  if (!title.trim() || !isDay(date)) return;
  dates.value = [...dates.value, { id: createId(), title: title.trim().slice(0, 40), date }];
  save();
}

function update(id: string, title: string, date: string): void {
  if (!title.trim() || !isDay(date)) return;
  dates.value = dates.value.map((entry) => (entry.id === id ? { ...entry, title: title.trim().slice(0, 40), date } : entry));
  save();
}

function remove(id: string): void {
  dates.value = dates.value.filter((entry) => entry.id !== id);
  save();
}

export function useMyDates() {
  load();
  return { dates, add, update, remove };
}
