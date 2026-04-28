import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scrapeRange } from './scrape-calendar';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const fromIdx = args.indexOf('--from');
const toIdx = args.indexOf('--to');

if (fromIdx === -1 || fromIdx + 1 >= args.length || toIdx === -1 || toIdx + 1 >= args.length) {
  console.error('Usage: events-old.ts --from YYYY-MM --to YYYY-MM');
  process.exit(1);
}

const from = args[fromIdx + 1];
const to = args[toIdx + 1];

const outPath = resolve(__dirname, '../src/data/events_old.json');
const events = await scrapeRange(from, to);
if (events.length === 0) throw new Error('Fetched 0 events');
writeFileSync(outPath, JSON.stringify(events, null, 2));
console.log(`Saved ${events.length} events to events_old.json`);
