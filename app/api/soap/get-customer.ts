import type { APIResponse } from '@playwright/test';
import type { SoapCustomer } from './login';
import { postSoap } from './parabank-soap';

export type GetCustomerResponse = {
  getCustomerResponse: { customer: SoapCustomer };
};

export function soapGetCustomer(customerId: number): Promise<APIResponse> {
  return postSoap('getCustomer', { customerId });
}
