import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scrapeIcal } from './scrape-ical';
import calendars from '../src/data/calendars.json';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../src/data/events.json');
const url = calendars.all;

const events = await scrapeIcal(url);
if (events.length === 0) throw new Error('Fetched 0 events');
writeFileSync(outPath, JSON.stringify(events, null, 2));
console.log(`Saved ${events.length} events to events.json`);
