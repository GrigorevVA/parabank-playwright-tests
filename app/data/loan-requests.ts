import type { LoanRequest } from '../api/rest/request-loan';

export type DeniedLoan = LoanRequest & { message: string };

// a new customer starts with $515.50 on the first account
export const APPROVED_LOANS: readonly LoanRequest[] = [
  { amount: 1000, downPayment: 100 },
  { amount: 500, downPayment: 0 },
];

export const DENIED_LOANS: readonly DeniedLoan[] = [
  { amount: 100000, downPayment: 10, message: 'error.insufficient.funds' },
  { amount: 100, downPayment: 1000, message: 'error.insufficient.funds.for.down.payment' },
];
