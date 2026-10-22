import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const accountTransactionsUrl = (accountId: number): string =>
  `services/bank/accounts/${accountId}/transactions`;

export type Transaction = {
  id: number;
  accountId: number;
  type: 'Credit' | 'Debit';
  date: number;
  amount: number;
  description: string;
};

export function getAccountTransactions(accountId: number): Promise<APIResponse> {
  return getRequest().get(accountTransactionsUrl(accountId), { headers: JSON_HEADERS });
}
