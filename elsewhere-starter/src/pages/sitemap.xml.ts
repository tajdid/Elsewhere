// XML sitemap of the pages meant for search: home, Explore, About, neighbourhood and collection pages, and place pages
// with enough detail to stand alone. Filtered Explore URLs, Saved, Submit and thin place pages are left out.
// No <lastmod>: the list's "added" dates describe the venue facts, not when these pages last changed.
import type { APIRoute } from 'astro';
import { places } from '../lib/places';
import { areaPages, collectionPages, placeIsIndexable } from '../lib/seo';
const sitemapPaths = () => ['/', '/explore/', '/about/',
  ...areaPages(places).map(a => a.path), ...collectionPages(places).map(c => c.path),
  ...places.filter(placeIsIndexable).map(p => `/places/${p.slug}/`)];
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
export const GET: APIRoute = ({ site }) => {
  const urls = sitemapPaths().map(p => `  <url><loc>${esc(new URL(p, site).href)}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
