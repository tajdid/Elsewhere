// Match the neighbourhood Google gives for an address to the names already used on the list,
// so a submission says "JLT" rather than "Jumeirah Lake Towers". Unknown areas pass through as Google wrote them.
const aliases: Record<string, string> = {
  'jumeirah lake towers': 'JLT', 'jumeirah lakes towers': 'JLT',
  'jumeirah village circle': 'JVC', 'jumeirah village': 'JVC',
  'jumeirah beach residence': 'JBR',
  'dubai international financial centre': 'DIFC', 'dubai international financial center': 'DIFC',
  'marsa dubai': 'Dubai Marina',
};
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export function matchArea(google: string | null | undefined, known: string[]): string | null {
  if (!google?.trim()) return null;
  const g = norm(google);
  const alias = aliases[g];
  const direct = known.find(k => norm(k) === g);
  if (direct) return direct;
  if (alias) return known.find(k => k === alias) ?? alias;
  return google.trim();
}
