import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const WITHDRAW_URL = 'services/bank/withdraw';

export function postWithdraw(accountId: number, amount: number): Promise<APIResponse> {
  return getRequest().post(WITHDRAW_URL, { headers: JSON_HEADERS, params: { accountId, amount } });
}
