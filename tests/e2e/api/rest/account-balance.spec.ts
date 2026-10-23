import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { postDeposit } from '@app/api/rest/deposit';
import { fetchAccount, fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { fetchAccountTransactions } from '@app/api/rest/helpers/transaction-helper';
import { postWithdraw } from '@app/api/rest/withdraw';
import { UNKNOWN_ACCOUNT_ID } from '@app/data/negative-data';
import { allureLabels } from '@core/utils/allure-labels';
import { EPIC } from '@app/data/report-labels';

const AMOUNT = 50;

// CRUD: update of the account balance, every change is confirmed by reading the account
test.describe(
  'ParaBank REST: account balance',
  allureLabels(EPIC.REST, 'Account balance', 'critical'),
  () => {
    let checking: Account;

    test.beforeEach(async () => {
      const customer = await registerCustomer(buildCustomer());
      [checking] = await fetchCustomerAccounts(customer.id);
    });

    test('Deposit increases the balance', async () => {
      const response = await postDeposit(checking.id, AMOUNT);

      expect(response.status(), 'Deposit should return 200').toBe(200);
      expect(await response.text(), 'Deposit should confirm the operation').toBe(
        `Successfully deposited $${AMOUNT} to account #${checking.id}`,
      );
      expect(
        (await fetchAccount(checking.id)).balance,
        'Balance should increase by the amount',
      ).toBe(checking.balance + AMOUNT);
      expect(
        await fetchAccountTransactions(checking.id),
        'Deposit should appear as a credit',
      ).toContainEqual(
        expect.objectContaining({
          type: 'Credit',
          amount: AMOUNT,
          description: 'Deposit via Web Service',
        }),
      );
    });

    test('Withdrawal decreases the balance', async () => {
      const response = await postWithdraw(checking.id, AMOUNT);

      expect(response.status(), 'Withdrawal should return 200').toBe(200);
      expect(await response.text(), 'Withdrawal should confirm the operation').toBe(
        `Successfully withdrew $${AMOUNT} from account #${checking.id}`,
      );
      expect(
        (await fetchAccount(checking.id)).balance,
        'Balance should decrease by the amount',
      ).toBe(checking.balance - AMOUNT);
      expect(
        await fetchAccountTransactions(checking.id),
        'Withdrawal should appear as a debit',
      ).toContainEqual(
        expect.objectContaining({
          type: 'Debit',
          amount: AMOUNT,
          description: 'Withdraw via Web Service',
        }),
      );
    });

    test('Deposit to an unknown account is rejected', async () => {
      const response = await postDeposit(UNKNOWN_ACCOUNT_ID, AMOUNT);

      expect(response.status(), 'Deposit to unknown account should return 400').toBe(400);
      expect(await response.text(), 'Error should name the account').toBe(
        `Could not find account number ${UNKNOWN_ACCOUNT_ID}`,
      );
    });
  },
);
