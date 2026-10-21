import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import type { AccountType } from './account';
import { JSON_HEADERS } from './json-headers';

const CREATE_ACCOUNT_URL = 'services/bank/createAccount';

// LOAN accounts appear only after an approved loan request
export type NewAccountType = Exclude<AccountType, 'LOAN'>;

const ACCOUNT_TYPE_CODE: Record<NewAccountType, number> = { CHECKING: 0, SAVINGS: 1 };

export function postCreateAccount(
  customerId: number,
  type: NewAccountType,
  fromAccountId: number,
): Promise<APIResponse> {
  return getRequest().post(CREATE_ACCOUNT_URL, {
    headers: JSON_HEADERS,
    params: { customerId, newAccountType: ACCOUNT_TYPE_CODE[type], fromAccountId },
  });
}
