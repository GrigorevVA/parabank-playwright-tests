import type { AllureConfig } from 'allure';
import { ALLURE_RESULTS_DIR } from './fixtures/global-setup';

export default {
  name: 'ParaBank autotests',
  resultsDir: ALLURE_RESULTS_DIR,
  output: './allure-report',
  // kept inside the report, so the published report carries its own history;
  // CI restores it from GitHub Pages before generating a new report
  historyPath: './allure-report/history.jsonl',
  historyLimit: 20,
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
