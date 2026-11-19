// Server-side check of a "Submit a place" payload. Mirrors the browser rules in src/lib/submissions.ts;
// tests/submit-api.test.ts keeps the two in step. Imports use explicit .js paths so Vercel's function build can run them.
import { z } from 'zod';

export const CATEGORIES = ['Café', 'Co-working', 'Restaurant', 'Bar'] as const;
export const AMENITY_KEYS = ['wifi', 'power', 'laptops', 'calls', 'stepFree'] as const;
export const MAX_MBPS = 2000;

const answer = z.enum(['yes', 'no', 'unsure']);
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const day = z.tuple([hhmm, hhmm]).nullable();
export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dubaiToday = (now: number) => new Date(now).toLocaleDateString('en-CA', { timeZone: 'Asia/Dubai' });

export function payloadSchema(now: number) {
  return z.object({
    version: z.literal(1),
    kind: z.enum(['new', 'update']),
    placeId: z.string().regex(/^[\w-]{1,64}$/).nullable(),
    name: z.string().trim().min(1).max(120),
    category: z.enum(CATEGORIES),
    neighbourhood: z.string().trim().min(1).max(80),
    visitedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(d => !Number.isNaN(Date.parse(d)) && d >= '2000-01-01' && d <= dubaiToday(now), 'date'),
    amenities: z.object({ wifi: answer, power: answer, laptops: answer, calls: answer, stepFree: answer }).strict(),
    wifiDownMbps: z.number().positive().max(MAX_MBPS).nullable(),
    wifiAccess: z.enum(['open', 'password', 'signup', 'unsure']),
    notes: z.string().max(600),
    // Optional details visitors can add (older forms didn't send them).
    sockets: z.number().int().min(1).max(5).nullable().optional(),
    noise: z.enum(['quiet', 'moderate', 'loud']).nullable().optional(),
    entry: z.enum(['free', 'buy', 'paid']).nullable().optional(),
    website: z.union([z.literal(''), z.string().max(300).url().refine(u => /^https?:\/\//.test(u), 'http')]).optional(),
    hours: z.object({ mon: day, tue: day, wed: day, thu: day, fri: day, sat: day, sun: day }).strict().nullable().optional(),
    email: z.union([z.literal(''), z.string().trim().max(254).email()]).optional(),
    wifiPassword: z.string().trim().max(64).optional(),
    // From the place search, when the visitor picked a suggestion. Coordinates must fall in or near the UAE.
    googlePlaceId: z.string().regex(/^[\w-]{10,300}$/).optional().or(z.literal('')),
    address: z.string().trim().max(300).optional(),
    lat: z.number().min(22).max(27).nullable().optional(),
    lng: z.number().min(51).max(57).nullable().optional(),
    submittedAt: z.string().datetime(),
    // Spam checks, never stored.
    hp: z.string().max(200).optional(),
    openedAt: z.number().int().nonnegative(),
  });
}
export type Payload = z.infer<ReturnType<typeof payloadSchema>>;

export type ParseResult = { ok: true; value: Payload } | { ok: false; fields: string[] };
export function parsePayload(input: unknown, now = Date.now()): ParseResult {
  const r = payloadSchema(now).safeParse(input);
  if (r.success) return { ok: true, value: r.data };
  return { ok: false, fields: [...new Set(r.error.issues.map(i => String(i.path[0] ?? 'body')))] };
}

export const SHEET_HEADER = ['Submission ID', 'Received at', 'Status', 'Kind', 'Place ID', 'Name', 'Type', 'Neighbourhood', 'Visited on',
  'Wi-Fi', 'Power sockets', 'Laptop policy', 'Calls', 'Step-free', 'Wi-Fi Mbps', 'Wi-Fi access', 'Notes', 'Contact email',
  'Submitted at (browser)', 'Form version', 'Wi-Fi password',
  'Google place ID', 'Address (Google)', 'Latitude', 'Longitude',
  'Sockets (1-5)', 'Noise', 'Entry', 'Website', 'Hours'] as const;

/** One sheet row, in SHEET_HEADER order. Values are sent with valueInputOption=RAW, so nothing is read as a formula. */
export function toRow(p: Payload, id: string, receivedAt: string): (string | number)[] {
  return [id, receivedAt, 'Pending', p.kind, p.placeId ?? '', p.name, p.category, p.neighbourhood, p.visitedOn,
    ...AMENITY_KEYS.map(k => p.amenities[k]), p.wifiDownMbps ?? '', p.wifiAccess, p.notes, p.email ?? '', p.submittedAt, p.version,
    // Last column so existing sheets only need one header added. Only kept when access is a password from staff.
    p.wifiAccess === 'password' ? p.wifiPassword ?? '' : '',
    // Only kept together: a place ID with its address and location, or none of them.
    ...(p.googlePlaceId && p.lat != null && p.lng != null ? [p.googlePlaceId, p.address ?? '', p.lat, p.lng] : ['', '', '', '']),
    p.sockets ?? '', p.noise ?? '', p.entry ?? '', p.website ?? '', hoursText(p.hours)];
}

/** "Mon 08:00–22:00; Tue …; Sun closed", or "Every day 08:00–22:00" when all days match. '' when not given. */
export function hoursText(h: Payload['hours']): string {
  if (!h) return '';
  const fmt = (d: [string, string] | null) => (d ? `${d[0]}–${d[1]}` : 'closed');
  const all = DAYS.map(d => fmt(h[d]));
  if (all.every(x => x === all[0])) return `Every day ${all[0]}`;
  return DAYS.map((d, i) => `${DAY_NAMES[i]} ${all[i]}`).join('; ');
}
