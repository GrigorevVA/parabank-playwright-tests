import { parseSoapBody, type SoapFault } from '@core/api/soap';
import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { soapDeposit, type DepositResponse } from '@app/api/soap/deposit';
import { fetchSoapAccount, fetchSoapTransactions } from '@app/api/soap/helpers/account-helper';
import { soapWithdraw, type WithdrawResponse } from '@app/api/soap/withdraw';
import { UNKNOWN_ACCOUNT_ID } from '@app/data/negative-data';

const AMOUNT = 50;

// CRUD: update of the account balance, every change is confirmed by reading the account
test.describe('ParaBank SOAP: account balance', () => {
  let checking: Account;

  test.beforeEach(async () => {
    const customer = await registerCustomer(buildCustomer());
    [checking] = await fetchCustomerAccounts(customer.id);
  });

  test('Deposit increases the balance', async () => {
    const response = await soapDeposit(checking.id, AMOUNT);

    expect(response.status(), 'SOAP deposit should return 200').toBe(200);
    const { depositResponse } = parseSoapBody<DepositResponse>(await response.text());
    expect(depositResponse.depositReturn, 'Deposit should be confirmed').toBe(
      `Successfully deposited $${AMOUNT} to account #${checking.id}`,
    );
    expect(
      Number((await fetchSoapAccount(checking.id)).balance),
      'Balance should increase by the amount',
    ).toBe(checking.balance + AMOUNT);
    expect(
      await fetchSoapTransactions(checking.id),
      'Deposit should appear as a credit',
    ).toContainEqual(
      expect.objectContaining({ type: 'Credit', description: 'Deposit via Web Service' }),
    );
  });

  test('Withdrawal decreases the balance', async () => {
    const response = await soapWithdraw(checking.id, AMOUNT);

    expect(response.status(), 'SOAP withdraw should return 200').toBe(200);
    const { withdrawResponse } = parseSoapBody<WithdrawResponse>(await response.text());
    expect(withdrawResponse.withdrawReturn, 'Withdrawal should be confirmed').toBe(
      `Successfully withdrew $${AMOUNT} from account #${checking.id}`,
    );
    expect(
      Number((await fetchSoapAccount(checking.id)).balance),
      'Balance should decrease by the amount',
    ).toBe(checking.balance - AMOUNT);
    expect(
      await fetchSoapTransactions(checking.id),
      'Withdrawal should appear as a debit',
    ).toContainEqual(
      expect.objectContaining({ type: 'Debit', description: 'Withdraw via Web Service' }),
    );
  });

  test('Deposit to an unknown account returns fault', async () => {
    const response = await soapDeposit(UNKNOWN_ACCOUNT_ID, AMOUNT);

    expect(response.status(), 'SOAP fault should return 500').toBe(500);
    const { Fault } = parseSoapBody<SoapFault>(await response.text());
    expect(Fault.faultstring, 'Fault should name the account').toBe(
      `Could not find account number ${UNKNOWN_ACCOUNT_ID}`,
    );
  });
});
