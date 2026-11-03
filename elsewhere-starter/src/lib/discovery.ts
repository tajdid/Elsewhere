import type { Evidence, Place } from './schema';
export const STALE_DAYS = 90;
export function evidenceState(e: Evidence, now = Date.now()) {
 if (e.status === 'verified' && e.checkedAt && (now - Date.parse(e.checkedAt) > STALE_DAYS * 86400000 || Date.parse(e.checkedAt) > now)) return 'stale';
 return e.status;
}
export function evidenceLabel(e: Evidence, now = Date.now()) {
 const state = evidenceState(e, now);
 if (state === 'unknown') return 'Not checked';
 if (state === 'conflicting') return 'Conflicting reports';
 const value = e.value === 'yes' ? 'Yes' : e.value === 'no' ? 'No' : 'Unknown';
 return `${value} · ${state === 'stale' ? 'Needs recheck' : state === 'reported' ? 'Reported' : 'Verified'}`;
}
/** Visual tone for an evidence pill. Only a current, independently verified "yes" is positive. */
export type EvidenceTone = 'positive' | 'negative' | 'caution' | 'unknown';
export function evidenceTone(e: Evidence, now = Date.now()): EvidenceTone {
 const state = evidenceState(e, now);
 if (state === 'verified') return e.value === 'yes' ? 'positive' : 'negative';
 if (state === 'unknown') return 'unknown';
 return 'caution';
}
export const verifiedYes = (e: Evidence, now = Date.now()) => evidenceTone(e, now) === 'positive';
export interface Filters { q?:string; category?:string; neighbourhood?:string; mode?:string; wifi?:boolean; power?:boolean; }
export function filterPlaces(items: Place[], f: Filters, now = Date.now()) {
 const words = (f.q || '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return items.filter(p => words.every(word=>`${p.name} ${p.neighbourhood} ${p.category} ${p.summary}`.toLocaleLowerCase().includes(word))
  && (!f.category || p.category === f.category) && (!f.neighbourhood || p.neighbourhood === f.neighbourhood)
  && (!f.mode || p.modes.some(m=>m === f.mode))
  && (!f.wifi || verifiedYes(p.amenities.wifi,now))
  && (!f.power || verifiedYes(p.amenities.power,now)));
}
export function directionsUrl(p: Place) {
 const destination = !p.isSample && p.coordinates ? `${p.coordinates.lat},${p.coordinates.lng}` : !p.isSample && p.address ? p.address : `${p.neighbourhood}, Dubai, UAE`;
 return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
export function parseSaved(raw: string | null, validIds: string[]) : string[] {
 try { const parsed:unknown = JSON.parse(raw || 'null');
  if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1 || !('ids' in parsed) || !Array.isArray(parsed.ids)) return [];
  return [...new Set(parsed.ids.filter((id):id is string=> typeof id === 'string' && validIds.includes(id)))];
 } catch { return []; }
}
