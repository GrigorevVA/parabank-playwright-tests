import { test as base } from '@playwright/test';
import { setPage } from '@core/page-holder';
import { setRequest } from '@core/request-holder';

export const apiTest = base.extend<{ requestHolder: void }>({
  requestHolder: [
    async ({ request }, use) => {
      setRequest(request);
      await use();
    },
    { auto: true },
  ],
});

export const test = apiTest.extend<{ pageHolder: void }>({
  pageHolder: [
    async ({ page }, use) => {
      setPage(page);
      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
