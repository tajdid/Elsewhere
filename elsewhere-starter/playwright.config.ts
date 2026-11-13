import {defineConfig} from '@playwright/test';
// Set E2E_BASE_URL to test an already-running server (for example `astro preview --port 4330`); otherwise a dev server is started.
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:4321';
export default defineConfig({testDir:'./tests',testMatch:'**/*.spec.ts',use:{baseURL,browserName:'chromium'},webServer:process.env.E2E_BASE_URL?undefined:{command:'npm run dev -- --host 127.0.0.1',url:baseURL,reuseExistingServer:!process.env.CI},reporter:'list'});
