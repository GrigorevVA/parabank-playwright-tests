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
  // tests marked with test.fail() for ParaBank defects (tag @known-defect)
  categories: [{ name: 'Known ParaBank defects', matchers: { labels: { tag: 'known-defect' } } }],
  plugins: {
    awesome: {
      options: {
        // epic (REST API / SOAP API / UI) first, then the feature (entity or Gherkin feature)
        groupBy: ['epic', 'feature'],
        reportLanguage: 'en',
      },
    },
  },
} satisfies AllureConfig;
