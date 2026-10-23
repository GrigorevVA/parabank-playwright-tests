import { parseSoapBody, type SoapFault } from '@core/api/soap';
import { apiTest as test, expect } from '@fixtures/base.fixture';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import type { NewCustomer } from '@app/api/rest/register';
import { soapLogin, type LoginResponse } from '@app/api/soap/login';
import { WRONG_PASSWORD } from '@app/data/negative-data';
import { allureLabels } from '@core/utils/allure-labels';
import { EPIC } from '@app/data/report-labels';

test.describe('ParaBank SOAP: login', allureLabels(EPIC.SOAP, 'Login', 'critical'), () => {
  let newCustomer: NewCustomer;

  test.beforeEach(async () => {
    newCustomer = buildCustomer();
    await registerCustomer(newCustomer);
  });

  test('Login returns registered customer', async () => {
    const response = await soapLogin(newCustomer.username, newCustomer.password);

    expect(response.status(), 'SOAP login should return 200').toBe(200);
    const { loginResponse } = parseSoapBody<LoginResponse>(await response.text());
    expect(
      loginResponse.customerId,
      'SOAP login should return the registered customer',
    ).toMatchObject({
      firstName: newCustomer.firstName,
      lastName: newCustomer.lastName,
      address: { city: newCustomer.city, zipCode: newCustomer.zipCode },
    });
  });

  test('Login with wrong password returns fault', async () => {
    const response = await soapLogin(newCustomer.username, WRONG_PASSWORD);

    expect(response.status(), 'SOAP fault should return 500').toBe(500);
    const { Fault } = parseSoapBody<SoapFault>(await response.text());
    expect(Fault.faultstring, 'Fault should explain the reason').toBe(
      'Invalid username and/or password',
    );
  });
});
