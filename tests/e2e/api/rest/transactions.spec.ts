import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import type { Transaction } from '@app/api/rest/account-transactions';
import { postBillPay, type Payee } from '@app/api/rest/bill-pay';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { buildPayee } from '@app/api/rest/builders/payee-builder';
import { fetchAccount, fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { fetchAccountTransactions, payBill } from '@app/api/rest/helpers/transaction-helper';
import { getTransaction } from '@app/api/rest/transaction';
import { getTransactionsByAmount } from '@app/api/rest/transactions-by-amount';
import { UNKNOWN_TRANSACTION_ID } from '@app/data/negative-data';

const BILL_AMOUNT = 12.5;

// CRUD: transactions are created by payments and can only be read,
// ParaBank has no update or delete for them
test.describe('ParaBank REST: transactions', () => {
  let checking: Account;
  let payee: Payee;

  test.beforeEach(async () => {
    const customer = await registerCustomer(buildCustomer());
    [checking] = await fetchCustomerAccounts(customer.id);
    payee = buildPayee();
  });

  test('Bill payment creates a debit transaction', async () => {
    const response = await postBillPay(checking.id, BILL_AMOUNT, payee);

    expect(response.status(), 'Bill pay should return 200').toBe(200);
    expect(await response.json(), 'Bill pay should confirm payee and amount').toEqual({
      payeeName: payee.name,
      amount: BILL_AMOUNT,
      accountId: checking.id,
    });
    expect(
      await fetchAccountTransactions(checking.id),
      'Payment should appear in account transactions',
    ).toContainEqual(
      expect.objectContaining({
        type: 'Debit',
        amount: BILL_AMOUNT,
        description: `Bill Payment to ${payee.name}`,
      }),
    );
    expect((await fetchAccount(checking.id)).balance, 'Balance should decrease by the amount').toBe(
      checking.balance - BILL_AMOUNT,
    );
  });

  test('Transaction can be read by id', async () => {
    await payBill(checking.id, BILL_AMOUNT, payee);
    const payment = (await fetchAccountTransactions(checking.id)).find(
      (transaction) => transaction.description === `Bill Payment to ${payee.name}`,
    );
    expect(payment, 'Payment should be in account transactions').toBeDefined();

    const response = await getTransaction(payment!.id);

    expect(response.status(), 'Get transaction should return 200').toBe(200);
    expect(await response.json(), 'Transaction should match the account transaction').toEqual(payment);
  });

  test('Transactions can be found by amount', async () => {
    await payBill(checking.id, BILL_AMOUNT, payee);

    const response = await getTransactionsByAmount(checking.id, BILL_AMOUNT);

    expect(response.status(), 'Find by amount should return 200').toBe(200);
    const found: Transaction[] = await response.json();
    expect(
      found.map((transaction) => transaction.description),
      'Only the payment of this amount should be found',
    ).toEqual([`Bill Payment to ${payee.name}`]);
  });

  test('Unknown transaction is not found', async () => {
    const response = await getTransaction(UNKNOWN_TRANSACTION_ID);

    expect(response.status(), 'Unknown transaction should return 400').toBe(400);
    expect(await response.text(), 'Error should name the transaction').toBe(
      `Could not find transaction #${UNKNOWN_TRANSACTION_ID}`,
    );
  });
});
