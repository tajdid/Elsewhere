// The Submit a place endpoint: it saves only valid, human-looking, same-origin reports, and reports success only
// after Google Sheets confirms the row. Google is never contacted: fetch is replaced in every test.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync, createVerify } from 'node:crypto';
import { handleSubmit, createLimiter, type Deps } from '../api/_lib/handler.js';
import { parsePayload, toRow, SHEET_HEADER, CATEGORIES, AMENITY_KEYS, MAX_MBPS } from '../api/_lib/payload.js';
import { signJwt, normaliseKey, clearTokenCache } from '../api/_lib/sheets.js';
import { buildSubmission, validateSubmission, addReport, emailOk, MAX_MBPS as CLIENT_MAX, type StoredReport } from '../src/lib/submissions';
import { categories, amenityKeys } from '../src/lib/schema';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const KEY = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
const NOW = Date.parse('2026-11-19T10:00:00Z');
const SITE = 'https://elsewhere.test';

function goodBody(over: Record<string, unknown> = {}) {
  const s = buildSubmission({ name: 'Test Café', category: 'Café', neighbourhood: 'JLT', visitedOn: '2026-11-18', wifi: 'yes', wifiSpeed: '42', wifiAccess: 'password', notes: '=HYPERLINK("x")' }, null, NOW);
  return { ...s, email: 'someone@example.com', hp: '', openedAt: NOW - 60_000, ...over };
}

interface Call { url: string; body: string }
function deps(over: Partial<Deps> = {}, sheets: { status?: number } = {}) {
  const calls: Call[] = [];
  const fetchStub = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input); calls.push({ url, body: String(init?.body ?? '') });
    if (url.includes('oauth2')) return new Response(JSON.stringify({ access_token: 'tok', expires_in: 3600 }), { status: 200 });
    return new Response('{}', { status: sheets.status ?? 200 });
  }) as typeof fetch;
  const logs: string[] = [];
  const d: Deps = {
    env: { GOOGLE_SHEETS_ID: 'sheet123', GOOGLE_SERVICE_ACCOUNT_EMAIL: 'bot@x.iam.gserviceaccount.com', GOOGLE_PRIVATE_KEY: KEY },
    fetch: fetchStub, now: () => NOW, uuid: () => 'id-1', limiter: createLimiter(5, 600_000), log: m => logs.push(m), ...over,
  };
  return { d, calls, logs, appends: () => calls.filter(c => c.url.includes('sheets.googleapis.com')) };
}
function req(body: unknown, headers: Record<string, string> = {}) {
  return new Request(`${SITE}/api/submit`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: SITE, 'x-forwarded-for': '1.2.3.4', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

beforeEach(() => clearTokenCache());

test('server rules stay in step with the browser form', () => {
  assert.deepEqual([...CATEGORIES], [...categories]);
  assert.deepEqual([...AMENITY_KEYS], [...amenityKeys]);
  assert.equal(MAX_MBPS, CLIENT_MAX);
  assert.ok(parsePayload(goodBody(), NOW).ok, 'a payload built by the form passes the server check');
});

test('success: one row appended with status Pending, and 201 only after Google confirms', async () => {
  const { d, appends } = deps();
  const res = await handleSubmit(req(goodBody()), d);
  assert.equal(res.status, 201);
  assert.deepEqual(await res.json(), { ok: true, id: 'id-1' });
  assert.equal(appends().length, 1);
  const call = appends()[0];
  assert.match(call.url, /spreadsheets\/sheet123\/values\/Submissions!A1:append\?valueInputOption=RAW&insertDataOption=INSERT_ROWS$/);
  const row = JSON.parse(call.body).values[0];
  assert.equal(row.length, SHEET_HEADER.length);
  assert.equal(row[0], 'id-1');
  assert.equal(row[1], new Date(NOW).toISOString());
  assert.equal(row[2], 'Pending');
  assert.equal(row[SHEET_HEADER.indexOf('Contact email')], 'someone@example.com');
  // Formula-looking text is sent as-is and stored as text because the append uses RAW.
  assert.equal(row[SHEET_HEADER.indexOf('Notes')], '=HYPERLINK("x")');
});

test('a Google failure is a 502 and the log names the cause, never the form data or key', async () => {
  const { d, logs } = deps({}, { status: 500 });
  const res = await handleSubmit(req(goodBody()), d);
  assert.equal(res.status, 502);
  assert.equal(logs.length, 1);
  assert.doesNotMatch(logs[0], /Test Café|someone@example|PRIVATE KEY/);
});

test('missing credentials is a 503 and nothing is sent', async () => {
  const { d, calls } = deps({ env: {} });
  assert.equal((await handleSubmit(req(goodBody()), d)).status, 503);
  assert.equal(calls.length, 0);
});

test('spam: trap field gets a quiet 200 with no write; a form sent too fast is refused', async () => {
  const a = deps();
  const trap = await handleSubmit(req(goodBody({ hp: 'http://spam.example' })), a.d);
  assert.equal(trap.status, 200);
  assert.equal(a.appends().length, 0);
  const b = deps();
  assert.equal((await handleSubmit(req(goodBody({ openedAt: NOW - 500 })), b.d)).status, 400);
  assert.equal(b.appends().length, 0);
});

test('rate limit: the sixth report from one address within the window is refused', async () => {
  const { d, appends } = deps();
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await handleSubmit(req(goodBody()), d)).status);
  assert.deepEqual(codes, [201, 201, 201, 201, 201, 429]);
  assert.equal(appends().length, 5);
});

test('requests from another site, wrong types, oversized or broken bodies are refused', async () => {
  const { d, calls } = deps();
  assert.equal((await handleSubmit(req(goodBody(), { origin: 'https://evil.example' }), d)).status, 403);
  assert.equal((await handleSubmit(new Request(`${SITE}/api/submit`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }), d)).status, 403);
  assert.equal((await handleSubmit(req('a=b', { 'content-type': 'application/x-www-form-urlencoded' }), d)).status, 415);
  assert.equal((await handleSubmit(req('{not json'), d)).status, 400);
  assert.equal((await handleSubmit(req(goodBody({ notes: 'x'.repeat(20_000) })), d)).status, 413);
  assert.equal(calls.length, 0);
});

test('validation: required fields, future dates in Dubai, speed range, email and length caps give 422 with field names', async () => {
  const cases: [Record<string, unknown>, string][] = [
    [{ name: '  ' }, 'name'],
    [{ neighbourhood: '' }, 'neighbourhood'],
    [{ visitedOn: '2026-11-21' }, 'visitedOn'],
    [{ visitedOn: '19-11-2026' }, 'visitedOn'],
    [{ wifiDownMbps: 0 }, 'wifiDownMbps'],
    [{ wifiDownMbps: 2001 }, 'wifiDownMbps'],
    [{ email: 'not-an-email' }, 'email'],
    [{ category: 'Nightclub' }, 'category'],
    [{ notes: 'x'.repeat(601) }, 'notes'],
    [{ name: 'x'.repeat(121) }, 'name'],
    [{ amenities: { wifi: 'maybe', power: 'yes', laptops: 'yes', calls: 'yes', stepFree: 'yes' } }, 'amenities'],
  ];
  for (const [over, field] of cases) {
    const { d, calls } = deps();
    const res = await handleSubmit(req(goodBody(over)), d);
    assert.equal(res.status, 422, field);
    assert.ok(((await res.json()) as { fields: string[] }).fields.includes(field), field);
    assert.equal(calls.length, 0);
  }
  // Optional fields really are optional.
  assert.ok(parsePayload(goodBody({ email: '', wifiDownMbps: null, notes: '' }), NOW).ok);
  // "Today" is Dubai's today: 23:30 UTC on the 18th is already the 19th in Dubai.
  assert.ok(parsePayload(goodBody({ visitedOn: '2026-11-19' }), Date.parse('2026-11-18T23:30:00Z')).ok);
});

test('the service-account token request is a valid RS256 JWT for the Sheets scope', () => {
  const jwt = signJwt('bot@x.iam.gserviceaccount.com', KEY.replace(/\n/g, '\\n'), NOW);
  const [h, c, sig] = jwt.split('.');
  const claims = JSON.parse(Buffer.from(c, 'base64url').toString());
  assert.equal(JSON.parse(Buffer.from(h, 'base64url').toString()).alg, 'RS256');
  assert.equal(claims.scope, 'https://www.googleapis.com/auth/spreadsheets');
  assert.equal(claims.exp - claims.iat, 3600);
  const v = createVerify('RSA-SHA256'); v.update(`${h}.${c}`);
  assert.ok(v.verify(publicKey, Buffer.from(sig, 'base64url')));
  assert.equal(normaliseKey('a\\nb'), 'a\nb');
});

test('toRow keeps the column order of the header', () => {
  const p = parsePayload(goodBody(), NOW);
  assert.ok(p.ok);
  if (p.ok) assert.equal(toRow(p.value, 'x', 'y').length, SHEET_HEADER.length);
});

test('browser side: optional email is checked, and a retried report replaces its earlier local copy', () => {
  assert.ok(emailOk('') && emailOk('  ') && emailOk('a@b.co'));
  assert.ok(!emailOk('a@b') && !emailOk('no spaces@x.com'));
  const base = { name: 'X', neighbourhood: 'JLT', visitedOn: '2026-11-18' };
  assert.deepEqual(validateSubmission({ ...base, email: 'nope' }, NOW), ['email']);
  assert.deepEqual(validateSubmission(base, NOW), []);
  const s = buildSubmission({ ...base, category: 'Café' }, null, NOW);
  const failed: StoredReport = { ...s, delivery: 'device', localId: 'L1' };
  const other: StoredReport = { ...s, delivery: 'device', localId: 'L2' };
  const list = addReport(addReport([], other), failed);
  const after = addReport(list, { ...s, delivery: 'sent', localId: 'L1', id: 'srv' });
  assert.equal(after.length, 2);
  assert.equal(after[0].delivery, 'sent');
  assert.ok(!('email' in after[0]), 'the local copy never holds the contact email');
});

test('the Sheet ID is read from either GOOGLE_SHEETS_ID or GOOGLE_SHEET_ID', async () => {
  const { d, appends } = deps({ env: { GOOGLE_SHEET_ID: 'other', GOOGLE_SERVICE_ACCOUNT_EMAIL: 'bot@x', GOOGLE_PRIVATE_KEY: KEY } });
  assert.equal((await handleSubmit(req(goodBody()), d)).status, 201);
  assert.match(appends()[0].url, /spreadsheets\/other\//);
});

test('a Wi-Fi password is saved in its own column, only when access is a password from staff', async () => {
  const a = deps();
  await handleSubmit(req(goodBody({ wifiAccess: 'password', wifiPassword: ' cafe2026 ' })), a.d);
  const row = JSON.parse(a.appends()[0].body).values[0];
  const col = SHEET_HEADER.indexOf('Wi-Fi password');
  assert.ok(col > SHEET_HEADER.indexOf('Form version'), 'added after the original columns');
  assert.equal(row[col], 'cafe2026');
  const b = deps();
  await handleSubmit(req(goodBody({ wifiAccess: 'open', wifiPassword: 'leftover' })), b.d);
  assert.equal(JSON.parse(b.appends()[0].body).values[0][SHEET_HEADER.indexOf('Wi-Fi password')], '');
  const c = deps();
  assert.equal((await handleSubmit(req(goodBody({ wifiAccess: 'password', wifiPassword: 'x'.repeat(65) })), c.d)).status, 422);
});
