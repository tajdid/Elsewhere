// Place reports from visitors. Pure functions so they can be unit-tested without a browser.
import { amenityKeys, categories } from './schema';

export type Answer = 'yes' | 'no' | 'unsure';
export type AccessAnswer = 'open' | 'password' | 'signup' | 'unsure';
export const MAX_MBPS = 2000;
export interface Submission {
  version: 1;
  kind: 'new' | 'update';
  placeId: string | null;
  name: string;
  category: string;
  neighbourhood: string;
  visitedOn: string; // YYYY-MM-DD
  amenities: Record<typeof amenityKeys[number], Answer>;
  wifiDownMbps: number | null; // from the visitor's own speed test
  wifiAccess: AccessAnswer; // never the password itself
  notes: string;
  submittedAt: string; // ISO timestamp
}
export interface StoredReport extends Submission { delivery: 'sent' | 'device'; }

export const SUBMISSIONS_KEY = 'elsewhere:submissions:v1';
const MAX_STORED = 50;

/** Today's date in Dubai as YYYY-MM-DD, so "not in the future" matches the city the visit happened in. */
export function dubaiToday(now = Date.now()): string {
  return new Date(now).toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' });
}

export type FieldError = 'name' | 'neighbourhood' | 'wifiSpeed' | 'visitedOn';

/** Blank means not tested; otherwise a positive number up to MAX_MBPS, comma or point decimals. Returns undefined when invalid. */
export function parseMbps(raw?: string): number | null | undefined {
  const t = (raw ?? '').trim().replace(',', '.');
  if (!t) return null;
  if (!/^\d+(\.\d+)?$/.test(t)) return undefined;
  const n = Number(t);
  return n > 0 && n <= MAX_MBPS ? Math.round(n * 10) / 10 : undefined;
}

/** Validate raw form values. Returns the fields in error, in form order. */
export function validateSubmission(v: { name?: string; neighbourhood?: string; visitedOn?: string; wifiSpeed?: string }, now = Date.now()): FieldError[] {
  const errors: FieldError[] = [];
  if (!v.name?.trim()) errors.push('name');
  if (!v.neighbourhood?.trim()) errors.push('neighbourhood');
  if (parseMbps(v.wifiSpeed) === undefined) errors.push('wifiSpeed');
  const d = v.visitedOn ?? '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d)) || d > dubaiToday(now)) errors.push('visitedOn');
  return errors;
}

/** Build a clean payload from form values: trimmed, length-capped, unknown answers become "unsure". */
export function buildSubmission(v: Record<string, string | undefined>, placeId: string | null, now = Date.now()): Submission {
  const answer = (x?: string): Answer => (x === 'yes' || x === 'no' ? x : 'unsure');
  const category = categories.includes(v.category as typeof categories[number]) ? v.category! : categories[0];
  return {
    version: 1,
    kind: placeId ? 'update' : 'new',
    placeId,
    name: (v.name ?? '').trim().slice(0, 120),
    category,
    neighbourhood: (v.neighbourhood ?? '').trim().slice(0, 80),
    visitedOn: v.visitedOn ?? '',
    amenities: Object.fromEntries(amenityKeys.map(k => [k, answer(v[k])])) as Submission['amenities'],
    wifiDownMbps: parseMbps(v.wifiSpeed) ?? null,
    wifiAccess: (['open', 'password', 'signup'] as const).find(a => a === v.wifiAccess) ?? 'unsure',
    notes: (v.notes ?? '').trim().slice(0, 600),
    submittedAt: new Date(now).toISOString(),
  };
}

/** Read stored reports, dropping anything malformed or from another version. */
export function parseReports(raw: string | null): StoredReport[] {
  try {
    const parsed: unknown = JSON.parse(raw || 'null');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((r): r is StoredReport => !!r && typeof r === 'object' && (r as StoredReport).version === 1
      && typeof (r as StoredReport).name === 'string' && typeof (r as StoredReport).submittedAt === 'string'
      && ((r as StoredReport).delivery === 'sent' || (r as StoredReport).delivery === 'device')).slice(0, MAX_STORED);
  } catch { return []; }
}

/** Newest first, capped, so local history can't grow without bound. */
export function addReport(list: StoredReport[], r: StoredReport): StoredReport[] {
  return [r, ...list].slice(0, MAX_STORED);
}
