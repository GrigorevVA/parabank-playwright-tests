import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const customerUrl = (customerId: number): string => `services/bank/customers/${customerId}`;

// ParaBank has no customer deletion: DELETE answers 405
export function getCustomer(customerId: number): Promise<APIResponse> {
  return getRequest().get(customerUrl(customerId), { headers: JSON_HEADERS });
}
