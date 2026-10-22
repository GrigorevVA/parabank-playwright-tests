import { expectStatus, type StatusCheckOptions } from '@core/api/expect-status';
import { step } from '@core/utils/step';
import { getAccountTransactions, type Transaction } from '../account-transactions';
import { postBillPay, type Payee } from '../bill-pay';

export function payBill(
  accountId: number,
  amount: number,
  payee: Payee,
  options?: StatusCheckOptions,
): Promise<void> {
  return step(`Pay $${amount} to ${payee.name} from account ${accountId}`, async () => {
    expectStatus(await postBillPay(accountId, amount, payee), 200, 'Bill pay', options);
  });
}

export function fetchAccountTransactions(
  accountId: number,
  options?: StatusCheckOptions,
): Promise<Transaction[]> {
  return step(`Fetch transactions of account ${accountId}`, async () => {
    const response = await getAccountTransactions(accountId);
    expectStatus(response, 200, 'Get account transactions', options);
    return response.json();
  });
}
