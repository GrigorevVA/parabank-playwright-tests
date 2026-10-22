import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const BILL_PAY_URL = 'services/bank/billpay';

export type Payee = {
  name: string;
  address: { street: string; city: string; state: string; zipCode: string };
  phoneNumber: string;
  accountNumber: number;
};

export type BillPayResult = {
  payeeName: string;
  amount: number;
  accountId: number;
};

export function postBillPay(accountId: number, amount: number, payee: Payee): Promise<APIResponse> {
  return getRequest().post(BILL_PAY_URL, {
    headers: JSON_HEADERS,
    params: { accountId, amount },
    data: payee,
  });
}
