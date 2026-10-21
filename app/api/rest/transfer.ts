import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const TRANSFER_URL = 'services/bank/transfer';

export function postTransfer(
  fromAccountId: number,
  toAccountId: number,
  amount: number,
): Promise<APIResponse> {
  return getRequest().post(TRANSFER_URL, {
    headers: JSON_HEADERS,
    params: { fromAccountId, toAccountId, amount },
  });
}
