import {test} from 'node:test';
import assert from 'node:assert/strict';
import {places} from '../src/lib/places';
import {evidenceState,evidenceLabel,evidenceTone,filterPlaces,directionsUrl,parseSaved} from '../src/lib/discovery';
import {placeSchema,evidenceSchema,type Evidence} from '../src/lib/schema';
import {validateSubmission,buildSubmission,parseReports,addReport,dubaiToday,parseMbps,type StoredReport} from '../src/lib/submissions';
import {speedTier,formatMbps,speedIsStale,accessLabels,dubaiDay,formatTime,formatRange,usualTodayText} from '../src/lib/details';
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
test('submissions: required fields, no future visit dates (Dubai time), clean payload',()=>{
 assert.deepEqual(validateSubmission({name:' ',neighbourhood:'',visitedOn:''},now),['name','neighbourhood','visitedOn']);
 const today=dubaiToday(now);assert.equal(today,'2026-11-03');
 assert.deepEqual(validateSubmission({name:'A',neighbourhood:'JLT',visitedOn:today},now),[]);
 assert.deepEqual(validateSubmission({name:'A',neighbourhood:'JLT',visitedOn:'2026-11-04'},now),['visitedOn']);
 assert.deepEqual(validateSubmission({name:'A',neighbourhood:'JLT',visitedOn:'03/11/2026'},now),['visitedOn']);
 const s=buildSubmission({name:'  Long  '+'x'.repeat(200),neighbourhood:' JLT ',category:'Spa',visitedOn:today,wifi:'yes',power:'maybe',notes:' hi '},null,now);
 assert.equal(s.kind,'new');assert.equal(s.name.length,120);assert.equal(s.neighbourhood,'JLT');assert.equal(s.category,'Café');
 assert.deepEqual(s.amenities,{wifi:'yes',power:'unsure',laptops:'unsure',calls:'unsure',stepFree:'unsure'});assert.equal(s.notes,'hi');
 assert.equal(buildSubmission({name:'A'},'demo-01',now).kind,'update');
});
test('stored reports reject malformed data and stay capped',()=>{
 for(const raw of ['{','null','{}','[{"version":2}]','[{"version":1,"name":"x","submittedAt":"t","delivery":"elsewhere"}]'])assert.deepEqual(parseReports(raw),[]);
 const r:StoredReport={...buildSubmission({name:'A',neighbourhood:'B',visitedOn:'2026-11-01'},null,now),delivery:'device'};
 assert.equal(parseReports(JSON.stringify([r])).length,1);
 let list:StoredReport[]=[];for(let i=0;i<60;i++)list=addReport(list,{...r,name:String(i)});assert.equal(list.length,50);assert.equal(list[0].name,'59');
});
test('Wi-Fi speed: tiers, formatting and the 90-day retest rule',()=>{
 assert.equal(speedTier(112),'Plenty for video calls');assert.equal(speedTier(24),'Good for video calls');assert.equal(speedTier(6.5),'Fine for email and browsing');assert.equal(speedTier(2),'Slow for most work');
 assert.equal(formatMbps(38.4),'38 Mbps');assert.equal(formatMbps(6.54),'6.5 Mbps');
 const s={downMbps:20,upMbps:null,measuredAt:'2026-10-20T09:00:00Z',source:'Editorial speed test'};
 assert.equal(speedIsStale(s,now),false);assert.equal(speedIsStale({...s,measuredAt:'2026-05-01T09:00:00Z'},now),true);
 assert.equal(speedIsStale({...s,measuredAt:'2026-12-01T09:00:00Z'},now),true,'future-dated tests are not trusted');
 assert.equal(accessLabels.unknown,'Access not checked');
});
test('usual hours use Dubai weekdays and never say "open now"',()=>{
 assert.equal(dubaiDay(Date.parse('2026-11-13T21:30:00Z')),'sat','21:30 UTC Friday is Saturday in Dubai');
 assert.equal(formatTime('08:00'),'8 am');assert.equal(formatTime('13:30'),'1:30 pm');assert.equal(formatTime('00:00'),'midnight');assert.equal(formatTime('12:00'),'noon');
 assert.equal(formatRange(['06:00','01:00']),'6 am – 1 am');assert.equal(formatRange(null),'Closed');assert.equal(formatRange(['00:00','00:00']),'Open 24 hours');
 const week={mon:['08:00','17:00'],tue:null,wed:['00:00','00:00'],thu:null,fri:null,sat:null,sun:null} as const;
 assert.equal(usualTodayText(week as never,'mon'),'Usually 8 am – 5 pm today');assert.equal(usualTodayText(week as never,'tue'),'Usually closed today');assert.equal(usualTodayText(week as never,'wed'),'Usually open 24 hours today');
 for(const p of places)if(p.hours)for(const d of Object.keys(p.hours.week) as (keyof typeof p.hours.week)[])assert.doesNotMatch(usualTodayText(p.hours.week,d),/open now/i);
});
test('schema rejects Wi-Fi details on a place without Wi-Fi, and access claims without a source',()=>{
 const noWifi=places.find(p=>p.amenities.wifi.value==='no')!;
 assert.equal(placeSchema.safeParse({...noWifi,wifiSpeed:{downMbps:10,upMbps:null,measuredAt:'2026-10-20T09:00:00Z',source:'x'}}).success,false);
 assert.equal(placeSchema.safeParse({...places[0],wifiAccess:{value:'open',source:null,checkedAt:null}}).success,false);
 assert.equal(placeSchema.safeParse({...places[3],hours:{source:'x',checkedAt:'2026-10-20T09:00:00Z',week:{mon:['8:00','17:00'],tue:null,wed:null,thu:null,fri:null,sat:null,sun:null}}}).success,false);
});
test('reports carry an optional speed and an access answer, never a password field',()=>{
 assert.equal(parseMbps(''),null);assert.equal(parseMbps('38,4'),38.4);assert.equal(parseMbps('0'),undefined);assert.equal(parseMbps('fast'),undefined);assert.equal(parseMbps('2001'),undefined);
 assert.deepEqual(validateSubmission({name:'A',neighbourhood:'JLT',visitedOn:dubaiToday(now),wifiSpeed:'abc'},now),['wifiSpeed']);
 const s=buildSubmission({name:'A',neighbourhood:'JLT',visitedOn:dubaiToday(now),wifiSpeed:' 24 ',wifiAccess:'signup',password:'secret'} as Record<string,string>,null,now);
 assert.equal(s.wifiDownMbps,24);assert.equal(s.wifiAccess,'signup');assert.equal('password' in s,false);
 assert.equal(buildSubmission({name:'A',wifiAccess:'hack'},null,now).wifiAccess,'unsure');
});
