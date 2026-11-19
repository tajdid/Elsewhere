// Search pages and summaries: only built from real data, thresholds respected, nothing claims verification.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { places } from '../src/lib/places';
import { areaPages, collectionPages, MIN_AREA_PLACES, MIN_COLLECTION_PLACES, placeIsIndexable, verdict, questions, placeTitle, placeGraph, homeGraph, areaSlug } from '../src/lib/seo';

const site = new URL('https://example.test');

test('neighbourhood pages only exist for areas with enough places, and list only that area', () => {
  const areas = areaPages(places);
  assert.ok(areas.length > 0);
  for (const a of areas) {
    assert.ok(a.places.length >= MIN_AREA_PLACES, a.name);
    assert.ok(a.places.every(p => p.neighbourhood === a.name));
    assert.equal(a.path, `/dubai/${areaSlug(a.name)}/`);
  }
  assert.equal(areaSlug('Dubai Marina'), 'dubai-marina');
});

test('collections only contain places that meet their rule and are skipped when too small', () => {
  for (const c of collectionPages(places)) {
    assert.ok(c.places.length >= MIN_COLLECTION_PLACES, c.slug);
    assert.ok(c.places.every(c.test), c.slug);
    assert.equal(c.places.length, places.filter(c.test).length);
  }
});

test('thin place pages are not indexable', () => {
  const thin = places.find(p => !p.wifiSpeed && !p.sockets && !p.noise && p.wifiAccess.value === 'unknown' && !p.summary);
  if (thin) assert.equal(placeIsIndexable(thin), false);
  assert.ok(places.filter(placeIsIndexable).length > 0);
});

test('verdicts are short, dated and never claim verification', () => {
  for (const p of places) {
    const v = verdict(p);
    assert.match(v, /not rechecked since/);
    assert.doesNotMatch(v, /verified/i);
    assert.ok(v.length <= 160, v);
  }
});

test('questions only appear when the list supports an answer', () => {
  for (const p of places) {
    const qs = questions(p).map(x => x.q);
    if (!p.noise) assert.ok(!qs.includes('Is it suitable for calls?'));
    if (!p.sockets) assert.ok(!qs.includes('Are there power sockets?'));
    if (!p.visited) assert.ok(!qs.some(q => q.startsWith('Can I work on my laptop')));
  }
});

test('titles fit and venue JSON-LD has no invented address, geo, hours, image or rating', () => {
  for (const p of places) {
    assert.ok(placeTitle(p).length <= 75, placeTitle(p));
    const json = JSON.stringify(placeGraph(p, site, [['Explore', '/explore/'], [p.name]]));
    for (const key of ['streetAddress', '"geo"', 'openingHours', '"image"', 'aggregateRating', '"review"']) assert.ok(!json.includes(key), `${p.id} ${key}`);
  }
  assert.ok(!JSON.stringify(homeGraph(site)).includes('sameAs'));
});
