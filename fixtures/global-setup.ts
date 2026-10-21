import { rmSync } from 'node:fs';

export const ALLURE_RESULTS_DIR = 'allure-results';

// the Allure reporter appends results, so stale runs are removed before a new one
export default function globalSetup(): void {
  rmSync(ALLURE_RESULTS_DIR, { recursive: true, force: true });
}
