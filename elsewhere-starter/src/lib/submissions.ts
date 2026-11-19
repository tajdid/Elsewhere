// Place reports from visitors. Pure functions so they can be unit-tested without a browser.
import { amenityKeys, categories, dayKeys, noiseLevels, type DayKey } from './schema';

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
  wifiAccess: AccessAnswer; // the guest password, if given, is sent separately and not kept in the browser
  notes: string;
  sockets: number | null; // 1–5 (A few … Lots), the scale place pages use
  noise: typeof noiseLevels[number] | null;
  entry: 'free' | 'buy' | 'paid' | null; // free to sit, expected to buy something, or paid entry / day pass
  website: string; // website or social link, '' when not given
  hours: Week | null; // what the visitor saw, 24-hour "HH:MM"; null day = closed
  submittedAt: string; // ISO timestamp
}
/** What this browser keeps: never the contact email. localId ties retries of one report together; id is the server's. */
export interface StoredReport extends Submission { delivery: 'sent' | 'device'; localId?: string; id?: string; }

export const SUBMISSIONS_KEY = 'elsewhere:submissions:v1';
const MAX_STORED = 50;

/** Today's date in Dubai as YYYY-MM-DD, so "not in the future" matches the city the visit happened in. */
export function dubaiToday(now = Date.now()): string {
  return new Date(now).toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' });
}

export type FieldError = 'name' | 'neighbourhood' | 'wifiSpeed' | 'visitedOn' | 'email' | 'website' | 'hours';
/** Fields in the order they appear on the form, so focus goes to the first problem. */
export const FIELD_ORDER: FieldError[] = ['name', 'neighbourhood', 'website', 'wifiSpeed', 'hours', 'visitedOn', 'email'];
export type Week = Record<DayKey, [string, string] | null>;
const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/** A website or social link: "instagram.com/x" becomes "https://instagram.com/x". '' when blank, undefined when invalid. */
export function normaliseUrl(raw?: string): string | undefined {
  const t = (raw ?? '').trim();
  if (!t) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    return u.hostname.includes('.') && t.length <= 300 ? u.href : undefined;
  } catch { return undefined; }
}

/** Opening hours from the form. Modes: "unsure" (none), "same" (one pair for every day), "days" (each day, or Closed).
 *  Returns null when not given, undefined when incomplete. */
export function hoursFrom(v: Record<string, string | undefined>): Week | null | undefined {
  const pair = (o?: string, c?: string): [string, string] | undefined => (o && c && HHMM.test(o) && HHMM.test(c) ? [o, c] : undefined);
  if (v.hoursMode === 'same') {
    const p = pair(v.openAll, v.closeAll);
    return p ? Object.fromEntries(dayKeys.map(d => [d, p])) as Week : undefined;
  }
  if (v.hoursMode === 'days') {
    const week = {} as Week;
    for (const d of dayKeys) {
      if (v[`${d}Closed`]) { week[d] = null; continue; }
      const p = pair(v[`${d}Open`], v[`${d}Close`]);
      if (!p) return undefined;
      week[d] = p;
    }
    return week;
  }
  return null;
}

/** Blank is fine; otherwise a plain address check (the server checks again). */
export const emailOk = (raw?: string) => { const t = (raw ?? '').trim(); return !t || (t.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)); };

/** Blank means not tested; otherwise a positive number up to MAX_MBPS, comma or point decimals. Returns undefined when invalid. */
export function parseMbps(raw?: string): number | null | undefined {
  const t = (raw ?? '').trim().replace(',', '.');
  if (!t) return null;
  if (!/^\d+(\.\d+)?$/.test(t)) return undefined;
  const n = Number(t);
  return n > 0 && n <= MAX_MBPS ? Math.round(n * 10) / 10 : undefined;
}

/** Validate raw form values. Returns the fields in error, in form order. */
export function validateSubmission(v: Record<string, string | undefined>, now = Date.now()): FieldError[] {
  const errors: FieldError[] = [];
  if (!v.name?.trim()) errors.push('name');
  if (!v.neighbourhood?.trim()) errors.push('neighbourhood');
  if (parseMbps(v.wifiSpeed) === undefined) errors.push('wifiSpeed');
  const d = v.visitedOn ?? '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || Number.isNaN(Date.parse(d)) || d > dubaiToday(now)) errors.push('visitedOn');
  if (normaliseUrl(v.website) === undefined) errors.push('website');
  if (hoursFrom(v) === undefined) errors.push('hours');
  if (!emailOk(v.email)) errors.push('email');
  return FIELD_ORDER.filter(f => errors.includes(f));
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
    sockets: /^[1-5]$/.test(v.sockets ?? '') ? Number(v.sockets) : null,
    noise: noiseLevels.find(n => n === v.noise) ?? null,
    entry: (['free', 'buy', 'paid'] as const).find(e => e === v.entry) ?? null,
    website: normaliseUrl(v.website) ?? '',
    hours: hoursFrom(v) ?? null,
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
  // A retry of the same report replaces the earlier copy instead of adding a second one.
  return [r, ...list.filter(x => !r.localId || x.localId !== r.localId)].slice(0, MAX_STORED);
}
