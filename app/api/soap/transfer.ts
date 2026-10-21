import type { APIResponse } from '@playwright/test';
import { postSoap } from './parabank-soap';

export type TransferResponse = {
  transferResponse: { transferReturn: string };
};

export function soapTransfer(
  fromAccountId: number,
  toAccountId: number,
  amount: number,
): Promise<APIResponse> {
  return postSoap('transfer', { fromAccountId, toAccountId, amount });
}
