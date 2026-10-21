import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

export const accountUrl = (accountId: number): string => `services/bank/accounts/${accountId}`;

export type AccountType = 'CHECKING' | 'SAVINGS';

export interface Account {
  id: number;
  customerId: number;
  type: AccountType;
  balance: number;
}

export function getAccount(accountId: number): Promise<APIResponse> {
  return getRequest().get(accountUrl(accountId), { headers: JSON_HEADERS });
}
