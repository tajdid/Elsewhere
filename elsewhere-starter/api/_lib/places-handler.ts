// POST /api/places: { action: 'suggest', input, session } or { action: 'details', placeId, session }.
// Same-origin only, rate limited, and the Google key stays on the server. Without a key it answers 503 and the
// form falls back to typing the name by hand.
import { z } from 'zod';
import { createLimiter, type Limiter } from './handler.js';
import { suggest, details, openingHours } from './places.js';

export interface PlacesDeps { key?: string; /** Place IDs the owner confirmed: hours are only looked up for these. */ knownIds: Set<string>; fetch: typeof fetch; now: () => number; limiter: Limiter; log: (m: string) => void; }
export const placesLimiter = () => createLimiter(120, 10 * 60_000);

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const session = z.string().regex(/^[\w-]{8,64}$/);
const body = z.discriminatedUnion('action', [
  z.object({ action: z.literal('suggest'), input: z.string().trim().min(2).max(100), session }),
  z.object({ action: z.literal('details'), placeId: z.string().regex(/^[\w-]{10,300}$/), session }),
  z.object({ action: z.literal('hours'), placeId: z.string().regex(/^[\w-]{10,300}$/) }),
]);

export async function handlePlaces(req: Request, deps: PlacesDeps): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'method' });
  const origin = req.headers.get('origin');
  try { if (!origin || new URL(origin).host !== new URL(req.url).host) return json(403, { error: 'origin' }); } catch { return json(403, { error: 'origin' }); }
  const text = await req.text();
  if (text.length > 2_000) return json(413, { error: 'size' });
  let parsed;
  try { parsed = body.safeParse(JSON.parse(text)); } catch { return json(400, { error: 'json' }); }
  if (!parsed.success) return json(422, { error: 'invalid' });
  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (!deps.limiter.hit(ip, deps.now())) return json(429, { error: 'rate' });
  if (!deps.key) return json(503, { error: 'unavailable' });
  const signal = AbortSignal.timeout(5_000);
  try {
    const b = parsed.data;
    if (b.action === 'suggest') return json(200, { suggestions: await suggest(deps.key, b.input, b.session, deps.fetch, signal) });
    if (b.action === 'hours') {
      // Hours are a paid-tier lookup: only for listings on the site, and never stored or cached.
      if (!deps.knownIds.has(b.placeId)) return json(404, { error: 'unknown place' });
      return json(200, { hours: await openingHours(deps.key, b.placeId, deps.fetch, signal) });
    }
    return json(200, { place: await details(deps.key, b.placeId, b.session, deps.fetch, signal) });
  } catch (e) {
    deps.log(`places: ${e instanceof Error ? e.message : 'unknown error'}`);
    return json(502, { error: 'google' });
  }
}
