import type Bell from '@/utils/bell';
import { rotatingMenuMap } from './rotating-map';

// Station name -> what it serves, in the order the menu lists them.
export type LunchMenu = Record<string, string[]>;

// The lunch served on `date`, or null when there is none (no school, summer,
// a weekend, or a date outside the rotating menu's range).
export function getLunchMenu(date: Date, bell: Bell | null | undefined): LunchMenu | null {
  if (!bell?.isSchoolDay || bell?.type === 'Summer') return null;

  try {
    const menu = rotatingMenuMap.getMenuUnchecked(date);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      'Comfort Food': [menu.comfort],
      'Mindful': [menu.mindful],
      'Sides': menu.sides,
      'Soup': menu.soup,
      'International': [menu.international],
      'Special': [`${menu.special} ${dayOfWeek}`],
    };
  } catch (e) {
    // outside the menu's dates there's just no lunch to show; not worth logging,
    // since callers re-check on every clock tick
    if (e instanceof RangeError) return null;
    throw e;
  }
}
