import type { NewCustomer } from '../api/rest/register';

export type RegisterField = keyof NewCustomer;

// the form answers 200 even on errors, only this text proves success
export const REGISTER_SUCCESS_MESSAGE =
  'Your account was created successfully. You are now logged in.';

export const REGISTER_FIELD_LABELS: Record<RegisterField, string> = {
  firstName: 'First Name:',
  lastName: 'Last Name:',
  street: 'Address:',
  city: 'City:',
  state: 'State:',
  zipCode: 'Zip Code:',
  phoneNumber: 'Phone #:',
  ssn: 'SSN:',
  username: 'Username:',
  password: 'Password:',
};

// names used in feature files
export const REGISTER_FIELD_BY_NAME: Record<string, RegisterField> = {
  'First Name': 'firstName',
  'Last Name': 'lastName',
  Username: 'username',
};
