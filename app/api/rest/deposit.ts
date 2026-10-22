import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const DEPOSIT_URL = 'services/bank/deposit';

export function postDeposit(accountId: number, amount: number): Promise<APIResponse> {
  return getRequest().post(DEPOSIT_URL, { headers: JSON_HEADERS, params: { accountId, amount } });
}
