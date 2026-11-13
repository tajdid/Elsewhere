// Build-time reader for Phosphor SVGs. Runs only in Astro frontmatter (Node), never in the browser.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'node_modules', '@phosphor-icons', 'core', 'assets');
const cache = new Map<string, string>();

export function readPhosphor(name: string, weight: 'regular' | 'fill' | 'bold' = 'regular'): string {
  const key = `${weight}/${name}`;
  let svg = cache.get(key);
  if (!svg) {
    svg = readFileSync(join(root, weight, `${name}${weight === 'regular' ? '' : `-${weight}`}.svg`), 'utf8').trim();
    cache.set(key, svg);
  }
  return svg;
}

/** A Phosphor icon as a CSS url() for mask-image, so CSS can swap glyphs when JS changes a state. */
export function phosphorMask(name: string, weight: 'regular' | 'fill' | 'bold' = 'bold'): string {
  return `url("data:image/svg+xml,${encodeURIComponent(readPhosphor(name, weight))}")`;
}
