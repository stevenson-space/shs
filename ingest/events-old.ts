import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { scrapeRange } from './scrape-calendar';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const from = args[args.indexOf('--from') + 1];
const to = args[args.indexOf('--to') + 1];

if (!from || !to) {
  console.error('Usage: events-old.ts --from YYYY-MM --to YYYY-MM');
  process.exit(1);
}

const outPath = resolve(__dirname, '../src/data/events_old.json');
const events = await scrapeRange(from, to);
if (events.length === 0) throw new Error('Fetched 0 events');
writeFileSync(outPath, JSON.stringify(events, null, 2));
console.log(`Saved ${events.length} events to events_old.json`);
