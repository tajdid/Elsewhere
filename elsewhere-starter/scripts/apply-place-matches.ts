// Save the Google place IDs the owner confirmed in scripts/place-matches.csv (confirm = "yes") to
// src/data/google-places.json. Rows without "yes" are ignored, so an unchecked guess never reaches the site.
//
//   npx tsx scripts/apply-place-matches.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { parseCsv } from './lib/csv';

const file = 'src/data/google-places.json';
const rows = parseCsv(readFileSync('scripts/place-matches.csv', 'utf8'));
const [header, ...body] = rows;
const col = (name: string) => header.indexOf(name);
const saved = JSON.parse(readFileSync(file, 'utf8')) as Record<string, { googlePlaceId: string; confirmedAt: string; googleName: string }>;
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' });
let added = 0;
for (const r of body) {
  if (r[col('confirm')]?.trim().toLowerCase() !== 'yes' || !r[col('google_place_id')]) continue;
  saved[r[col('id')]] = { googlePlaceId: r[col('google_place_id')], confirmedAt: today, googleName: r[col('google_name')] };
  added++;
}
writeFileSync(file, JSON.stringify(saved, null, 2) + '\n');
console.log(`Saved ${added} confirmed place IDs to ${file} (${Object.keys(saved).length} in total). Run npm run build to check.`);
