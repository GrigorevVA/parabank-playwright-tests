import type { APIResponse } from '@playwright/test';
import { postSoap } from './parabank-soap';

export interface SoapCustomer {
  id: string;
  firstName: string;
  lastName: string;
  address: { street: string; city: string; state: string; zipCode: string };
  phoneNumber: string;
  ssn: string;
}

export interface LoginResponse {
  loginResponse: { customerId: SoapCustomer };
}

export function soapLogin(username: string, password: string): Promise<APIResponse> {
  return postSoap('login', { username, password });
}
