import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
// Canonical base URL. Set PUBLIC_SITE_URL once a custom domain is live; on Vercel the project's production domain is used,
// otherwise the current deployment. elsewhere.work is not assumed until it is configured.
const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.PUBLIC_SITE_URL || (vercelProd ? `https://${vercelProd}` : 'https://elsewhere-silk.vercel.app');
export default defineConfig({ site, prefetch: { prefetchAll: true, defaultStrategy: 'hover' }, vite: { plugins: [tailwindcss()] } });
