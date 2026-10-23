import type { APIResponse } from '@playwright/test';
import { postSoap } from './parabank-soap';

export type WithdrawResponse = {
  withdrawResponse: { withdrawReturn: string };
};

export function soapWithdraw(accountId: number, amount: number): Promise<APIResponse> {
  return postSoap('withdraw', { accountId, amount });
}
