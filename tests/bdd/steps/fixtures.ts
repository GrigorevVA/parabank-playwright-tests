import { mergeTests } from '@playwright/test';
import { createBdd, test as bddTest } from 'playwright-bdd';
import { test as baseTest } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import type { Payee } from '@app/api/rest/bill-pay';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { buildPayee } from '@app/api/rest/builders/payee-builder';
import type { NewCustomer } from '@app/api/rest/register';

// unique customer per scenario, shared between steps;
// accounts are filled by Given steps, the first one is the CHECKING account from registration
export const test = mergeTests(bddTest, baseTest).extend<{
  newCustomer: NewCustomer;
  accounts: Account[];
  contactUpdate: NewCustomer;
  payee: Payee;
}>({
  newCustomer: async ({}, use) => {
    await use(buildCustomer());
  },
  accounts: async ({}, use) => {
    await use([]);
  },
  // new contact data for the Update Profile form
  contactUpdate: async ({}, use) => {
    await use(buildCustomer());
  },
  payee: async ({}, use) => {
    await use(buildPayee());
  },
});

export const { Given, When, Then, Before } = createBdd(test);
