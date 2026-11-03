import { placeSchema, type Place } from './schema';
import data from '../data/places.json';
export const places: Place[] = placeSchema.array().parse(data);
if (new Set(places.map(p=>p.id)).size !== places.length || new Set(places.map(p=>p.slug)).size !== places.length) throw new Error('Duplicate place ID or slug');
