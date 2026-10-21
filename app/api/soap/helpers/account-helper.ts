import { expectStatus, type StatusCheckOptions } from '@core/api/expect-status';
import { parseSoapBody } from '@core/api/soap';
import { step } from '@core/utils/step';
import { soapGetAccount, type GetAccountResponse, type SoapAccount } from '../get-account';

export function fetchSoapAccount(
  accountId: number,
  options?: StatusCheckOptions,
): Promise<SoapAccount> {
  return step(`Fetch account ${accountId} via SOAP`, async () => {
    const response = await soapGetAccount(accountId);
    expectStatus(response, 200, 'SOAP getAccount', options);
    return parseSoapBody<GetAccountResponse>(await response.text()).getAccountResponse.account;
  });
}
