import { apiTest as test, expect } from '@fixtures/base.fixture';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { getLogin, type Customer } from '@app/api/rest/login';
import type { NewCustomer } from '@app/api/rest/register';
import { WRONG_PASSWORD } from '@app/data/negative-data';

test.describe('ParaBank REST: login', () => {
  let newCustomer: NewCustomer;

  test.beforeEach(async () => {
    newCustomer = buildCustomer();
    await registerCustomer(newCustomer);
  });

  test('Login returns registered customer', async () => {
    const response = await getLogin(newCustomer.username, newCustomer.password);

    expect(response.status(), 'Login should return 200').toBe(200);
    const customer: Customer = await response.json();
    expect(customer, 'Login should return the registered customer').toMatchObject({
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      address: { city: newCustomer.city, zipCode: newCustomer.zipCode },
    });
  });

  test('Login with wrong password is rejected', async () => {
    const response = await getLogin(newCustomer.username, WRONG_PASSWORD);

    expect(response.status(), 'Login with wrong password should return 400').toBe(400);
    expect(await response.text(), 'Login error should explain the reason').toBe(
      'Invalid username and/or password',
    );
  });
});
