// Plain-language Wi-Fi and hours details. Pure functions, unit-tested; nothing here claims a place is open now.
import { STALE_DAYS } from './discovery';
import { dayKeys, type DayKey, type Hours, type WifiAccess, type WifiSpeed } from './schema';

const DAY = 86400000;

/** What a measured download speed is good for. A speed test is a snapshot, not a promise. */
export function speedTier(mbps: number): string {
  if (mbps >= 50) return 'Plenty for video calls';
  if (mbps >= 20) return 'Good for video calls';
  if (mbps >= 5) return 'Fine for email and browsing';
  return 'Slow for most work';
}

export const formatMbps = (n: number) => `${n >= 10 ? Math.round(n) : Math.round(n * 10) / 10} Mbps`;

/** A test older than the evidence window, or dated in the future, no longer describes the network. */
export const speedIsStale = (s: WifiSpeed, now = Date.now()) => {
  const t = Date.parse(s.measuredAt);
  return now - t > STALE_DAYS * DAY || t > now;
};

export const accessLabels: Record<WifiAccess['value'], string> = {
  open: 'No password', password: 'Password from staff', signup: 'Sign-up page', unknown: 'Access not checked',
};

/** Weekday in Dubai, whatever the visitor's own time zone. */
export function dubaiDay(now = Date.now()): DayKey {
  const short = new Date(now).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Dubai' }).toLowerCase().slice(0, 3);
  return (dayKeys as readonly string[]).includes(short) ? short as DayKey : 'mon';
}

/** "08:00" → "8 am", "13:30" → "1:30 pm", "00:00" → "midnight", "12:00" → "noon". */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  if (h === 0 && m === 0) return 'midnight';
  if (h === 12 && m === 0) return 'noon';
  const hour = h % 12 || 12;
  return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'am' : 'pm'}`;
}

export function formatRange(range: [string, string] | null): string {
  if (!range) return 'Closed';
  if (range[0] === range[1]) return 'Open 24 hours';
  return `${formatTime(range[0])} – ${formatTime(range[1])}`;
}

/** Usual hours for a given day, e.g. "8 am – 5 pm" or "Closed". */
export const usualHours = (h: Hours, day: DayKey) => formatRange(h.week[day]);

export const dayNames: Record<DayKey, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };

/** The card and visit-panel line: always "usually", never "open now". */
export function usualTodayText(week: Hours['week'], day: DayKey): string {
  const range = week[day];
  if (!range) return 'Usually closed today';
  if (range[0] === range[1]) return 'Usually open 24 hours today';
  return `Usually ${formatRange(range)} today`;
}
