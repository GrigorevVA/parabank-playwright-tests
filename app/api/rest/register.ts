import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';

// ParaBank has no REST registration, so the HTML form endpoint is used
export const REGISTER_URL = 'register.htm';

export type NewCustomer = {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  ssn: string;
  username: string;
  password: string;
};

// the form POST fails with 500 without a session, GET opens one
export function getRegister(): Promise<APIResponse> {
  return getRequest().get(REGISTER_URL);
}

export function postRegister(customer: NewCustomer): Promise<APIResponse> {
  return getRequest().post(REGISTER_URL, {
    form: {
      'customer.firstName': customer.firstName,
      'customer.lastName': customer.lastName,
      'customer.address.street': customer.street,
      'customer.address.city': customer.city,
      'customer.address.state': customer.state,
      'customer.address.zipCode': customer.zipCode,
      'customer.phoneNumber': customer.phoneNumber,
      'customer.ssn': customer.ssn,
      'customer.username': customer.username,
      'customer.password': customer.password,
      repeatedPassword: customer.password,
    },
  });
}
