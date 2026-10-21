import { expectStatus, type StatusCheckOptions } from '@core/api/expect-status';
import { step } from '@core/utils/step';
import { getAccount, type Account, type AccountType } from '../account';
import { postCreateAccount } from '../create-account';
import { getCustomerAccounts } from '../customer-accounts';

export function fetchAccount(accountId: number, options?: StatusCheckOptions): Promise<Account> {
  return step(`Fetch account ${accountId}`, async () => {
    const response = await getAccount(accountId);
    expectStatus(response, 200, 'Get account', options);
    return response.json();
  });
}

export function fetchCustomerAccounts(
  customerId: number,
  options?: StatusCheckOptions,
): Promise<Account[]> {
  return step(`Fetch accounts of customer ${customerId}`, async () => {
    const response = await getCustomerAccounts(customerId);
    expectStatus(response, 200, 'Get customer accounts', options);
    return response.json();
  });
}

export function openAccount(
  customerId: number,
  type: AccountType,
  fromAccountId: number,
  options?: StatusCheckOptions,
): Promise<Account> {
  return step(`Open ${type} account`, async () => {
    const response = await postCreateAccount(customerId, type, fromAccountId);
    expectStatus(response, 200, 'Create account', options);
    return response.json();
  });
}
