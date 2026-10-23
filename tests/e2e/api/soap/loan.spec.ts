import { parseSoapBody } from '@core/api/soap';
import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { fetchSoapAccount } from '@app/api/soap/helpers/account-helper';
import { soapRequestLoan, type RequestLoanResponse } from '@app/api/soap/request-loan';
import { APPROVED_LOANS, DENIED_LOANS } from '@app/data/loan-requests';
import { allureLabels } from '@core/utils/allure-labels';
import { EPIC } from '@app/data/report-labels';

test.describe('ParaBank SOAP: loan', allureLabels(EPIC.SOAP, 'Loan', 'normal'), () => {
  let checking: Account;

  test.beforeEach(async () => {
    const customer = await registerCustomer(buildCustomer());
    [checking] = await fetchCustomerAccounts(customer.id);
  });

  for (const loan of APPROVED_LOANS) {
    test(`Loan of $${loan.amount} with $${loan.downPayment} down payment is approved`, async () => {
      const response = await soapRequestLoan(checking.customerId, loan, checking.id);

      expect(response.status(), 'SOAP requestLoan should return 200').toBe(200);
      const { loanResponse } = parseSoapBody<RequestLoanResponse>(
        await response.text(),
      ).requestLoanResponse;
      expect(loanResponse.approved, 'Loan should be approved').toBe('true');
      expect(
        await fetchSoapAccount(Number(loanResponse.accountId)),
        'Loan account should hold the loan amount',
      ).toMatchObject({ type: 'LOAN', balance: loan.amount.toFixed(2) });
    });
  }

  for (const loan of DENIED_LOANS) {
    test(`Loan of $${loan.amount} with $${loan.downPayment} down payment is denied`, async () => {
      const response = await soapRequestLoan(checking.customerId, loan, checking.id);

      expect(response.status(), 'SOAP requestLoan should return 200').toBe(200);
      const { loanResponse } = parseSoapBody<RequestLoanResponse>(
        await response.text(),
      ).requestLoanResponse;
      expect(loanResponse, 'Loan should be denied with a reason').toMatchObject({
        approved: 'false',
        message: loan.message,
      });
      expect(loanResponse.accountId, 'Denied loan should not create an account').toBeUndefined();
    });
  }
});
