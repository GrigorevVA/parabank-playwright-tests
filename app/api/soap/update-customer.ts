import type { APIResponse } from '@playwright/test';
import type { NewCustomer } from '../rest/register';
import { postSoap } from './parabank-soap';

export type UpdateCustomerResponse = {
  updateCustomerResponse: { customerUpdateResult: string };
};

export function soapUpdateCustomer(
  customerId: number,
  customer: NewCustomer,
): Promise<APIResponse> {
  return postSoap('updateCustomer', { customerId, ...customer });
}
