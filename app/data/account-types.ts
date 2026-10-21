import type { NewAccountType } from '../api/rest/create-account';

export const ACCOUNT_TYPES: readonly NewAccountType[] = ['CHECKING', 'SAVINGS'];

// ParaBank moves the minimum deposit into every new account
export const OPENING_DEPOSIT = '$100.00';
