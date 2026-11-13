// Presentation-only lookups: which Phosphor icon accompanies each category, work mode and amenity.
// Icons always sit next to their words (or an accessible name); they never carry meaning alone.
import type { Mode } from './schema';

export const categoryIcons: Record<string, string> = {
  'Café': 'coffee', 'Co-working': 'desktop', 'Restaurant': 'fork-knife', 'Hotel lounge': 'armchair',
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
