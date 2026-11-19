// Vercel function: place suggestions and details for the Submit a place form (Google Places API, New).
// Needs GOOGLE_PLACES_API_KEY (server-only). See README.md, "Place search".
import { handlePlaces, placesLimiter } from './_lib/places-handler.js';

const limiter = placesLimiter();

export async function POST(request: Request): Promise<Response> {
  return handlePlaces(request, { key: process.env.GOOGLE_PLACES_API_KEY, fetch, now: Date.now, limiter, log: m => console.error(m) });
}
