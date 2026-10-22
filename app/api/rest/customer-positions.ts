import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const customerPositionsUrl = (customerId: number): string => `services/bank/customers/${customerId}/positions`;

export function getCustomerPositions(customerId: number): Promise<APIResponse> {
  return getRequest().get(customerPositionsUrl(customerId), { headers: JSON_HEADERS });
}
