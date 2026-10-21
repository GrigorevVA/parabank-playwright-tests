import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const customerAccountsUrl = (customerId: number): string =>
  `services/bank/customers/${customerId}/accounts`;

export function getCustomerAccounts(customerId: number): Promise<APIResponse> {
  return getRequest().get(customerAccountsUrl(customerId), { headers: JSON_HEADERS });
}
