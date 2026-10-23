import type { APIResponse } from '@playwright/test';
import { ACCOUNT_TYPE_CODE, type NewAccountType } from '../rest/create-account';
import type { SoapAccount } from './get-account';
import { postSoap } from './parabank-soap';

export type CreateAccountResponse = {
  createAccountResponse: { account: SoapAccount };
};

export function soapCreateAccount(
  customerId: number,
  type: NewAccountType,
  fromAccountId: number,
): Promise<APIResponse> {
  return postSoap('createAccount', {
    customerId,
    newAccountType: ACCOUNT_TYPE_CODE[type],
    fromAccountId,
  });
}
