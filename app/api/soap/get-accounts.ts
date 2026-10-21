import type { APIResponse } from '@playwright/test';
import type { SoapAccount } from './get-account';
import { postSoap } from './parabank-soap';

// pass to parseSoapBody so a single account is still an array
export const ACCOUNT_LIST_TAGS = ['account'];

export type GetAccountsResponse = {
  getAccountsResponse: { account: SoapAccount[] };
};

export function soapGetAccounts(customerId: number): Promise<APIResponse> {
  return postSoap('getAccounts', { customerId });
}
