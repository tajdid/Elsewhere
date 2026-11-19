import { placeSchema, type Place } from './schema';
import data from '../data/places.json';
import googleMatches from '../data/google-places.json';
// Google place IDs live in their own file so a fresh import from Notion doesn't wipe them.
// Each one was proposed by scripts/match-places.ts and confirmed by the owner (scripts/apply-place-matches.ts).
const matches = googleMatches as Record<string, { googlePlaceId: string; confirmedAt: string }>;
export const places: Place[] = placeSchema.array().parse(data).map(p => matches[p.id] ? { ...p, googlePlaceId: matches[p.id].googlePlaceId } : p);
if (new Set(places.map(p=>p.id)).size !== places.length || new Set(places.map(p=>p.slug)).size !== places.length) throw new Error('Duplicate place ID or slug');
