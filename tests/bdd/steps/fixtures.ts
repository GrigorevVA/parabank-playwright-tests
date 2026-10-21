import { mergeTests } from '@playwright/test';
import { createBdd, test as bddTest } from 'playwright-bdd';
import { test as baseTest } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import type { NewCustomer } from '@app/api/rest/register';

// unique customer per scenario, shared between steps;
// accounts are filled by Given steps, the first one is the CHECKING account from registration
export const test = mergeTests(bddTest, baseTest).extend<{
  newCustomer: NewCustomer;
  accounts: Account[];
}>({
  newCustomer: async ({}, use) => {
    await use(buildCustomer());
  },
  accounts: async ({}, use) => {
    await use([]);
  },
});

export const { Given, When, Then } = createBdd(test);
