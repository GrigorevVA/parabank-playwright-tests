import type { APIResponse } from '@playwright/test';
import { postSoap } from './parabank-soap';

// pass to parseSoapBody so a single transaction is still an array
export const TRANSACTION_LIST_TAGS = ['transaction'];

export type SoapTransaction = {
  id: string;
  accountId: string;
  type: 'Credit' | 'Debit';
  date: string;
  amount: string;
  description: string;
};

export type GetTransactionsResponse = {
  getTransactionsResponse: { transaction: SoapTransaction[] };
};

export function soapGetTransactions(accountId: number): Promise<APIResponse> {
  return postSoap('getTransactions', { accountId });
}
