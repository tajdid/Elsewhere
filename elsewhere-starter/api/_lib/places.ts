// Google Places API (New), called from the server so the key never reaches the browser.
// Field masks are kept to the cheapest tiers: suggestions, then id/address/location/address parts for the chosen place.
type Fetch = typeof fetch;
const BASE = 'https://places.googleapis.com/v1';

/** Dubai, roughly: searches are limited to the UAE and biased to the city. */
export const DUBAI = { lat: 25.15, lng: 55.25 };
const DUBAI_BIAS = { circle: { center: { latitude: DUBAI.lat, longitude: DUBAI.lng }, radius: 50_000 } };

export interface Suggestion { placeId: string; name: string; detail: string; }
export interface PlaceDetails { placeId: string; address: string; lat: number; lng: number; area: string | null; }

export async function suggest(key: string, input: string, session: string, fetchImpl: Fetch = fetch, signal?: AbortSignal): Promise<Suggestion[]> {
  const res = await fetchImpl(`${BASE}/places:autocomplete`, {
    method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key },
    body: JSON.stringify({ input, sessionToken: session, includedRegionCodes: ['ae'], locationBias: DUBAI_BIAS, languageCode: 'en' }),
  });
  if (!res.ok) throw new Error(`autocomplete ${res.status}`);
  const json = await res.json() as { suggestions?: { placePrediction?: { placeId: string; structuredFormat?: { mainText?: { text: string }; secondaryText?: { text: string } }; text?: { text: string } } }[] };
  return (json.suggestions ?? []).flatMap(s => {
    const p = s.placePrediction;
    if (!p?.placeId) return [];
    return [{ placeId: p.placeId, name: p.structuredFormat?.mainText?.text ?? p.text?.text ?? '', detail: p.structuredFormat?.secondaryText?.text ?? '' }];
  }).slice(0, 5);
}

interface AddressPart { longText?: string; types?: string[] }
/** The neighbourhood Google gives for an address, if any (e.g. "Jumeirah Lake Towers"). */
export function areaFrom(parts: AddressPart[] = []): string | null {
  for (const type of ['neighborhood', 'sublocality_level_1', 'sublocality']) {
    const hit = parts.find(p => p.types?.includes(type) && p.longText);
    if (hit) return hit.longText!;
  }
  return null;
}

export async function details(key: string, placeId: string, session: string, fetchImpl: Fetch = fetch, signal?: AbortSignal): Promise<PlaceDetails> {
  const url = `${BASE}/places/${encodeURIComponent(placeId)}?sessionToken=${encodeURIComponent(session)}&languageCode=en`;
  const res = await fetchImpl(url, { signal, headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'id,formattedAddress,location,addressComponents' } });
  if (!res.ok) throw new Error(`details ${res.status}`);
  const j = await res.json() as { id: string; formattedAddress?: string; location?: { latitude: number; longitude: number }; addressComponents?: AddressPart[] };
  if (!j.location) throw new Error('details no location');
  return { placeId: j.id, address: j.formattedAddress ?? '', lat: j.location.latitude, lng: j.location.longitude, area: areaFrom(j.addressComponents) };
}

/** Google's usual weekly hours, Monday first, e.g. "Monday: 7:00 AM – 11:00 PM". Shown live, never stored. */
export async function openingHours(key: string, placeId: string, fetchImpl: Fetch = fetch, signal?: AbortSignal): Promise<string[] | null> {
  const res = await fetchImpl(`${BASE}/places/${encodeURIComponent(placeId)}?languageCode=en`, { signal, headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'regularOpeningHours.weekdayDescriptions' } });
  if (!res.ok) throw new Error(`hours ${res.status}`);
  const j = await res.json() as { regularOpeningHours?: { weekdayDescriptions?: string[] } };
  return j.regularOpeningHours?.weekdayDescriptions?.length ? j.regularOpeningHours.weekdayDescriptions : null;
}

export interface TextMatch { placeId: string; name: string; address: string; }
/** Used by scripts/match-places.ts to propose a Google place for each listing. The owner confirms every match. */
export async function textSearch(key: string, query: string, fetchImpl: Fetch = fetch): Promise<TextMatch[]> {
  const res = await fetchImpl(`${BASE}/places:searchText`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress' },
    body: JSON.stringify({ textQuery: query, regionCode: 'ae', locationBias: DUBAI_BIAS, languageCode: 'en', pageSize: 3 }),
  });
  if (!res.ok) throw new Error(`searchText ${res.status}`);
  const j = await res.json() as { places?: { id: string; displayName?: { text: string }; formattedAddress?: string }[] };
  return (j.places ?? []).map(p => ({ placeId: p.id, name: p.displayName?.text ?? '', address: p.formattedAddress ?? '' }));
}
