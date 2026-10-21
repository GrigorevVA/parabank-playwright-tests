import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import {
  fetchAccount,
  fetchCustomerAccounts,
  openAccount,
} from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { postTransfer } from '@app/api/rest/transfer';

const TRANSFER_AMOUNT = 10;

test.describe('ParaBank REST: transfer', () => {
  let checking: Account;
  let savings: Account;

  test.beforeEach(async () => {
    const customer = await registerCustomer(buildCustomer());
    const [firstAccount] = await fetchCustomerAccounts(customer.id);
    const newAccount = await openAccount(customer.id, 'SAVINGS', firstAccount.id);
    checking = await fetchAccount(firstAccount.id);
    savings = await fetchAccount(newAccount.id);
  });

  test('Transfer moves money between own accounts', async () => {
    const response = await postTransfer(checking.id, savings.id, TRANSFER_AMOUNT);

    expect(response.status(), 'Transfer should return 200').toBe(200);
    expect(await response.text(), 'Transfer should confirm the operation').toBe(
      `Successfully transferred $${TRANSFER_AMOUNT} from account #${checking.id} to account #${savings.id}`,
    );
    expect((await fetchAccount(checking.id)).balance, 'Source balance should decrease').toBe(
      checking.balance - TRANSFER_AMOUNT,
    );
    expect((await fetchAccount(savings.id)).balance, 'Target balance should increase').toBe(
      savings.balance + TRANSFER_AMOUNT,
    );
  });
});
