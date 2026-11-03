import {test} from 'node:test';
import assert from 'node:assert/strict';
import {places} from '../src/lib/places';
import {evidenceState,evidenceLabel,evidenceTone,filterPlaces,directionsUrl,parseSaved} from '../src/lib/discovery';
import {placeSchema,evidenceSchema,type Evidence} from '../src/lib/schema';
const now=Date.parse('2026-11-03T12:00:00Z');
const verified:Evidence={value:'yes',status:'verified',source:'Test observation',checkedAt:new Date(now).toISOString(),note:'Fixture'};
test('fixture catalogue is valid, unique, fictional and has no precise destinations',()=>{
 assert.equal(places.length,8);assert.equal(new Set(places.map(p=>p.slug)).size,8);
 for(const p of places){assert.ok(placeSchema.safeParse(p).success);assert.equal(p.isSample,true);assert.equal(p.coordinates,null);assert.equal(p.address,null);}
});
test('search normalizes case, spaces and requires all words',()=>{
 assert.equal(filterPlaces(places,{q:'  JLT   CO-WORKING '},now)[0]?.id,'demo-03');
 assert.equal(filterPlaces(places,{q:'JLT JVC'},now).length,0);
});
test('category, area and mode combine with AND',()=>{
 assert.deepEqual(filterPlaces(places,{category:'Co-working',neighbourhood:'JVC',mode:'Focus'},now).map(p=>p.id),['demo-07']);
});
test('positive amenity filters never treat unverified or absent evidence as yes',()=>{
 for(const status of ['unknown','reported','conflicting'] as const){const p=structuredClone(places[0]);p.amenities.wifi={...verified,status};assert.equal(filterPlaces([p],{wifi:true},now).length,0);}
 const p=structuredClone(places[0]);p.amenities.wifi={...verified,value:'no'};assert.equal(filterPlaces([p],{wifi:true},now).length,0);
 p.amenities.wifi=verified;assert.equal(filterPlaces([p],{wifi:true},now).length,1);
 p.amenities.power={...verified,value:'no'};assert.equal(filterPlaces([p],{wifi:true,power:true},now).length,0);
 p.amenities.power=verified;assert.equal(filterPlaces([p],{wifi:true,power:true},now).length,1);
});
test('freshness boundary, old and future observations',()=>{
 const boundary={...verified,checkedAt:new Date(now-90*86400000).toISOString()};
 assert.equal(evidenceState(boundary,now),'verified');assert.equal(evidenceState(boundary,now+1),'stale');
 assert.equal(evidenceState({...verified,checkedAt:new Date(now+1).toISOString()},now),'stale');
 assert.match(evidenceLabel(boundary,now+1),/Needs recheck/);
 const p=structuredClone(places[0]);p.amenities.wifi=boundary;assert.equal(filterPlaces([p],{wifi:true},now+1).length,0);
});
test('verified schema requires evidence; unknown is not affirmative',()=>{
 assert.equal(evidenceSchema.safeParse({...verified,source:null}).success,false);
 assert.equal(evidenceSchema.safeParse({...verified,checkedAt:null}).success,false);
 assert.equal(evidenceSchema.safeParse({...verified,value:'unknown'}).success,false);
 assert.equal(evidenceSchema.safeParse({...verified,status:'unknown'}).success,false);
});
test('saved data safely rejects malformed, old and unknown values',()=>{
 for(const raw of ['{','null','[]','{"version":2,"ids":["demo-01"]}','{"version":1,"ids":"demo-01"}'])assert.deepEqual(parseSaved(raw,places.map(p=>p.id)),[]);
 assert.deepEqual(parseSaved('{"version":1,"ids":["demo-01","bogus","demo-01",22]}',places.map(p=>p.id)),['demo-01']);
});
test('directions distinguish sample neighbourhood and real precise destination',()=>{
 assert.match(decodeURIComponent(directionsUrl(places[0])),/destination=JVC, Dubai, UAE/);
 const real={...places[0],isSample:false,coordinates:{lat:25.1,lng:55.2}};assert.match(decodeURIComponent(directionsUrl(real)),/destination=25.1,55.2/);
 assert.match(decodeURIComponent(directionsUrl({...real,coordinates:null,address:'A & B, Dubai'})),/destination=A & B, Dubai/);
});
test('evidence tone is positive only for a current verified yes',()=>{
 assert.equal(evidenceTone(verified,now),'positive');
 assert.equal(evidenceTone({...verified,value:'no'},now),'negative');
 assert.equal(evidenceTone({...verified,status:'reported'},now),'caution');
 assert.equal(evidenceTone({...verified,value:'unknown',status:'conflicting'},now),'caution');
 assert.equal(evidenceTone({...verified,checkedAt:new Date(now-91*86400000).toISOString()},now),'caution');
 assert.equal(evidenceTone({...verified,checkedAt:new Date(now+86400000).toISOString()},now),'caution');
 assert.equal(evidenceTone({value:'unknown',status:'unknown',source:null,checkedAt:null,note:''},now),'unknown');
});
