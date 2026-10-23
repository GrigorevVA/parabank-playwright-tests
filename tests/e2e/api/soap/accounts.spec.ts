import { parseSoapBody, type SoapFault } from '@core/api/soap';
import { apiTest as test, expect } from '@fixtures/base.fixture';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import type { Customer } from '@app/api/rest/login';
import { fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { soapCreateAccount, type CreateAccountResponse } from '@app/api/soap/create-account';
import { soapGetAccount } from '@app/api/soap/get-account';
import { fetchSoapAccount } from '@app/api/soap/helpers/account-helper';
import {
  ACCOUNT_LIST_TAGS,
  soapGetAccounts,
  type GetAccountsResponse,
} from '@app/api/soap/get-accounts';
import { UNKNOWN_ACCOUNT_ID } from '@app/data/negative-data';

test.describe('ParaBank SOAP: accounts', () => {
  let customer: Customer;

  test.beforeEach(async () => {
    customer = await registerCustomer(buildCustomer());
  });

  test('New customer has one checking account', async () => {
    const response = await soapGetAccounts(customer.id);

    expect(response.status(), 'SOAP getAccounts should return 200').toBe(200);
    const { getAccountsResponse } = parseSoapBody<GetAccountsResponse>(
      await response.text(),
      ACCOUNT_LIST_TAGS,
    );
    expect(
      getAccountsResponse.account,
      'New customer should have exactly one account',
    ).toHaveLength(1);
    expect(
      getAccountsResponse.account[0],
      'First account should be CHECKING of this customer',
    ).toMatchObject({
      customerId: String(customer.id),
      type: 'CHECKING',
    });
  });

  test('Customer opens SAVINGS account', async () => {
    const [checking] = await fetchCustomerAccounts(customer.id);

    const response = await soapCreateAccount(customer.id, 'SAVINGS', checking.id);

    expect(response.status(), 'SOAP createAccount should return 200').toBe(200);
    const { account } = parseSoapBody<CreateAccountResponse>(
      await response.text(),
    ).createAccountResponse;
    expect(account.type, 'New account should be SAVINGS').toBe('SAVINGS');
    expect(
      await fetchSoapAccount(Number(account.id)),
      'New account should be readable by id',
    ).toMatchObject({ id: account.id, customerId: String(customer.id), type: 'SAVINGS' });
  });

  test('Unknown account returns fault', async () => {
    const response = await soapGetAccount(UNKNOWN_ACCOUNT_ID);

    expect(response.status(), 'SOAP fault should return 500').toBe(500);
    const { Fault } = parseSoapBody<SoapFault>(await response.text());
    expect(Fault.faultstring, 'Fault should name the account').toBe(
      `Could not find account #${UNKNOWN_ACCOUNT_ID}`,
    );
  });
});
