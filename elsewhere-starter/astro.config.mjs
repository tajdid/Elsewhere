import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://elsewhere.work', prefetch: { prefetchAll: true, defaultStrategy: 'hover' }, vite: { plugins: [tailwindcss()] } });
