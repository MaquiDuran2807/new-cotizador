import { defineConfig, devices } from '@playwright/experimental-ct-react'

export default defineConfig({
  testDir: './tests/responsive',
  snapshotDir: './tests/responsive/__snapshots__',
  timeout: 30000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    ctPort: 3101,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ctTemplateDir: './playwright',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
