// Server-side check of a "Submit a place" payload. Mirrors the browser rules in src/lib/submissions.ts;
// tests/submit-api.test.ts keeps the two in step. Imports use explicit .js paths so Vercel's function build can run them.
import { z } from 'zod';

export const CATEGORIES = ['Café', 'Co-working', 'Restaurant', 'Bar'] as const;
export const AMENITY_KEYS = ['wifi', 'power', 'laptops', 'calls', 'stepFree'] as const;
export const MAX_MBPS = 2000;

const answer = z.enum(['yes', 'no', 'unsure']);
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
    email: z.union([z.literal(''), z.string().trim().max(254).email()]).optional(),
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
  'Submitted at (browser)', 'Form version'] as const;

/** One sheet row, in SHEET_HEADER order. Values are sent with valueInputOption=RAW, so nothing is read as a formula. */
export function toRow(p: Payload, id: string, receivedAt: string): (string | number)[] {
  return [id, receivedAt, 'Pending', p.kind, p.placeId ?? '', p.name, p.category, p.neighbourhood, p.visitedOn,
    ...AMENITY_KEYS.map(k => p.amenities[k]), p.wifiDownMbps ?? '', p.wifiAccess, p.notes, p.email ?? '', p.submittedAt, p.version];
}
