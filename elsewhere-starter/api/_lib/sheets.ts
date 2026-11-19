// Append a row to Google Sheets as a service account, using Node's crypto and fetch: no Google SDK.
import { createSign } from 'node:crypto';

export interface SheetsConfig { email: string; key: string; sheetId: string; tab: string; }
type Fetch = typeof fetch;

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const b64url = (s: string) => Buffer.from(s).toString('base64url');

/** Vercel stores the key's line breaks as "\n" when it is pasted on one line. */
export const normaliseKey = (k: string) => k.replace(/\\n/g, '\n').trim();

/** A signed JWT asking Google for a one-hour Sheets token. */
export function signJwt(email: string, key: string, now = Date.now()): string {
  const iat = Math.floor(now / 1000);
  const body = `${b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64url(JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat, exp: iat + 3600 }))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(body);
  return `${body}.${signer.sign(normaliseKey(key)).toString('base64url')}`;
}

let cached: { token: string; expires: number; email: string } | null = null;
export const clearTokenCache = () => { cached = null; };

async function accessToken(cfg: SheetsConfig, fetchImpl: Fetch, now: number, signal?: AbortSignal): Promise<string> {
  if (cached && cached.email === cfg.email && cached.expires > now + 60_000) return cached.token;
  const res = await fetchImpl(TOKEN_URL, {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: signJwt(cfg.email, cfg.key, now) }),
  });
  if (!res.ok) throw new Error(`token ${res.status}`);
  const json = await res.json() as { access_token?: string; expires_in?: number };
  if (!json.access_token) throw new Error('token missing');
  cached = { token: json.access_token, expires: now + (json.expires_in ?? 3600) * 1000, email: cfg.email };
  return cached.token;
}

/** Appends one row and resolves only when Google confirms it. Throws otherwise. */
export async function appendRow(cfg: SheetsConfig, row: (string | number)[], fetchImpl: Fetch = fetch, now = Date.now(), signal?: AbortSignal): Promise<void> {
  const token = await accessToken(cfg, fetchImpl, now, signal);
  const range = encodeURIComponent(`${cfg.tab}!A1`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(cfg.sheetId)}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const res = await fetchImpl(url, {
    method: 'POST', signal,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) throw new Error(`append ${res.status}`);
}
