import type { TestDetails } from '@playwright/test';

export type Severity = 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial';

// allure-playwright turns "allure.label.<name>" annotations into report labels;
// passed to test.describe, they apply to every test inside
export function allureLabels(epic: string, feature: string, severity: Severity): TestDetails {
  return {
    annotation: [
      { type: 'allure.label.epic', description: epic },
      { type: 'allure.label.feature', description: feature },
      { type: 'allure.label.severity', description: severity },
    ],
  };
}
