import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const transactionsByAmountUrl = (accountId: number, amount: number): string =>
  `services/bank/accounts/${accountId}/transactions/amount/${amount}`;

export function getTransactionsByAmount(accountId: number, amount: number): Promise<APIResponse> {
  return getRequest().get(transactionsByAmountUrl(accountId, amount), { headers: JSON_HEADERS });
}
