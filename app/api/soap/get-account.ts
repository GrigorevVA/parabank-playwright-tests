import type { APIResponse } from '@playwright/test';
import { postSoap } from './parabank-soap';

export interface SoapAccount {
  id: string;
  customerId: string;
  type: string;
  balance: string;
}

export interface GetAccountResponse {
  getAccountResponse: { account: SoapAccount };
}

export function soapGetAccount(accountId: number): Promise<APIResponse> {
  return postSoap('getAccount', { accountId });
}
