import {Theme, ThemeStyling} from "@/utils/types";
import lightBaseTheme from "@/themes/base/light.json";
import darkBaseTheme from "@/themes/base/dark.json";

export function fallbackStyling(styling: ThemeStyling): ThemeStyling {
  if (styling.base === "light" || styling.base === undefined) {
    return (lightBaseTheme as Theme).styling;
  } else if (styling.base === "dark") {
    return (darkBaseTheme as Theme).styling;
  } else {
    throw new Error(`Invalid base theme: ${styling.base}`);
  }
}

/**
 * Parses a date string in the format "MM/DD" or "MM/DD/YYYY" relative to a reference date
 * @param dateStr - Date string to parse
 * @param referenceDate - Reference date to use for year if not specified
 * @returns Date object
 */
export function parseThemeDate(dateStr: string, referenceDate: Date): Date {
  const parts = dateStr.split('/').map(Number);
  const [month, day, year] = parts;

  if (year !== undefined) {
    return new Date(year, month - 1, day);
  }
  return new Date(referenceDate.getFullYear(), month - 1, day);
}

/**
 * Parses a date range string and returns start and end dates
 * @param dateRange - Date range string in format "MM/DD-MM/DD" or "MM/DD/YYYY-MM/DD/YYYY"
 * @param referenceDate - Reference date to use for year if not specified
 * @returns Tuple of [start, end] dates
 */
export function parseDateRange(dateRange: string, referenceDate: Date): [Date, Date] {
  const [startStr, endStr] = dateRange.split('-');
  return [
    parseThemeDate(startStr, referenceDate),
    parseThemeDate(endStr, referenceDate),
  ];
}

/**
 * Checks if a date is within a given range
 * @param date - Date to check
 * @param start - Start of range
 * @param end - End of range
 * @returns True if date is within range (inclusive)
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

/**
 * Formats a date range for display
 * @param dateRange - Date range string in format "MM/DD-MM/DD" or "MM/DD/YYYY-MM/DD/YYYY"
 * @returns Formatted string like "Jan 1 - Feb 14" or "Jan 1 2025 - Feb 14 2025"
 */
export function formatDateRange(dateRange: string): string {
  const [startStr, endStr] = dateRange.split('-');

  const formatDate = (dateStr: string): string => {
    const parts = dateStr.split('/').map(Number);
    const [month, day, year] = parts;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (year !== undefined) {
      return `${monthNames[month - 1]} ${day} ${year}`;
    }
    return `${monthNames[month - 1]} ${day}`;
  };

  return `${formatDate(startStr)} - ${formatDate(endStr)}`;
}

/**
 * Loads all theme files from the themes directory
 * @returns Promise that resolves to array of theme objects
 */
export async function loadAllThemes(): Promise<any[]> {
  const baseThemeModules = import.meta.glob('@/themes/base/*.json', { eager: true });
  const regularThemeModules = import.meta.glob('@/themes/*.json', { eager: true });

  const allModules = { ...baseThemeModules, ...regularThemeModules };

  return Object.values(allModules)
    .map((module: any) => module.default)
    .filter(theme => theme.visibility !== 'hide');
}
