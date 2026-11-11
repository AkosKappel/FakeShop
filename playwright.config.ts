import { defineConfig, devices } from '@playwright/test';

// End-to-end tests run against the production build (`pnpm build` first),
// with the DummyJSON API served from test/e2e/fixtures.
export default defineConfig({
  testDir: 'test/e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4174/',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm exec vite preview --port 4174 --strictPort',
    url: 'http://localhost:4174/',
    reuseExistingServer: !process.env.CI,
  },
});
