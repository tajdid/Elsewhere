// Presentation-only lookups: which Phosphor icon accompanies each category, work mode and amenity.
// Icons always sit next to their words (or an accessible name); they never carry meaning alone.
import type { Mode } from './schema';

export const categoryIcons: Record<string, string> = {
  'Café': 'coffee', 'Co-working': 'desktop', 'Restaurant': 'fork-knife', 'Bar': 'martini',
};
export const modeIcons: Record<Mode, string> = {
  Focus: 'headphones', Casual: 'coffee', Meetings: 'chats-circle', Together: 'users-three',
};
export const modeLines: Record<Mode, string> = {
  Focus: 'A little space to concentrate.',
  Casual: 'Emails over a coffee.',
  Meetings: 'A setting for a conversation.',
  Together: 'Bring the team along.',
};
export const amenityIcons = {
  wifi: 'wifi-high', power: 'plug', laptops: 'laptop', calls: 'phone-call', stepFree: 'wheelchair',
} as const;

/** Placeholder-aware labels: missing facts read as "not added yet", never as a guess. */
export const typeLabel = (p: { tags: readonly string[] }) => p.tags.length ? p.tags.join(' · ') : 'Type not added';
export const areaLabel = (p: { neighbourhood: string }) => p.neighbourhood || 'Area not added';
export const typeIcon = (p: { category: string | null }) => (p.category && categoryIcons[p.category]) || 'storefront';
export const socketWords: Record<number, string> = { 1: 'A few', 2: 'Some', 3: 'Fair', 4: 'Plenty', 5: 'Lots' };
export const socketChips: Record<number, string> = { 1: 'Few sockets', 2: 'Some sockets', 3: 'Fair sockets', 4: 'Plenty of sockets', 5: 'Lots of sockets' };
export const noiseWords = { quiet: ['Quiet', 'Calls fine'], moderate: ['Moderate', 'Calls okay'], loud: ['Loud', 'Avoid calls'] } as const;
