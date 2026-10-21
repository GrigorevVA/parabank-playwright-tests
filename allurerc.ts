import type { AllureConfig } from 'allure';
import { ALLURE_RESULTS_DIR } from './fixtures/global-setup';

export default {
  name: 'ParaBank autotests',
  resultsDir: ALLURE_RESULTS_DIR,
  output: './allure-report',
  plugins: {
    awesome: {
      options: {
        // api / bdd first (Playwright projects), then describe blocks and features
        groupBy: ['parentSuite', 'subSuite'],
        reportLanguage: 'en',
      },
    },
  },
} satisfies AllureConfig;
