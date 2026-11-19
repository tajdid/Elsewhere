// Small CSV helpers for the place-matching review file (opens in Google Sheets, Numbers or Excel).
const cell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
export const toCsv = (rows: string[][]) => rows.map(r => r.map(cell).join(',')).join('\n') + '\n';

export function parseCsv(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = []; let cur = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') quoted = false;
      else cur += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); cur = ''; if (row.some(x => x !== '')) rows.push(row); row = [];
    } else cur += c;
  }
  if (cur || row.length) { row.push(cur); if (row.some(x => x !== '')) rows.push(row); }
  return rows;
}

/** How alike two place names are, 0–1, from shared words (ignoring case, punctuation and "Dubai"). */
export function similarity(a: string, b: string): number {
  const words = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(w => w && w !== 'dubai'));
  const A = words(a), B = words(b);
  if (!A.size || !B.size) return 0;
  const shared = [...A].filter(w => B.has(w)).length;
  return (2 * shared) / (A.size + B.size);
}
