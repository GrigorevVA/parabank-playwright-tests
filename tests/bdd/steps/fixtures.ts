import { mergeTests } from '@playwright/test';
import { createBdd, test as bddTest } from 'playwright-bdd';
import { test as baseTest } from '@fixtures/base.fixture';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import type { NewCustomer } from '@app/api/rest/register';

// unique customer per scenario, shared between steps
export const test = mergeTests(bddTest, baseTest).extend<{ newCustomer: NewCustomer }>({
  newCustomer: async ({}, use) => {
    await use(buildCustomer());
  },
});

export const { Given, When, Then } = createBdd(test);
