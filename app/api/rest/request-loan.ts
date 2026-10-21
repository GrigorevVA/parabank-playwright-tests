import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const REQUEST_LOAN_URL = 'services/bank/requestLoan';

export type LoanRequest = {
  amount: number;
  downPayment: number;
};

// a denied loan still answers 200, the decision is in `approved`
export type LoanResponse = {
  responseDate: number;
  loanProviderName: string;
  approved: boolean;
  message?: string;
  accountId: number | null;
};

export function postRequestLoan(
  customerId: number,
  { amount, downPayment }: LoanRequest,
  fromAccountId: number,
): Promise<APIResponse> {
  return getRequest().post(REQUEST_LOAN_URL, {
    headers: JSON_HEADERS,
    params: { customerId, amount, downPayment, fromAccountId },
  });
}
