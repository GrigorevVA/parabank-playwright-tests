import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import { ENV } from './core/utils/env';
import { TIMEOUT } from './core/utils/timeout';
import { ALLURE_RESULTS_DIR } from './fixtures/global-setup';

const isCI = !!process.env.CI;

// trailing slash keeps the /parabank segment for relative paths
const BASE_URL = `${ENV.PARABANK_URL}/`;

const bddDir = defineBddConfig({
  features: 'tests/bdd/features/*.feature',
  steps: 'tests/bdd/steps/*.ts',
  outputDir: '.features-gen',
});

export default defineConfig({
  globalSetup: './fixtures/global-setup.ts',
  timeout: TIMEOUT.LONG,
  expect: { timeout: TIMEOUT.SHORT },
  // ParaBank registration has a server-side race: parallel sign-ups fail
  // with "This username already exists." even for unique usernames
  fullyParallel: false,
  workers: 1,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    // project names (api, bdd) become parent suites in the Allure tree
    [
      'allure-playwright',
      {
        resultsDir: ALLURE_RESULTS_DIR,
        // only our step() titles, without Playwright fixtures and raw API calls
        detail: false,
        environmentInfo: { PARABANK_URL: ENV.PARABANK_URL, NODE_VERSION: process.version },
      },
    ],
  ],
  use: {
    baseURL: BASE_URL,
    actionTimeout: TIMEOUT.MEDIUM,
    navigationTimeout: TIMEOUT.LONG,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testDir: './tests/e2e/api',
    },
    {
      name: 'bdd',
      testDir: bddDir,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
