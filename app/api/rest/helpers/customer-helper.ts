import { expect } from '@playwright/test';
import { expectStatus, type StatusCheckOptions } from '@core/api/expect-status';
import { step } from '@core/utils/step';
import { getCustomer } from '../customer';
import { getLogin, type Customer } from '../login';
import { REGISTER_SUCCESS_MESSAGE } from '../../../data/register-fields';
import { getRegister, postRegister, type NewCustomer } from '../register';

export function registerCustomer(
  newCustomer: NewCustomer,
  options?: StatusCheckOptions,
): Promise<Customer> {
  return step(`Register customer ${newCustomer.username} to get profile`, async () => {
    expectStatus(await getRegister(), 200, 'Open register form', options);
    const registerResponse = await postRegister(newCustomer);
    expectStatus(registerResponse, 200, 'Submit register form', options);
    // always hard: login makes no sense without the account
    expect(await registerResponse.text(), 'Register form should create the account').toContain(
      REGISTER_SUCCESS_MESSAGE,
    );
    const loginResponse = await getLogin(newCustomer.username, newCustomer.password);
    expectStatus(loginResponse, 200, 'Login', options);
    return loginResponse.json();
  });
}

export function fetchCustomer(customerId: number, options?: StatusCheckOptions): Promise<Customer> {
  return step(`Fetch customer ${customerId}`, async () => {
    const response = await getCustomer(customerId);
    expectStatus(response, 200, 'Get customer', options);
    return response.json();
  });
}
