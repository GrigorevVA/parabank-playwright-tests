import { defineParameterType } from 'playwright-bdd';
import type { NewAccountType } from '@app/api/rest/create-account';
import { ACCOUNT_TYPES } from '@app/data/account-types';
import { REGISTER_FIELD_BY_NAME } from '@app/data/register-fields';

defineParameterType({
  name: 'registerField',
  regexp: /First Name|Last Name|Username/,
  transformer: (name: string) => REGISTER_FIELD_BY_NAME[name],
});

defineParameterType({
  name: 'accountType',
  regexp: new RegExp(ACCOUNT_TYPES.join('|')),
  transformer: (type: string) => type as NewAccountType,
});

export type PasswordKind = 'valid' | 'wrong';

defineParameterType({
  name: 'passwordKind',
  regexp: /valid|wrong/,
  transformer: (kind: string) => kind as PasswordKind,
});
