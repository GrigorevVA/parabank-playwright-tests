import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import {
  fetchAccount,
  fetchCustomerAccounts,
  openAccount,
} from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { fetchSoapAccount } from '@app/api/soap/helpers/account-helper';
import { soapTransfer, type TransferResponse } from '@app/api/soap/transfer';
import { parseSoapBody } from '@core/api/soap';

const TRANSFER_AMOUNT = 10;

test.describe('ParaBank SOAP: transfer', () => {
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
    const response = await soapTransfer(checking.id, savings.id, TRANSFER_AMOUNT);

    expect(response.status(), 'SOAP transfer should return 200').toBe(200);
    const { transferResponse } = parseSoapBody<TransferResponse>(await response.text());
    expect(transferResponse.transferReturn, 'Transfer should confirm the operation').toBe(
      `Successfully transferred $${TRANSFER_AMOUNT} from account #${checking.id} to account #${savings.id}`,
    );
    expect(Number((await fetchSoapAccount(checking.id)).balance), 'Source balance should decrease').toBe(
      checking.balance - TRANSFER_AMOUNT,
    );
    expect(Number((await fetchSoapAccount(savings.id)).balance), 'Target balance should increase').toBe(
      savings.balance + TRANSFER_AMOUNT,
    );
  });
});
