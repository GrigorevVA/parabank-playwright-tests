import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { ENV } from '../core/utils/env';

export const ALLURE_RESULTS_DIR = 'allure-results';

// the Allure reporter appends results, so stale runs are removed before a new one;
// only the content is removed: in Docker the folder itself is a mounted volume
function cleanAllureResults(): void {
  mkdirSync(ALLURE_RESULTS_DIR, { recursive: true });
  for (const entry of readdirSync(ALLURE_RESULTS_DIR)) {
    rmSync(join(ALLURE_RESULTS_DIR, entry), { recursive: true, force: true });
  }
}

// a fresh ParaBank has no tables: the first visit of index.htm redirects
// to initializeDB.htm, which creates them; an initialized stand just answers 200
async function initializeDatabase(): Promise<void> {
  await fetch(`${ENV.PARABANK_URL}/index.htm`);
}

export default async function globalSetup(): Promise<void> {
  cleanAllureResults();
  await initializeDatabase();
}
