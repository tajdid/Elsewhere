// Propose a Google place for each listing that doesn't have one yet, for the owner to confirm.
// Nothing on the site changes: it writes scripts/place-matches.csv. Mark the right rows "yes" in the confirm
// column, then run scripts/apply-place-matches.ts.
//
//   npx tsx --env-file=.env.local scripts/match-places.ts      (.env.local holds GOOGLE_PLACES_API_KEY)
//
// One Text Search per place (53 at most), well inside Google's free monthly allowance.
import { writeFileSync } from 'node:fs';
import { places } from '../src/lib/places';
import { textSearch } from '../api/_lib/places.js';
import { toCsv, similarity } from './lib/csv';

const key = process.env.GOOGLE_PLACES_API_KEY;
if (!key) { console.error('Set GOOGLE_PLACES_API_KEY (for example in .env.local) and run again.'); process.exit(1); }

const header = ['id', 'list_name', 'list_area', 'google_name', 'google_address', 'google_place_id', 'name_match', 'confirm'];
const rows: string[][] = [header];
for (const p of places.filter(x => !x.googlePlaceId)) {
  const query = [p.name, p.neighbourhood, 'Dubai'].filter(Boolean).join(', ');
  let best = null;
  try { best = (await textSearch(key, query))[0] ?? null; } catch (e) { console.error(`${p.name}: ${(e as Error).message}`); }
  const score = best ? similarity(p.name, best.name) : 0;
  rows.push([p.id, p.name, p.neighbourhood, best?.name ?? '', best?.address ?? '', best?.placeId ?? '', score.toFixed(2), '']);
  console.log(`${score.toFixed(2)}  ${p.name}  →  ${best ? `${best.name} · ${best.address}` : 'no match'}`);
}
writeFileSync('scripts/place-matches.csv', toCsv(rows));
console.log(`\nWrote scripts/place-matches.csv (${rows.length - 1} places). Check each row, put "yes" in confirm for the right ones, then run scripts/apply-place-matches.ts.`);
