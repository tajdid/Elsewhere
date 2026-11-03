import { z } from 'zod';
export const amenityKeys = ['wifi','power','laptops','calls','stepFree'] as const;
export const amenityLabels = {wifi:'Wi-Fi',power:'Power sockets',laptops:'Laptop policy',calls:'Calls and meetings',stepFree:'Step-free access'} as const satisfies Record<typeof amenityKeys[number],string>;
export const modes =['Focus','Casual','Meetings','Together'] as const;
export const categories = ['Café','Co-working','Restaurant','Hotel lounge'] as const;
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
export const placeSchema = z.object({
  id:z.string().min(1), slug:z.string().regex(/^[a-z0-9-]+$/), name:z.string().min(1),
  isSample:z.boolean(), category:z.enum(categories), neighbourhood:z.string(), summary:z.string(),
  image:z.string(), imageAlt:z.string(), imageCredit:z.string(),
  modes:z.array(z.enum(modes)), priceNote:z.string(), hoursNote:z.string(), policyNote:z.string(),
  address:z.string().nullable(), coordinates:z.object({lat:z.number().min(-90).max(90),lng:z.number().min(-180).max(180)}).nullable(),
  amenities:z.object({wifi:evidenceSchema,power:evidenceSchema,laptops:evidenceSchema,calls:evidenceSchema,stepFree:evidenceSchema}),
});
export type Place = z.infer<typeof placeSchema>;
export type Evidence = z.infer<typeof evidenceSchema>;
export type Mode = typeof modes[number];
