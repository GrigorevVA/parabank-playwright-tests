import type { Page } from '@playwright/test';

let currentPage: Page | undefined;

export function setPage(page: Page): void {
  currentPage = page;
}

export function getPage(): Page {
  if (!currentPage) {
    throw new Error('Page is not set. Import test from fixtures/base.fixture.ts');
  }
  return currentPage;
}
