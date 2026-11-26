import { z } from 'zod';
export const amenityKeys = ['wifi','power','laptops','calls','stepFree'] as const;
export const amenityLabels = {wifi:'Wi-Fi',power:'Power sockets',laptops:'Laptop policy',calls:'Calls and meetings',stepFree:'Step-free access'} as const satisfies Record<typeof amenityKeys[number],string>;
export const modes =['Focus','Casual','Meetings','Together'] as const;
export const categories = ['Café','Co-working','Restaurant','Bar'] as const;
export const noiseLevels = ['quiet','moderate','loud'] as const;
export const evidenceSchema = z.object({
  value: z.enum(['yes','no','unknown']),
  status: z.enum(['unknown','reported','verified','conflicting']),
  source: z.string().nullable(),
  checkedAt: z.string().datetime().nullable(),
  note: z.string(),
}).superRefine((e,ctx) => {
  if (e.status === 'verified' && (!e.source || !e.checkedAt || e.value === 'unknown')) ctx.addIssue({code:'custom',message:'Verified evidence requires source, timestamp and known value'});
  if (e.status === 'unknown' && e.value !== 'unknown') ctx.addIssue({code:'custom',message:'Unknown evidence must have unknown value'});
});
// Wi-Fi details sit beside the Wi-Fi evidence: a dated speed test and how you get on the network.
// Guest passwords are shown at the owner's request, dated like everything else (they change).
export const wifiAccessValues = ['open','password','signup','unknown'] as const;
export const wifiSpeedSchema = z.object({
  downMbps: z.number().positive().max(10000), upMbps: z.number().positive().max(10000).nullable(),
  measuredAt: z.string().datetime(), source: z.string().min(1),
});
// `password` is the guest password as listed, shown with a Copy button; only for value "password".
export const wifiAccessSchema = z.object({ value: z.enum(wifiAccessValues), password: z.string().min(1).max(64).nullable(), source: z.string().nullable(), checkedAt: z.string().datetime().nullable() })
  .refine(a => a.value === 'unknown' || (a.source && a.checkedAt), 'Known Wi-Fi access needs a source and date')
  .refine(a => !a.password || a.value === 'password', 'Only a password-protected network has a password');
// Parking and pets: suggested by visitors (Nov 2026). Dated like Wi-Fi access, never inferred, and "unknown" until someone reports it.
// Parking records the kind and whether it's free, not a price: prices change too often to keep accurate.
export const parkingValues = ['street','carpark','valet','none','unknown'] as const;
export const parkingCostValues = ['free','paid','unknown'] as const;
export const parkingSchema = z.object({ value: z.enum(parkingValues), cost: z.enum(parkingCostValues), source: z.string().nullable(), checkedAt: z.string().datetime().nullable() })
  .refine(a => a.value === 'unknown' || (a.source && a.checkedAt), 'Known parking needs a source and date')
  .refine(a => (a.value !== 'none' && a.value !== 'unknown') || a.cost === 'unknown', 'Parking cost only applies when there is parking');
// Pets: welcome inside, outdoor seating only, or not allowed. Policies vary, so a place is only shown as pet-friendly from a dated report.
export const petsValues = ['inside','outdoor','no','unknown'] as const;
export const petsSchema = z.object({ value: z.enum(petsValues), source: z.string().nullable(), checkedAt: z.string().datetime().nullable() })
  .refine(a => a.value === 'unknown' || (a.source && a.checkedAt), 'Known pet policy needs a source and date');
// Usual weekly hours, as checked: [open, close] in 24-hour Dubai time, a close at or before open runs past midnight; null = closed.
export const dayKeys = ['mon','tue','wed','thu','fri','sat','sun'] as const;
const hhmm = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const day = z.tuple([hhmm, hhmm]).nullable();
export const hoursSchema = z.object({
  source: z.string().min(1), checkedAt: z.string().datetime(),
  week: z.object({ mon: day, tue: day, wed: day, thu: day, fri: day, sat: day, sun: day }),
});
export const placeSchema = z.object({
  id:z.string().min(1), slug:z.string().regex(/^[a-z0-9-]+$/), name:z.string().min(1),
  isSample:z.boolean(),
  // Primary type, then every type the place was listed with. Null when nobody has said what kind of place it is.
  category:z.enum(categories).nullable(), tags:z.array(z.enum(categories)),
  // Empty string = area not added yet; shown as a placeholder, never guessed.
  neighbourhood:z.string(), summary:z.string(),
  image:z.string().nullable(), imageAlt:z.string().nullable(), imageCredit:z.string().nullable(),
  // From the owner's list: sockets on a 1–5 scale, noise level, entry, and links.
  sockets:z.number().int().min(1).max(5).nullable(), noise:z.enum(noiseLevels).nullable(), entry:z.enum(['free','buy','paid']).nullable(), // buy: expected to buy something to sit and work
  mapsUrl:z.string().url().nullable(), locationNote:z.string().nullable(), menuUrl:z.string().url().nullable(),
  visited:z.boolean(), addedAt:z.string().datetime(),
  modes:z.array(z.enum(modes)), priceNote:z.string(), hoursNote:z.string(), policyNote:z.string(),
  address:z.string().nullable(), coordinates:z.object({lat:z.number().min(-90).max(90),lng:z.number().min(-180).max(180)}).nullable(),
  website:z.string().url().nullable(),
  // Google place ID, confirmed by the owner (src/data/google-places.json, merged in src/lib/places.ts). Gives exact directions.
  googlePlaceId:z.string().nullable().default(null),
  amenities:z.object({wifi:evidenceSchema,power:evidenceSchema,laptops:evidenceSchema,calls:evidenceSchema,stepFree:evidenceSchema}),
  wifiSpeed:wifiSpeedSchema.nullable(), wifiAccess:wifiAccessSchema, hours:hoursSchema.nullable(),
  parking:parkingSchema, pets:petsSchema,
}).superRefine((p,ctx) => {
  if (p.amenities.wifi.value === 'no' && (p.wifiSpeed || p.wifiAccess.value !== 'unknown')) ctx.addIssue({code:'custom',message:`${p.id}: Wi-Fi details recorded for a place with no Wi-Fi`});
});
export type Place = z.infer<typeof placeSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type Mode = typeof modes[number];
export type WifiSpeed = z.infer<typeof wifiSpeedSchema>;
export type WifiAccess = z.infer<typeof wifiAccessSchema>;
export type Hours = z.infer<typeof hoursSchema>;
export type Parking = z.infer<typeof parkingSchema>;
export type Pets = z.infer<typeof petsSchema>;
export type DayKey = typeof dayKeys[number];
