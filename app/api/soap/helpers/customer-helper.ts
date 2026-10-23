import { expectStatus, type StatusCheckOptions } from '@core/api/expect-status';
import { parseSoapBody } from '@core/api/soap';
import { step } from '@core/utils/step';
import { soapGetCustomer, type GetCustomerResponse } from '../get-customer';
import type { SoapCustomer } from '../login';

export function fetchSoapCustomer(
  customerId: number,
  options?: StatusCheckOptions,
): Promise<SoapCustomer> {
  return step(`Fetch customer ${customerId} via SOAP`, async () => {
    const response = await soapGetCustomer(customerId);
    expectStatus(response, 200, 'SOAP getCustomer', options);
    return parseSoapBody<GetCustomerResponse>(await response.text()).getCustomerResponse.customer;
  });
}
