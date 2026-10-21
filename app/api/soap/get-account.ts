import type { APIResponse } from '@playwright/test';
import { postSoap } from './parabank-soap';

export type SoapAccount = {
  id: string;
  customerId: string;
  type: string;
  balance: string;
};

export type GetAccountResponse = {
  getAccountResponse: { account: SoapAccount };
};

export function soapGetAccount(accountId: number): Promise<APIResponse> {
  return postSoap('getAccount', { accountId });
}
