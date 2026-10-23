import { parseSoapBody, type SoapFault } from '@core/api/soap';
import { apiTest as test, expect } from '@fixtures/base.fixture';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import type { Customer } from '@app/api/rest/login';
import type { NewCustomer } from '@app/api/rest/register';
import { soapGetCustomer, type GetCustomerResponse } from '@app/api/soap/get-customer';
import { fetchSoapCustomer } from '@app/api/soap/helpers/customer-helper';
import { soapUpdateCustomer, type UpdateCustomerResponse } from '@app/api/soap/update-customer';
import { UNKNOWN_CUSTOMER_ID } from '@app/data/negative-data';

// SOAP values are strings, so expected data is compared as text
const contactData = (customer: NewCustomer) => ({
  firstName: customer.firstName,
  lastName: customer.lastName,
  address: { street: customer.street, city: customer.city, zipCode: customer.zipCode },
  phoneNumber: customer.phoneNumber,
});

// CRUD: create = registration in beforeEach, delete is not supported by ParaBank
test.describe('ParaBank SOAP: customer', () => {
  let newCustomer: NewCustomer;
  let customer: Customer;

  test.beforeEach(async () => {
    newCustomer = buildCustomer();
    customer = await registerCustomer(newCustomer);
  });

  test('Registered customer can be read by id', async () => {
    const response = await soapGetCustomer(customer.id);

    expect(response.status(), 'SOAP getCustomer should return 200').toBe(200);
    const { getCustomerResponse } = parseSoapBody<GetCustomerResponse>(await response.text());
    expect(getCustomerResponse.customer, 'Customer should have the registered data').toMatchObject({
      id: String(customer.id),
      ...contactData(newCustomer),
    });
  });

  test('Customer profile can be updated', async () => {
    const update = {
      ...buildCustomer(),
      username: newCustomer.username,
      password: newCustomer.password,
    };

    const response = await soapUpdateCustomer(customer.id, update);

    expect(response.status(), 'SOAP updateCustomer should return 200').toBe(200);
    const { updateCustomerResponse } = parseSoapBody<UpdateCustomerResponse>(await response.text());
    expect(updateCustomerResponse.customerUpdateResult, 'Update should be confirmed').toBe(
      'Successfully updated customer profile',
    );
    expect(
      await fetchSoapCustomer(customer.id),
      'Customer should have the updated data',
    ).toMatchObject(contactData(update));
  });

  test('Unknown customer returns fault', async () => {
    const response = await soapGetCustomer(UNKNOWN_CUSTOMER_ID);

    expect(response.status(), 'SOAP fault should return 500').toBe(500);
    const { Fault } = parseSoapBody<SoapFault>(await response.text());
    expect(Fault.faultstring, 'Fault should name the customer').toBe(
      `Could not find customer #${UNKNOWN_CUSTOMER_ID}`,
    );
  });
});
