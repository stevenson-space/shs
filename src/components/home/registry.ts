import type { Component } from 'vue';
import {
  Bell,
  Bookmark,
  Calculator,
  CalendarClock,
  CalendarCheck,
  CalendarHeart,
  CalendarDays,
  ClipboardList,
  CloudSun,
  Download,
  Dumbbell,
  FileText,
  Globe,
  GraduationCap,
  Hourglass,
  Link2,
  MonitorPlay,
  Palette,
  QrCode,
  Radio,
  School,
  Settings,
  Timer,
  UsersRound,
  Utensils,
} from 'lucide-vue-next';

import ScheduleWidget from './widgets/ScheduleWidget.vue';
import LunchWidget from './widgets/LunchWidget.vue';
import EventsWidget from './widgets/EventsWidget.vue';
import WeatherWidget from './widgets/WeatherWidget.vue';
import PwcWidget from './widgets/PwcWidget.vue';
import CountdownWidget from './widgets/CountdownWidget.vue';
import DatesWidget from './widgets/DatesWidget.vue';
import MyLinksWidget from './widgets/MyLinksWidget.vue';
import type { WidgetSize } from './layout';
import { useMyLinks } from './myLinks';
import { hostOf, kindOf, type LinkKind } from './linkCheck';

/* ------------------------------------------------------------------ */
/* Widgets                                                             */
/* ------------------------------------------------------------------ */

export type WidgetDef = {
  type: string;
  name: string;
  description: string;
  icon: Component;
  component: Component;
  // sizes the widget supports, smallest first
  sizes: WidgetSize[];
  defaultSize: WidgetSize;
  // whether more than one copy can be on the home screen
  multiple?: boolean;
  // which settings dialog (if any) the edit button opens
  settings?: 'countdown' | 'classes';
};

export const WIDGETS: WidgetDef[] = [
  {
    type: 'schedule',
    name: 'Schedule',
    description: "Today's periods with the current one highlighted. Add your class names in its settings.",
    icon: CalendarClock,
    component: ScheduleWidget,
    sizes: ['medium', 'large'],
    defaultSize: 'large',
    settings: 'classes',
  },
  {
    type: 'lunch',
    name: 'Lunch',
    description: "What's being served today.",
    icon: Utensils,
    component: LunchWidget,
    sizes: ['medium', 'large'],
    defaultSize: 'large',
  },
  {
    type: 'weather',
    name: 'Weather',
    description: 'Right now and the days ahead at Stevenson.',
    icon: CloudSun,
    component: WeatherWidget,
    sizes: ['small', 'medium', 'large'],
    defaultSize: 'medium',
  },
  {
    type: 'events',
    name: 'Upcoming',
    description: 'Late arrivals, assemblies and days off coming up.',
    icon: CalendarDays,
    component: EventsWidget,
    sizes: ['medium', 'large'],
    defaultSize: 'medium',
  },
  {
    type: 'dates',
    name: 'Breaks & Dates',
    description: 'How long until every big break, plus dates of your own: a test, prom, a deadline.',
    icon: CalendarHeart,
    component: DatesWidget,
    sizes: ['small', 'medium', 'large'],
    defaultSize: 'medium',
  },
  {
    type: 'mylinks',
    name: 'My Links',
    description: 'Your own links, like the ILC room booking form or a club sign-in. Only you see them.',
    icon: Bookmark,
    component: MyLinksWidget,
    sizes: ['small', 'medium', 'large'],
    defaultSize: 'medium',
  },
  {
    type: 'countdown',
    name: 'Countdown',
    description: 'Count down to the next day off, or any date you pick.',
    icon: Hourglass,
    component: CountdownWidget,
    sizes: ['small', 'medium'],
    defaultSize: 'small',
    multiple: true,
    settings: 'countdown',
  },
  {
    type: 'pwc',
    name: 'PWC',
    description: 'Whether the Patriot Wellness Center is open, and for how long.',
    icon: Dumbbell,
    component: PwcWidget,
    sizes: ['small', 'medium'],
    defaultSize: 'small',
  },
];

export function widgetDef(type: string): WidgetDef | undefined {
  return WIDGETS.find((def) => def.type === type);
}

/* ------------------------------------------------------------------ */
/* Shortcuts ("apps")                                                  */
/* ------------------------------------------------------------------ */

export type AppDef = {
  key: string;
  // short label shown under the icon
  label: string;
  // full name, used in the add menu and for screen readers
  name: string;
  // a page on this site...
  to?: string;
  // ...or another website...
  href?: string;
  // ...or something the home page handles itself
  action?: 'themes';
  icon: Component;
  // 'solid' is filled with the theme color, 'soft' is a light tint of it
  tone?: 'solid' | 'soft';
  // other websites get a fixed color of their own so they are easy to tell apart
  color?: string;
  // left off the home screen when the site is already installed as an app
  hideWhenInstalled?: boolean;
  // one of the student's own links (myLinks.ts): it can be edited, and shows where it goes
  custom?: boolean;
  host?: string;
};

// Shortcuts come as a plain icon, a wide button with the name beside it, or a big tile.
export const APP_SIZES: WidgetSize[] = ['icon', 'wide', 'small'];

export const APPS: AppDef[] = [
  { key: 'bell', label: 'Bell', name: 'Bell Schedules', to: '/bellschedules', icon: Bell, tone: 'solid' },
  { key: 'links', label: 'School Links', name: 'School Links', to: '/links', icon: Link2, tone: 'soft' },
  { key: 'calendar', label: 'Calendar', name: 'Calendar', to: '/calendar', icon: CalendarDays, tone: 'solid' },
  { key: 'qr', label: 'QR Codes', name: 'QR Codes', to: '/qr', icon: QrCode, tone: 'soft' },
  { key: 'gpa', label: 'GPA', name: 'GPA Calculator', to: '/GpaCalculator', icon: Calculator, tone: 'solid' },
  { key: 'themes', label: 'Themes', name: 'Switch Theme', action: 'themes', icon: Palette, tone: 'soft' },
  { key: 'install', label: 'Install', name: 'Install', to: '/install', icon: Download, tone: 'solid', hideWhenInstalled: true },
  { key: 'timer', label: 'Timer', name: 'Timer', to: '/tools', icon: Timer, tone: 'soft' },
  { key: 'jukebox', label: 'Jukebox', name: 'Jukebox', to: '/jukebox', icon: Radio, tone: 'solid' },
  { key: 'settings', label: 'Settings', name: 'Settings', to: '/settings', icon: Settings, tone: 'soft' },

  { key: 'd125', label: 'D125', name: 'D125', href: 'https://www.d125.org/', icon: School, color: '#0f766e' },
  { key: 'clubs', label: 'Clubs', name: 'Activities Database', href: 'https://stevensonclubs.space/database', icon: UsersRound, color: '#d6337a' },
];

const LINK_ICONS: Record<LinkKind, Component> = {
  form: ClipboardList,
  classroom: GraduationCap,
  doc: FileText,
  calendar: CalendarCheck,
  video: MonitorPlay,
  link: Globe,
};

// A shortcut for one of the student's own links ("link:<id>").
function customLinkDef(id: string): AppDef | undefined {
  const link = useMyLinks().find(id);
  if (!link) return undefined;

  return {
    key: `link:${link.id}`,
    label: link.name,
    name: link.name,
    href: link.url,
    icon: LINK_ICONS[kindOf(link.url)],
    tone: 'solid',
    color: link.color || undefined,
    custom: true,
    host: hostOf(link.url),
  };
}

export function appDef(type: string): AppDef | undefined {
  if (type.startsWith('link:')) return customLinkDef(type.slice(5));
  if (!type.startsWith('app:')) return undefined;
  const key = type.slice(4);
  return APPS.find((def) => def.key === key);
}

// True for any saved item this build knows how to draw.
export function isKnownType(type: string): boolean {
  return !!widgetDef(type) || !!appDef(type);
}
