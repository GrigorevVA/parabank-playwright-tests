import { expectStatus, type StatusCheckOptions } from '@core/api/expect-status';
import { step } from '@core/utils/step';
import { getLogin, type Customer } from '../login';
import { getRegister, postRegister, type NewCustomer } from '../register';

export function registerCustomer(
  newCustomer: NewCustomer,
  options?: StatusCheckOptions,
): Promise<Customer> {
  return step(`Register customer ${newCustomer.username}`, async () => {
    expectStatus(await getRegister(), 200, 'Open register form', options);
    expectStatus(await postRegister(newCustomer), 200, 'Submit register form', options);
    const loginResponse = await getLogin(newCustomer.username, newCustomer.password);
    expectStatus(loginResponse, 200, 'Login', options);
    return loginResponse.json();
  });
}
