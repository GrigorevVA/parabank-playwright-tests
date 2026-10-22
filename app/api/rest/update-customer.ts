import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';
import type { NewCustomer } from './register';

const updateCustomerUrl = (customerId: number): string => `services/bank/customers/update/${customerId}`;

export function postUpdateCustomer(customerId: number, customer: NewCustomer): Promise<APIResponse> {
  return getRequest().post(updateCustomerUrl(customerId), {
    headers: JSON_HEADERS,
    params: { ...customer },
  });
}
