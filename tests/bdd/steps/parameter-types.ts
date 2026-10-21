import { defineParameterType } from 'playwright-bdd';
import { REGISTER_FIELD_BY_NAME } from '@app/data/register-fields';

defineParameterType({
  name: 'registerField',
  regexp: /First Name|Last Name|Username/,
  transformer: (name: string) => REGISTER_FIELD_BY_NAME[name],
});

export type PasswordKind = 'valid' | 'wrong';

defineParameterType({
  name: 'passwordKind',
  regexp: /valid|wrong/,
  transformer: (kind: string) => kind as PasswordKind,
});
