import clubsData from '@/data/clubs.json';

export type Club = {
  id: string;
  clubName: string;
  room: string;
  day: string[];
  time: string;
  emails: string[];
  pseudonym?: string;
  more?: string;
  additionalDescription?: string;
};

type RawClubRecord = {
  Club?: string;
  Room?: string;
  Day?: string;
  Time?: string;
  'Club Officials Emails'?: string;
  Pseudonym?: string;
  More?: string;
  'Additional Description'?: string;
  id?: string;
  clubName?: string;
  room?: string;
  day?: string | string[];
  time?: string;
  emails?: string[] | string;
  pseudonym?: string;
  more?: string;
  additionalDescription?: string;
};

/** Converts comma-separated or array day fields into a normalized weekday list. */
function normalizeDays(day: string | string[] | undefined): string[] {
  if (Array.isArray(day)) return day.map((item) => item.trim()).filter(Boolean);
  if (!day) return [];
  return day.split(',').map((item) => item.trim()).filter(Boolean);
}

/** Converts comma-separated or array email fields into a normalized string array. */
function normalizeEmails(emails: string[] | string | undefined): string[] {
  if (Array.isArray(emails)) return emails.map((item) => item.trim()).filter(Boolean);
  if (!emails) return [];
  return emails.split(',').map((item) => item.trim()).filter(Boolean);
}

/** Maps a raw clubs.json record into the normalized Club shape used by the UI. */
function toClub(id: string, club: RawClubRecord): Club {
  return {
    id,
    clubName: club.clubName || club.Club || id,
    room: club.room || club.Room || 'TBA',
    day: normalizeDays(club.day || club.Day),
    time: club.time || club.Time || 'TBA',
    emails: normalizeEmails(club.emails || club['Club Officials Emails']),
    pseudonym: club.pseudonym || club.Pseudonym || '',
    more: club.more || club.More || '',
    additionalDescription: club.additionalDescription || club['Additional Description'] || '',
  };
}

const rawClubs = clubsData as RawClubRecord[] | Record<string, RawClubRecord>;

export const clubs: Club[] = Array.isArray(rawClubs)
  ? rawClubs.map((club, index) => toClub(club.id || `club-${index + 1}`, club))
  : Object.entries(rawClubs).map(([id, club]) => toClub(id, club));

/** Formats a club's meeting days for compact card and page display. */
export function formatClubDays(day: string[]): string {
  return day.join(', ');
}
