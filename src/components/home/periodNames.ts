import { computed, reactive } from 'vue';

/*
  The student's own classes: a name ("3" -> "Linear Algebra") and an
  optional room for each period, typed in by the student and kept in this
  browser only. Half periods (3A / 3B) share their full period's class.
  Shown in the Schedule widget and in the header above the countdown.
*/

const NAMES_KEY = 'periodNames';
const ROOMS_KEY = 'periodRooms';
const MAX_LENGTH = 28;
const MAX_ROOM_LENGTH = 10;

const names = reactive<Record<string, string>>({});
const rooms = reactive<Record<string, string>>({});
let loaded = false;

function read(key: string, into: Record<string, string>, maxLength: number): void {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      Object.entries(parsed).forEach(([period, value]) => {
        if (typeof value === 'string' && value.trim()) {
          into[period] = value.slice(0, maxLength);
        }
      });
    }
  } catch {
    // a corrupt value just means nothing saved
  }
}

function load(): void {
  if (loaded) return;
  loaded = true;
  read(NAMES_KEY, names, MAX_LENGTH);
  read(ROOMS_KEY, rooms, MAX_ROOM_LENGTH);
}

// "3", "3A" and "3B" all map to "3"; special periods ("!Activity") have no key.
export function periodKey(period: string): string | null {
  const match = /^(\d+)[A-Za-z]?$/.exec(period.trim());
  return match ? match[1] : null;
}

function nameFor(period: string): string {
  const key = periodKey(period);
  return key ? names[key] ?? '' : '';
}

function roomFor(period: string): string {
  const key = periodKey(period);
  return key ? rooms[key] ?? '' : '';
}

function store(key: string, into: Record<string, string>, period: string, value: string, maxLength: number): void {
  const cleaned = value.replace(/\s+/g, ' ').trim().slice(0, maxLength);

  if (cleaned) {
    into[period] = cleaned;
  } else {
    delete into[period];
  }

  try {
    localStorage.setItem(key, JSON.stringify(into));
  } catch (error) {
    console.error('Failed to save your classes:', error);
  }
}

function setName(period: string, value: string): void {
  store(NAMES_KEY, names, period, value, MAX_LENGTH);
}

function setRoom(period: string, value: string): void {
  store(ROOMS_KEY, rooms, period, value, MAX_ROOM_LENGTH);
}

// "AP Biology · 2123", just the name, or '' when nothing is set
function labelFor(period: string): string {
  const name = nameFor(period);
  const room = roomFor(period);
  if (!name) return '';
  return room ? `${name} · ${room}` : name;
}

const hasAny = computed(() => Object.keys(names).length > 0);

export type PeriodNames = {
  names: Record<string, string>;
  rooms: Record<string, string>;
  nameFor: (period: string) => string;
  roomFor: (period: string) => string;
  labelFor: (period: string) => string;
  setName: (period: string, value: string) => void;
  setRoom: (period: string, value: string) => void;
  hasAny: typeof hasAny;
  maxLength: number;
  maxRoomLength: number;
};

export function usePeriodNames(): PeriodNames {
  load();
  return {
    names,
    rooms,
    nameFor,
    roomFor,
    labelFor,
    setName,
    setRoom,
    hasAny,
    maxLength: MAX_LENGTH,
    maxRoomLength: MAX_ROOM_LENGTH,
  };
}
