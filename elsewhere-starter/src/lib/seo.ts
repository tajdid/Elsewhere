// Search and answer-engine helpers: which pages exist and are indexable, plain-language summaries built only
// from the owner's list, and schema.org JSON-LD. Nothing here adds a fact that isn't in places.json.
import type { Place } from './schema';
import { isFast, hasPlentySockets, okForCalls } from './discovery';
import { formatMbps, speedTier } from './details';
// Prose uses the full month ("August 2020"); dates are shown in Dubai time like the rest of the site.
const monthYear = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { timeZone: 'Asia/Dubai', month: 'long', year: 'numeric' });
import { socketWords, socketChips } from './ui';

/** Indexing is off until the owner launches: set PUBLIC_ALLOW_INDEXING=true for the production build. Vercel previews never index. */
export const indexingAllowed = import.meta.env?.PUBLIC_ALLOW_INDEXING === 'true' && process.env.VERCEL_ENV !== 'preview';

export const SITE_NAME = 'Elsewhere';
export const SITE_DESCRIPTION = 'Find laptop-friendly cafés and workspaces in Dubai. Compare Wi-Fi speeds, power sockets, noise levels and places suited to remote work.';

// ---------- Which places say enough to stand on their own ----------

const knownFacts = (p: Place) => [p.wifiSpeed, p.sockets, p.noise, p.wifiAccess.value !== 'unknown', p.summary].filter(Boolean).length;
/** A place page is indexed when it has at least two of: Wi-Fi speed, sockets, noise, Wi-Fi access, a note. Thinner pages stay noindex,follow. */
export const placeIsIndexable = (p: Place) => knownFacts(p) >= 2;

// ---------- Neighbourhoods ----------

/** Only neighbourhoods with at least this many places get a page; fewer would be a thin page. */
export const MIN_AREA_PLACES = 3;
const fullNames: Record<string, string> = { JLT: 'Jumeirah Lakes Towers', JVC: 'Jumeirah Village Circle', JBR: 'Jumeirah Beach Residence', DIFC: 'Dubai International Financial Centre' };
export const areaSlug = (name: string) => name.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const areaFullName = (name: string) => fullNames[name];

export interface Area { name: string; slug: string; path: string; places: Place[] }
export function areaPages(all: Place[]): Area[] {
  const by = new Map<string, Place[]>();
  for (const p of all) if (p.neighbourhood) by.set(p.neighbourhood, [...(by.get(p.neighbourhood) ?? []), p]);
  return [...by].filter(([, list]) => list.length >= MIN_AREA_PLACES)
    .map(([name, list]) => ({ name, slug: areaSlug(name), path: `/dubai/${areaSlug(name)}/`, places: sortByDetail(list) }))
    .sort((a, b) => b.places.length - a.places.length || a.name.localeCompare(b.name));
}
export const areaPathFor = (p: Place, all: Place[]) => areaPages(all).find(a => a.name === p.neighbourhood)?.path;

// ---------- Collections ----------

/** A collection is published only when at least this many places meet its rule. */
export const MIN_COLLECTION_PLACES = 5;
export interface CollectionDef {
  slug: string; title: string; short: string; description: string; criteria: string; rule: string; icon: string; explore?: string;
  test: (p: Place) => boolean; sort: (a: Place, b: Place) => number;
}
export const collectionDefs: CollectionDef[] = [
  {
    slug: 'fast-wifi-dubai', title: 'Places with fast Wi-Fi in Dubai', short: 'Fast Wi-Fi',
    description: 'Cafés and workspaces in Dubai where a speed test showed 50 Mbps or more, with sockets and noise for each.',
    criteria: 'Included when the speed test noted with the place showed a download speed of 50 Mbps or more. It’s one test from when the place was added, not a live reading.',
    rule: 'where a speed test showed 50 Mbps or more',
    icon: 'lightning', explore: '/explore/?fast=true',
    test: isFast, sort: (a, b) => (b.wifiSpeed?.downMbps ?? 0) - (a.wifiSpeed?.downMbps ?? 0),
  },
  {
    slug: 'plenty-of-sockets-dubai', title: 'Places with plenty of power sockets in Dubai', short: 'Plenty of sockets',
    description: 'Cafés and workspaces in Dubai rated 4 or 5 out of 5 for power sockets, so you can stay plugged in.',
    criteria: 'Included when sockets were rated 4 (Plenty) or 5 (Lots) out of 5 on our list. Seats near a socket can still fill up.',
    rule: 'where sockets were rated 4 or 5 out of 5',
    icon: 'plug', explore: '/explore/?sockets=true',
    test: hasPlentySockets, sort: (a, b) => (b.sockets ?? 0) - (a.sockets ?? 0) || (b.wifiSpeed?.downMbps ?? 0) - (a.wifiSpeed?.downMbps ?? 0),
  },
  {
    slug: 'places-for-calls-dubai', title: 'Places in Dubai where calls are okay', short: 'Okay for calls',
    description: 'Cafés and workspaces in Dubai noted as quiet or only moderately noisy, so a work call is manageable.',
    criteria: 'Included when the noise level was noted as quiet or moderate. Moderate means some background noise: fine for a catch-up, less so for presenting.',
    rule: 'where noise was noted as quiet or moderate',
    icon: 'phone-call', explore: '/explore/?calls=true',
    test: okForCalls, sort: (a, b) => (a.noise === 'quiet' ? 0 : 1) - (b.noise === 'quiet' ? 0 : 1) || (b.wifiSpeed?.downMbps ?? 0) - (a.wifiSpeed?.downMbps ?? 0),
  },
  {
    slug: 'visited-by-elsewhere-dubai', title: 'Places in Dubai visited by Elsewhere', short: 'Visited by Elsewhere',
    description: 'Cafés and workspaces in Dubai that someone from Elsewhere has worked from, with Wi-Fi, sockets and noise for each.',
    criteria: 'Included when the place is marked Visited on our list, meaning someone from Elsewhere worked from there. It doesn’t mean the details have been checked recently.',
    rule: 'someone from Elsewhere has worked from',
    icon: 'check-circle',
    test: p => p.visited, sort: byDetail,
  },
];
export interface Collection extends CollectionDef { path: string; places: Place[] }
export const collectionPages = (all: Place[]): Collection[] => collectionDefs
  .map(c => ({ ...c, path: `/collections/${c.slug}/`, places: all.filter(c.test).sort(c.sort) }))
  .filter(c => c.places.length >= MIN_COLLECTION_PLACES);
export const collectionsFor = (p: Place, all: Place[]) => collectionPages(all).filter(c => c.test(p));

/** Most complete listings first, then by name. */
export function byDetail(a: Place, b: Place) { return knownFacts(b) - knownFacts(a) || a.name.localeCompare(b.name); }
export function sortByDetail(list: Place[]) { return [...list].sort(byDetail); }

// ---------- Plain-language summaries ----------

const typeNouns: Record<string, string> = { 'Café': 'café', 'Co-working': 'co-working space', Restaurant: 'restaurant', Bar: 'bar' };
export const typeNoun = (p: Place) => (p.category && typeNouns[p.category]) || 'place';
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const list = (items: string[]) => items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
const where = (p: Place) => p.neighbourhood ? ` in ${p.neighbourhood}` : '';

/** "Friends Avenue JLT – Café in JLT, Dubai | Elsewhere" */
export function placeTitle(p: Place) {
  const full = `${p.name} – ${cap(typeNoun(p))} in ${p.neighbourhood ? `${p.neighbourhood}, ` : ''}Dubai | ${SITE_NAME}`;
  // Long names drop ", Dubai" so the title stays within what results pages show.
  return full.length <= 70 || !p.neighbourhood ? full : `${p.name} – ${cap(typeNoun(p))} in ${p.neighbourhood} | ${SITE_NAME}`;
}

/** Page intro: one sentence on what it's like, then how old the details are. The facts sit right below it. */
export function verdict(p: Place): string {
  const noun = typeNoun(p);
  const open: Record<string, string> = {
    quiet: `A quiet ${noun}${where(p)} that suits focused work and calls.`,
    moderate: `A ${noun}${where(p)} with some background noise: fine for emails and catch-ups, and calls are okay.`,
    loud: `A lively ${noun}${where(p)}, better for a short session of emails than for calls or deep focus.`,
  };
  const first = p.noise ? open[p.noise] : `A ${noun}${where(p)}${p.visited ? ' that Elsewhere has worked from' : ' on the Elsewhere list'}.`;
  return `${first} Added in ${monthYear(p.addedAt)}, not rechecked since.`;
}

/** Meta description: what it is and the key facts, about 150 characters. */
export function placeDescription(p: Place): string {
  const facts = [p.wifiSpeed ? `${formatMbps(p.wifiSpeed.downMbps)} Wi-Fi` : '', p.sockets ? socketChips[p.sockets].toLowerCase() : '', p.noise ? `${p.noise} noise` : ''].filter(Boolean);
  const lead = `${p.name}: ${typeNoun(p)}${where(p)}, Dubai.`;
  return facts.length ? `${lead} Noted with ${list(facts)}. Working here: Wi-Fi, sockets, noise and directions.` : `${lead} What we know about working here, with directions and what’s still to be added.`;
}

export interface QA { q: string; a: string }
/** Questions are only returned when the list has something real to say. */
export function questions(p: Place): QA[] {
  const when = monthYear(p.addedAt);
  const out: QA[] = [];
  if (p.visited) out.push({ q: `Can I work on my laptop at ${p.name}?`, a: `Someone from Elsewhere worked from here; it was added to the list in ${when}. The laptop policy itself hasn’t been noted, so check with staff, especially at busy times.` });
  if (p.amenities.wifi.value === 'no') out.push({ q: `Does ${p.name} have Wi-Fi?`, a: `${p.amenities.wifi.note} Plan to use a hotspot.` });
  else if (p.wifiSpeed || p.wifiAccess.value !== 'unknown' || p.amenities.wifi.value === 'yes') {
    const speed = p.wifiSpeed ? ` A speed test showed ${formatMbps(p.wifiSpeed.downMbps)} download (${speedTier(p.wifiSpeed.downMbps).toLowerCase()}).` : '';
    const access = p.wifiAccess.password ? ' The guest password is under Plan a visit.' : p.wifiAccess.value === 'open' ? ' It didn’t need a password.' : p.wifiAccess.value === 'signup' ? ' You join through a sign-up page.' : '';
    out.push({ q: `Does ${p.name} have Wi-Fi?`, a: `Yes, as of ${when}.${speed}${access}` });
  }
  if (p.sockets) out.push({ q: 'Are there power sockets?', a: `${p.sockets >= 3 ? 'Yes' : 'A few'}: rated ${p.sockets} out of 5 (${socketWords[p.sockets]}) in ${when}.${p.sockets <= 2 ? ' Arrive with a full battery.' : ''}` });
  if (p.noise) {
    const calls = { quiet: 'Yes. It was noted as quiet, so calls should be fine.', moderate: 'Mostly. There’s some background noise, so calls are okay but it’s not ideal for presenting.', loud: 'Not really. It was noted as loud, so step outside or pick somewhere quieter for calls.' } as const;
    const focus = { quiet: 'Yes, it was noted as quiet.', moderate: 'It depends on you: there’s some background noise. Headphones help.', loud: 'Probably not. It was noted as loud; it suits a short session better.' } as const;
    out.push({ q: 'Is it suitable for calls?', a: `${calls[p.noise]} Noted in ${when}.` });
    out.push({ q: 'Is it quiet enough for focused work?', a: focus[p.noise] });
  }
  return out;
}

/** Answer-first intro for a set of places: how many, what kinds, and the standout facts. */
/** Short answer-first intro for a guide page: what's here, then the fastest place. The table carries the rest. */
export function groupAnswer(items: Place[], label: string, opening?: string): string {
  const kinds = new Map<string, number>();
  for (const p of items) kinds.set(typeNoun(p), (kinds.get(typeNoun(p)) ?? 0) + 1);
  const named = [...kinds].filter(([k]) => k !== 'place').sort((a, b) => b[1] - a[1]).map(([k, n]) => n === 1 ? `${/^[aeiou]/.test(k) ? 'an' : 'a'} ${k}` : `${n} ${k}s`);
  const untyped = kinds.get('place') ?? 0;
  const mix = list([...named, ...(untyped ? [untyped === 1 ? 'one place whose type isn’t noted' : `${untyped} places whose type isn’t noted`] : [])]);
  const s = [opening ?? (kinds.size === 1 && !untyped ? `${items.length} ${[...kinds.keys()][0]}s ${label}.` : `${items.length} places ${label}: ${mix}.`)];
  const fastest = items.filter(p => p.wifiSpeed).sort((a, b) => b.wifiSpeed!.downMbps - a.wifiSpeed!.downMbps)[0];
  if (fastest) s.push(`${fastest.name} had the fastest Wi-Fi when tested, at ${formatMbps(fastest.wifiSpeed!.downMbps)}.`);
  return s.join(' ');
}

export function yearSpan(items: Place[]) {
  const years = items.map(p => Number(p.addedAt.slice(0, 4)));
  const lo = Math.min(...years), hi = Math.max(...years);
  return lo === hi ? `in ${lo}` : `between ${lo} and ${hi}`;
}

// ---------- JSON-LD ----------

type Json = Record<string, unknown>;
export const abs = (path: string, site: URL) => new URL(path, site).href;
const orgId = (site: URL) => abs('/#organization', site);
const siteId = (site: URL) => abs('/#website', site);

export function homeGraph(site: URL): Json {
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', '@id': siteId(site), url: site.href, name: SITE_NAME, description: SITE_DESCRIPTION, inLanguage: 'en-GB', publisher: { '@id': orgId(site) } },
    { '@type': 'Organization', '@id': orgId(site), name: SITE_NAME, url: site.href, slogan: 'Work from somewhere new.', description: SITE_DESCRIPTION,
      logo: { '@type': 'ImageObject', url: abs('/icon-512.png', site), width: 512, height: 512 },
      founder: { '@type': 'Person', name: 'Tajdid Rahman', url: 'https://tajdidrahman.co.uk' } },
  ] };
}

export function breadcrumbs(items: [string, string?][], site: URL): Json {
  return { '@type': 'BreadcrumbList', itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(path ? { item: abs(path, site) } : {}) })) };
}

const itemList = (items: Place[], site: URL): Json => ({ '@type': 'ItemList', numberOfItems: items.length,
  itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/places/${p.slug}/`, site), name: p.name })) });

/** CollectionPage for Explore, neighbourhood and collection pages; the list matches the cards on the page. */
export function collectionGraph(o: { path: string; name: string; description: string; items: Place[]; crumbs: [string, string?][]; about?: Json }, site: URL): Json {
  const url = abs(o.path, site);
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': url, url, name: o.name, description: o.description, inLanguage: 'en-GB', isPartOf: { '@id': siteId(site) }, ...(o.about ? { about: o.about } : {}), mainEntity: itemList(o.items, site), breadcrumb: breadcrumbs(o.crumbs, site) },
  ] };
}

const dubai: Json = { '@type': 'City', name: 'Dubai', containedInPlace: { '@type': 'Country', name: 'United Arab Emirates' } };
export const areaEntity = (name: string): Json => ({ '@type': 'Place', name: `${name}, Dubai`, ...(areaFullName(name) ? { alternateName: areaFullName(name) } : {}), containedInPlace: dubai });

const schemaTypes: Record<string, string> = { 'Café': 'CafeOrCoffeeShop', Restaurant: 'Restaurant', Bar: 'BarOrPub' };
/** The venue itself. No address, geo, hours, image or rating: the list has none of those (photos are stand-ins). */
export function placeGraph(p: Place, site: URL, crumbs: [string, string?][]): Json {
  const url = abs(`/places/${p.slug}/`, site);
  const feature = (name: string, value: boolean) => ({ '@type': 'LocationFeatureSpecification', name, value });
  const features = [
    p.amenities.wifi.value !== 'unknown' ? feature('Wi-Fi', p.amenities.wifi.value === 'yes') : null,
    p.amenities.power.value !== 'unknown' ? feature('Power sockets', p.amenities.power.value === 'yes') : null,
  ].filter(Boolean);
  const venue: Json = {
    '@type': (p.category && schemaTypes[p.category]) || 'LocalBusiness', '@id': `${url}#place`, name: p.name,
    ...(p.summary ? { description: p.summary } : {}),
    ...(p.website ? { url: p.website } : {}),
    ...(p.mapsUrl ? { hasMap: p.mapsUrl } : {}),
    address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
    containedInPlace: p.neighbourhood ? areaEntity(p.neighbourhood) : dubai,
    ...(features.length ? { amenityFeature: features } : {}),
    ...(p.entry ? { isAccessibleForFree: p.entry === 'free' } : {}),
  };
  return { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': url, url, name: placeTitle(p).replace(` | ${SITE_NAME}`, ''), description: verdict(p), inLanguage: 'en-GB', isPartOf: { '@id': siteId(site) }, about: { '@id': `${url}#place` }, breadcrumb: breadcrumbs(crumbs, site) },
    venue,
  ] };
}
