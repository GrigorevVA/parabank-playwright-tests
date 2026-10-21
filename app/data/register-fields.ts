import type { NewCustomer } from '../api/rest/register';

export type RegisterField = keyof NewCustomer;

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
