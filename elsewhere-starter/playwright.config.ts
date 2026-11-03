import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'**/*.spec.ts',use:{baseURL:'http://localhost:4321',browserName:'chromium'},webServer:{command:'npm run dev -- --host 127.0.0.1',url:'http://localhost:4321',reuseExistingServer:!process.env.CI},reporter:'list'});
