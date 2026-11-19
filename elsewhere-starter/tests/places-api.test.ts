// Place search: the /api/places proxy, Google response mapping, neighbourhood matching, the place fields in a
// submission, CSV review helpers and exact directions from a confirmed place ID. Google is never contacted.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handlePlaces, type PlacesDeps } from '../api/_lib/places-handler.js';
import { createLimiter } from '../api/_lib/handler.js';
import { areaFrom } from '../api/_lib/places.js';
import { SHEET_HEADER, parsePayload, toRow } from '../api/_lib/payload.js';
import { matchArea } from '../src/lib/areas';
import { toCsv, parseCsv, similarity } from '../scripts/lib/csv';
import { directionsUrl, directionsIsSearch } from '../src/lib/discovery';
import { buildSubmission } from '../src/lib/submissions';
import { places } from '../src/lib/places';

const SITE = 'https://elsewhere.test';
const NOW = Date.parse('2026-11-19T10:00:00Z');
const session = 'abcdef12-3456';

function placesDeps(over: Partial<PlacesDeps> = {}) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fetchStub = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input); calls.push({ url, init });
    if (url.endsWith(':autocomplete')) return new Response(JSON.stringify({ suggestions: [
      { placePrediction: { placeId: 'ChIJ_friends_avenue', structuredFormat: { mainText: { text: 'Friends Avenue' }, secondaryText: { text: 'Cluster T - Jumeirah Lake Towers - Dubai' } } } },
      { queryPrediction: { text: { text: 'friends cafe' } } },
    ] }));
    return new Response(JSON.stringify({ id: 'ChIJ_friends_avenue', formattedAddress: 'Cluster T, JLT, Dubai', location: { latitude: 25.07, longitude: 55.14 },
      addressComponents: [{ longText: 'Jumeirah Lake Towers', types: ['neighborhood', 'political'] }, { longText: 'Dubai', types: ['locality'] }] }));
  }) as typeof fetch;
  const d: PlacesDeps = { key: 'server-key', fetch: fetchStub, now: () => NOW, limiter: createLimiter(120, 600_000), log: () => {}, ...over };
  return { d, calls };
}
const preq = (body: unknown, origin = SITE) => new Request(`${SITE}/api/places`, { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify(body) });

test('suggestions: limited to the UAE, key sent as a header (never in the URL), place predictions only', async () => {
  const { d, calls } = placesDeps();
  const res = await handlePlaces(preq({ action: 'suggest', input: 'friends', session }), d);
  assert.equal(res.status, 200);
  assert.deepEqual((await res.json()).suggestions, [{ placeId: 'ChIJ_friends_avenue', name: 'Friends Avenue', detail: 'Cluster T - Jumeirah Lake Towers - Dubai' }]);
  const sent = JSON.parse(String(calls[0].init!.body));
  assert.deepEqual(sent.includedRegionCodes, ['ae']);
  assert.equal(sent.sessionToken, session);
  assert.equal((calls[0].init!.headers as Record<string, string>)['X-Goog-Api-Key'], 'server-key');
  assert.ok(!calls[0].url.includes('server-key'));
});

test('details: cheap field mask, coordinates and Google neighbourhood returned', async () => {
  const { d, calls } = placesDeps();
  const res = await handlePlaces(preq({ action: 'details', placeId: 'ChIJ_friends_avenue', session }), d);
  assert.deepEqual((await res.json()).place, { placeId: 'ChIJ_friends_avenue', address: 'Cluster T, JLT, Dubai', lat: 25.07, lng: 55.14, area: 'Jumeirah Lake Towers' });
  assert.equal((calls[0].init!.headers as Record<string, string>)['X-Goog-FieldMask'], 'id,formattedAddress,location,addressComponents');
});

test('the proxy refuses other sites, bad input and works out when it is not configured', async () => {
  const a = placesDeps();
  assert.equal((await handlePlaces(preq({ action: 'suggest', input: 'friends', session }, 'https://evil.example'), a.d)).status, 403);
  assert.equal((await handlePlaces(preq({ action: 'suggest', input: 'f', session }), a.d)).status, 422);
  assert.equal((await handlePlaces(preq({ action: 'details', placeId: '../../x', session }), a.d)).status, 422);
  assert.equal(a.calls.length, 0);
  const b = placesDeps({ key: undefined });
  assert.equal((await handlePlaces(preq({ action: 'suggest', input: 'friends', session }), b.d)).status, 503);
  const c = placesDeps({ fetch: (async () => new Response('', { status: 500 })) as typeof fetch });
  assert.equal((await handlePlaces(preq({ action: 'suggest', input: 'friends', session }), c.d)).status, 502);
});

test("Google's neighbourhood names map to the list's names", () => {
  const known = ['JLT', 'Dubai Marina', 'Al Quoz'];
  assert.equal(matchArea('Jumeirah Lake Towers', known), 'JLT');
  assert.equal(matchArea('dubai marina', known), 'Dubai Marina');
  assert.equal(matchArea('Marsa Dubai', known), 'Dubai Marina');
  assert.equal(matchArea('Business Bay', known), 'Business Bay');
  assert.equal(matchArea(null, known), null);
  assert.equal(areaFrom([{ longText: 'Al Barsha 1', types: ['sublocality_level_1'] }]), 'Al Barsha 1');
  assert.equal(areaFrom([]), null);
});

test('a submission keeps the picked place ID, address and coordinates together in the last columns', () => {
  const s = buildSubmission({ name: 'Friends Avenue', category: 'Café', neighbourhood: 'JLT', visitedOn: '2026-11-18' }, null, NOW);
  const base = { ...s, openedAt: NOW - 9000 };
  const ok = parsePayload({ ...base, googlePlaceId: 'ChIJ_friends_avenue', address: 'Cluster T, JLT', lat: 25.07, lng: 55.14 }, NOW);
  assert.ok(ok.ok);
  if (ok.ok) assert.deepEqual(toRow(ok.value, 'id', 'r').slice(-4), ['ChIJ_friends_avenue', 'Cluster T, JLT', 25.07, 55.14]);
  assert.deepEqual(SHEET_HEADER.slice(-4), ['Google place ID', 'Address (Google)', 'Latitude', 'Longitude']);
  // Coordinates far outside the UAE are refused.
  assert.ok(!parsePayload({ ...base, googlePlaceId: 'ChIJ_friends_avenue', lat: 51.5, lng: -0.12 }, NOW).ok);
  // Without a picked place the four columns stay empty.
  const none = parsePayload(base, NOW);
  assert.ok(none.ok);
  if (none.ok) assert.deepEqual(toRow(none.value, 'id', 'r').slice(-4), ['', '', '', '']);
});

test('review CSV round-trips, and name similarity ranks good matches higher', () => {
  const rows = [['id', 'name'], ['1', 'Café, "Quoted"\nline']];
  assert.deepEqual(parseCsv(toCsv(rows)), rows);
  assert.ok(similarity('Friends Avenue JLT', 'Friends Avenue') > 0.7);
  assert.ok(similarity('Costa Coffee JLT', 'Starbucks') < 0.2);
});

test('a confirmed Google place ID gives exact directions; the owner’s own Maps link still wins', () => {
  const p = places.find(x => !x.mapsUrl)!;
  const withId = { ...p, googlePlaceId: 'ChIJ_test' };
  assert.match(directionsUrl(withId), /query_place_id=ChIJ_test/);
  assert.equal(directionsIsSearch(withId), false);
  assert.equal(directionsIsSearch({ ...p, googlePlaceId: null }), true);
  const owner = places.find(x => x.mapsUrl)!;
  assert.equal(directionsUrl({ ...owner, googlePlaceId: 'ChIJ_test' }), owner.mapsUrl);
});
