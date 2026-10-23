import type { APIResponse } from '@playwright/test';
import type { LoanRequest } from '../rest/request-loan';
import { postSoap } from './parabank-soap';

// a denied loan still answers 200, the decision is in `approved`
export type SoapLoanResponse = {
  responseDate: string;
  loanProviderName: string;
  approved: 'true' | 'false';
  accountId?: string;
  message?: string;
};

export type RequestLoanResponse = {
  requestLoanResponse: { loanResponse: SoapLoanResponse };
};

export function soapRequestLoan(
  customerId: number,
  { amount, downPayment }: LoanRequest,
  fromAccountId: number,
): Promise<APIResponse> {
  return postSoap('requestLoan', { customerId, amount, downPayment, fromAccountId });
}
