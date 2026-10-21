import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { fetchAccount, fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { postRequestLoan, type LoanResponse } from '@app/api/rest/request-loan';
import { APPROVED_LOANS, DENIED_LOANS } from '@app/data/loan-requests';

test.describe('ParaBank REST: loan', () => {
  let checking: Account;

  test.beforeEach(async () => {
    const customer = await registerCustomer(buildCustomer());
    [checking] = await fetchCustomerAccounts(customer.id);
  });

  for (const loan of APPROVED_LOANS) {
    test(`Loan of $${loan.amount} with $${loan.downPayment} down payment is approved`, async () => {
      const response = await postRequestLoan(checking.customerId, loan, checking.id);

      expect(response.status(), 'Loan request should return 200').toBe(200);
      const decision: LoanResponse = await response.json();
      expect(decision.approved, 'Loan should be approved').toBe(true);
      expect(decision.accountId, 'Approved loan should return its account id').not.toBeNull();
      const loanAccount = await fetchAccount(decision.accountId!);
      expect(loanAccount, 'Loan account should hold the loan amount').toMatchObject({
        type: 'LOAN',
        balance: loan.amount,
      });
      expect(
        (await fetchAccount(checking.id)).balance,
        'Down payment should be taken from the source account',
      ).toBe(checking.balance - loan.downPayment);
    });
  }

  for (const loan of DENIED_LOANS) {
    test(`Loan of $${loan.amount} with $${loan.downPayment} down payment is denied`, async () => {
      const response = await postRequestLoan(checking.customerId, loan, checking.id);

      expect(response.status(), 'Loan request should return 200').toBe(200);
      const decision: LoanResponse = await response.json();
      expect(decision, 'Loan should be denied with a reason').toMatchObject({
        approved: false,
        message: loan.message,
        accountId: null,
      });
      expect(
        (await fetchAccount(checking.id)).balance,
        'Source balance should not change',
      ).toBe(checking.balance);
    });
  }
});
