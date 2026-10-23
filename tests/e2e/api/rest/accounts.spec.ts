import { apiTest as test, expect } from '@fixtures/base.fixture';
import { getAccount } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { fetchCustomerAccounts, openAccount } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import type { Customer } from '@app/api/rest/login';
import { ACCOUNT_TYPES } from '@app/data/account-types';
import { UNKNOWN_ACCOUNT_ID } from '@app/data/negative-data';
import { allureLabels } from '@core/utils/allure-labels';
import { EPIC } from '@app/data/report-labels';

test.describe('ParaBank REST: accounts', allureLabels(EPIC.REST, 'Accounts', 'normal'), () => {
  let customer: Customer;

  test.beforeEach(async () => {
    customer = await registerCustomer(buildCustomer());
  });

  test('New customer has one checking account', async () => {
    const accounts = await fetchCustomerAccounts(customer.id);

    expect(accounts, 'New customer should have exactly one account').toHaveLength(1);
    expect(accounts[0].type, 'First account should be CHECKING').toBe('CHECKING');
  });

  for (const type of ACCOUNT_TYPES) {
    test(`Customer opens ${type} account`, async () => {
      const [firstAccount] = await fetchCustomerAccounts(customer.id);

      const newAccount = await openAccount(customer.id, type, firstAccount.id);

      expect(newAccount.type, `New account should be ${type}`).toBe(type);
      const accounts = await fetchCustomerAccounts(customer.id);
      expect(
        accounts.map((account) => account.id),
        'New account should appear in customer accounts',
      ).toContain(newAccount.id);
    });
  }

  test('Unknown account is not found', async () => {
    const response = await getAccount(UNKNOWN_ACCOUNT_ID);

    expect(response.status(), 'Unknown account should return 400').toBe(400);
    expect(await response.text(), 'Error should name the account').toBe(
      `Could not find account #${UNKNOWN_ACCOUNT_ID}`,
    );
  });
});
