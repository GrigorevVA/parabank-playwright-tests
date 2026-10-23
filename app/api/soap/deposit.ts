import type { APIResponse } from '@playwright/test';
import { postSoap } from './parabank-soap';

export type DepositResponse = {
  depositResponse: { depositReturn: string };
};

export function soapDeposit(accountId: number, amount: number): Promise<APIResponse> {
  return postSoap('deposit', { accountId, amount });
}
