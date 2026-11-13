// Dates shown in Dubai time, so a build or a visitor elsewhere never shifts the day.
const opts = { timeZone: 'Asia/Dubai' } as const;
/** "20 Oct", or "1 May 2026" when the year isn't the current one. */
export function shortDate(iso: string, now = Date.now()): string {
  const d = new Date(iso);
  const sameYear = d.toLocaleDateString('en-GB', { ...opts, year: 'numeric' }) === new Date(now).toLocaleDateString('en-GB', { ...opts, year: 'numeric' });
  return d.toLocaleDateString('en-GB', { ...opts, day: 'numeric', month: 'short', ...(sameYear ? {} : { year: 'numeric' }) });
}
/** "20 Oct 2026". */
export const longDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { ...opts, day: 'numeric', month: 'short', year: 'numeric' });
/** "Aug 2020". */
export const monthYear = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { ...opts, month: 'short', year: 'numeric' });
