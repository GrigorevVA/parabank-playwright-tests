import { faker } from '@faker-js/faker';
import type { Payee } from '../bill-pay';

export function buildPayee(): Payee {
  return {
    name: faker.company.name(),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('#####'),
    },
    phoneNumber: faker.string.numeric(10),
    accountNumber: faker.number.int({ min: 10000, max: 99999 }),
  };
}
