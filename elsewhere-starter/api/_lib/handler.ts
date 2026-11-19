// The "Submit a place" endpoint, written against injected dependencies so it can be tested without Google or Vercel.
// Success (201) is only returned after the row is saved in the Sheet.
import { parsePayload, toRow } from './payload.js';
import { appendRow, type SheetsConfig } from './sheets.js';

export const MAX_BODY_BYTES = 10_000;
export const MIN_FILL_MS = 2_000;

export interface Env { GOOGLE_SHEETS_ID?: string; GOOGLE_SHEET_ID?: string; GOOGLE_SERVICE_ACCOUNT_EMAIL?: string; GOOGLE_PRIVATE_KEY?: string; GOOGLE_SHEETS_TAB?: string; }
export interface Deps {
  env: Env;
  fetch: typeof fetch;
  now: () => number;
  uuid: () => string;
  limiter: Limiter;
  log: (message: string) => void;
}

/** Best effort: counts per IP inside one running instance. Enough to slow a single noisy sender. */
export interface Limiter { hit(key: string, now: number): boolean; }
export function createLimiter(max: number, windowMs: number): Limiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key, now) {
      const recent = (hits.get(key) ?? []).filter(t => now - t < windowMs);
      if (recent.length >= max) { hits.set(key, recent); return false; }
      recent.push(now); hits.set(key, recent);
      if (hits.size > 5000) hits.delete(hits.keys().next().value!);
      return true;
    },
  };
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try { return new URL(origin).host === new URL(req.url).host; } catch { return false; }
}

export async function handleSubmit(req: Request, deps: Deps): Promise<Response> {
  if (req.method !== 'POST') return json(405, { error: 'method' });
  if (!sameOrigin(req)) return json(403, { error: 'origin' });
  if (!(req.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) return json(415, { error: 'type' });

  const text = await req.text();
  if (Buffer.byteLength(text) > MAX_BODY_BYTES) return json(413, { error: 'size' });
  let body: unknown;
  try { body = JSON.parse(text); } catch { return json(400, { error: 'json' }); }

  const now = deps.now();
  const parsed = parsePayload(body, now);
  if (!parsed.ok) return json(422, { error: 'invalid', fields: parsed.fields });
  const p = parsed.value;

  // Trap field filled: answer like a success so bots learn nothing, but write nothing.
  if (p.hp) return json(200, { ok: true });
  if (now - p.openedAt < MIN_FILL_MS) return json(400, { error: 'too_fast' });

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
  if (!deps.limiter.hit(ip, now)) return json(429, { error: 'rate' });

  const sheetId = deps.env.GOOGLE_SHEETS_ID || deps.env.GOOGLE_SHEET_ID; // either spelling
  const { GOOGLE_SERVICE_ACCOUNT_EMAIL: email, GOOGLE_PRIVATE_KEY: key } = deps.env;
  if (!sheetId || !email || !key) { deps.log('submit: Google Sheets is not configured'); return json(503, { error: 'unavailable' }); }
  const cfg: SheetsConfig = { sheetId, email, key, tab: deps.env.GOOGLE_SHEETS_TAB || 'Submissions' };

  const id = deps.uuid();
  const timeout = AbortSignal.timeout(8_000);
  try {
    await appendRow(cfg, toRow(p, id, new Date(now).toISOString()), deps.fetch, now, timeout);
  } catch (e) {
    // The cause only: never the form data or the key.
    deps.log(`submit: could not save (${e instanceof Error ? e.message : 'unknown error'})`);
    return json(502, { error: 'save' });
  }
  return json(201, { ok: true, id });
}
