import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const transactionUrl = (transactionId: number): string => `services/bank/transactions/${transactionId}`;

export function getTransaction(transactionId: number): Promise<APIResponse> {
  return getRequest().get(transactionUrl(transactionId), { headers: JSON_HEADERS });
}
