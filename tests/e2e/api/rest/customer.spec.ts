import { apiTest as test, expect } from '@fixtures/base.fixture';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { getCustomer } from '@app/api/rest/customer';
import { fetchCustomer, registerCustomer } from '@app/api/rest/helpers/customer-helper';
import type { Customer } from '@app/api/rest/login';
import type { NewCustomer } from '@app/api/rest/register';
import { postUpdateCustomer } from '@app/api/rest/update-customer';
import { UNKNOWN_CUSTOMER_ID } from '@app/data/negative-data';
import { allureLabels } from '@core/utils/allure-labels';
import { EPIC } from '@app/data/report-labels';

// CRUD: create = registration in beforeEach, delete is not supported by ParaBank
test.describe('ParaBank REST: customer', allureLabels(EPIC.REST, 'Customer', 'normal'), () => {
  let newCustomer: NewCustomer;
  let customer: Customer;

  test.beforeEach(async () => {
    newCustomer = buildCustomer();
    customer = await registerCustomer(newCustomer);
  });

  test('Registered customer can be read by id', async () => {
    const response = await getCustomer(customer.id);

    expect(response.status(), 'Get customer should return 200').toBe(200);
    expect(await response.json(), 'Customer should have the registered data').toMatchObject({
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      address: { street: newCustomer.street, city: newCustomer.city, zipCode: newCustomer.zipCode },
      phoneNumber: newCustomer.phoneNumber,
    });
  });

  test('Customer profile can be updated', async () => {
    const update = {
      ...buildCustomer(),
      username: newCustomer.username,
      password: newCustomer.password,
    };

    const response = await postUpdateCustomer(customer.id, update);

    expect(response.status(), 'Update customer should return 200').toBe(200);
    expect(await response.text(), 'Update should confirm the operation').toBe(
      'Successfully updated customer profile',
    );
    expect(await fetchCustomer(customer.id), 'Customer should have the updated data').toMatchObject(
      {
        firstName: update.firstName,
        lastName: update.lastName,
        address: { street: update.street, city: update.city, zipCode: update.zipCode },
        phoneNumber: update.phoneNumber,
      },
    );
  });

  test('Unknown customer is not found', async () => {
    const response = await getCustomer(UNKNOWN_CUSTOMER_ID);

    expect(response.status(), 'Unknown customer should return 400').toBe(400);
    expect(await response.text(), 'Error should name the customer').toBe(
      `Could not find customer #${UNKNOWN_CUSTOMER_ID}`,
    );
  });
});
