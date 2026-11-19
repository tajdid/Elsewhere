// robots.txt: crawling is always allowed, so crawlers can read each page's robots meta tag.
// The sitemap is only advertised once indexing is switched on (PUBLIC_ALLOW_INDEXING=true).
import type { APIRoute } from 'astro';
import { indexingAllowed } from '../lib/seo';
export const GET: APIRoute = ({ site }) => {
  const lines = ['User-agent: *', 'Allow: /'];
  if (indexingAllowed && site) lines.push('', `Sitemap: ${new URL('/sitemap.xml', site).href}`);
  else lines.unshift('# Pre-launch: every page carries noindex until PUBLIC_ALLOW_INDEXING=true is set for the production build.');
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
