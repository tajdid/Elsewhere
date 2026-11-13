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
export interface Filters { q?:string; category?:string; neighbourhood?:string; mode?:string; fast?:boolean; sockets?:boolean; calls?:boolean; wifi?:boolean; power?:boolean; }
/** Quick filters on the list's own facts. They say what was reported, not that anyone re-verified it. */
export const FAST_MBPS = 50;
export const isFast = (p: Place) => !!p.wifiSpeed && p.wifiSpeed.downMbps >= FAST_MBPS;
export const hasPlentySockets = (p: Place) => (p.sockets ?? 0) >= 4;
export const okForCalls = (p: Place) => p.noise === 'quiet' || p.noise === 'moderate';
export function filterPlaces(items: Place[], f: Filters, now = Date.now()) {
 const words = (f.q || '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return items.filter(p => words.every(word=>`${p.name} ${p.neighbourhood} ${p.tags.join(' ')} ${p.locationNote ?? ''} ${p.summary}`.toLocaleLowerCase().includes(word))
  && (!f.category || p.tags.some(t => t === f.category)) && (!f.neighbourhood || p.neighbourhood === f.neighbourhood)
  && (!f.mode || p.modes.some(m=>m === f.mode))
  && (!f.wifi || verifiedYes(p.amenities.wifi,now))
  && (!f.power || verifiedYes(p.amenities.power,now))
  && (!f.fast || isFast(p)) && (!f.sockets || hasPlentySockets(p)) && (!f.calls || okForCalls(p)));
}
/** Google Maps for a place: the owner's own map link when there is one, then validated coordinates or address,
 * otherwise a Maps search for the name and whatever location the list gives. A search is labelled as a search. */
export function directionsUrl(p: Place) {
 if (p.mapsUrl) return p.mapsUrl;
 if (!p.isSample && p.coordinates) return `https://www.google.com/maps/dir/?api=1&destination=${p.coordinates.lat},${p.coordinates.lng}`;
 if (!p.isSample && p.address) return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(p.address)}`;
 const where = [p.name, p.locationNote || p.neighbourhood, 'Dubai'].filter(Boolean).join(', ');
 return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(where)}`;
}
export const directionsIsSearch = (p: Place) => !p.mapsUrl && !(!p.isSample && (p.coordinates || p.address));
export function parseSaved(raw: string | null, validIds: string[]) : string[] {
 try { const parsed:unknown = JSON.parse(raw || 'null');
  if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1 || !('ids' in parsed) || !Array.isArray(parsed.ids)) return [];
  return [...new Set(parsed.ids.filter((id):id is string=> typeof id === 'string' && validIds.includes(id)))];
 } catch { return []; }
}
