import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { postBuyPosition } from '@app/api/rest/buy-position';
import { postDeposit } from '@app/api/rest/deposit';
import { fetchAccount, fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { buyPosition } from '@app/api/rest/helpers/position-helper';
import { postSellPosition } from '@app/api/rest/sell-position';
import { postWithdraw } from '@app/api/rest/withdraw';
import { ACME_ORDER, SALE_PRICE } from '@app/data/position-orders';

const AMOUNT = 50;

// Tests describe the correct behaviour; ParaBank does not implement it yet, so they are expected to fail.
// When a defect is fixed, Playwright reports "expected to fail, but passed" and the test.fail mark must go.
test.describe('ParaBank REST: known defects', () => {
  let checking: Account;

  test.beforeEach(async () => {
    const customer = await registerCustomer(buildCustomer());
    [checking] = await fetchCustomerAccounts(customer.id);
  });

  test(
    'Withdrawal above the balance is rejected',
    { annotation: { type: 'defect', description: 'ParaBank withdraws without a balance check' } },
    async () => {
      test.fail();

      const response = await postWithdraw(checking.id, checking.balance + AMOUNT);

      expect(response.status(), 'Overdraft should return 400').toBe(400);
      expect((await fetchAccount(checking.id)).balance, 'Balance should not change').toBe(checking.balance);
    },
  );

  test(
    'Deposit of a negative amount is rejected',
    { annotation: { type: 'defect', description: 'ParaBank accepts negative deposits' } },
    async () => {
      test.fail();

      const response = await postDeposit(checking.id, -AMOUNT);

      expect(response.status(), 'Negative deposit should return 400').toBe(400);
      expect((await fetchAccount(checking.id)).balance, 'Balance should not change').toBe(checking.balance);
    },
  );

  test(
    'Buying shares above the balance is rejected',
    { annotation: { type: 'defect', description: 'ParaBank buys positions without a balance check' } },
    async () => {
      test.fail();
      const order = { ...ACME_ORDER, pricePerShare: checking.balance };

      const response = await postBuyPosition(checking.customerId, checking.id, order);

      expect(response.status(), 'Buying above the balance should return 400').toBe(400);
      expect((await fetchAccount(checking.id)).balance, 'Balance should not change').toBe(checking.balance);
    },
  );

  test(
    'Selling more shares than owned is rejected',
    { annotation: { type: 'defect', description: 'ParaBank sells more shares than the position has' } },
    async () => {
      const [position] = await buyPosition(checking.customerId, checking.id, ACME_ORDER);
      // marked after the setup, so a failed purchase is a real failure
      test.fail();

      const response = await postSellPosition(checking.customerId, checking.id, {
        positionId: position.positionId,
        shares: ACME_ORDER.shares + 1,
        pricePerShare: SALE_PRICE,
      });

      expect(response.status(), 'Overselling should return 400').toBe(400);
    },
  );
});
