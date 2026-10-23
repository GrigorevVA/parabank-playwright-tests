import { parseSoapBody, type SoapFault } from '@core/api/soap';
import { apiTest as test, expect } from '@fixtures/base.fixture';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import type { Customer } from '@app/api/rest/login';
import { soapGetAccount } from '@app/api/soap/get-account';
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

  test('Unknown account returns fault', async () => {
    const response = await soapGetAccount(UNKNOWN_ACCOUNT_ID);

    expect(response.status(), 'SOAP fault should return 500').toBe(500);
    const { Fault } = parseSoapBody<SoapFault>(await response.text());
    expect(Fault.faultstring, 'Fault should name the account').toBe(
      `Could not find account #${UNKNOWN_ACCOUNT_ID}`,
    );
  });
});
