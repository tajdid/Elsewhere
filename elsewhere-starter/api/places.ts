// Vercel function: place suggestions and details for the Submit a place form (Google Places API, New).
// Needs GOOGLE_PLACES_API_KEY (server-only). See README.md, "Place search".
import { handlePlaces, placesLimiter } from './_lib/places-handler.js';
import matches from '../src/data/google-places.json' with { type: 'json' };

const limiter = placesLimiter();
const knownIds = new Set(Object.values(matches as Record<string, { googlePlaceId: string }>).map(m => m.googlePlaceId));

export async function POST(request: Request): Promise<Response> {
  return handlePlaces(request, { key: process.env.GOOGLE_PLACES_API_KEY, knownIds, fetch, now: Date.now, limiter, log: m => console.error(m) });
}
