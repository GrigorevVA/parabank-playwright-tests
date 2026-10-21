import { faker } from '@faker-js/faker';
import type { NewCustomer } from '../register';

export function buildCustomer(): NewCustomer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
    phoneNumber: faker.string.numeric(10),
    ssn: faker.string.numeric(9),
    username: `qa_${faker.string.alphanumeric(10)}`,
    // password goes into the REST login URL path, so no special characters
    password: faker.string.alphanumeric(12),
  };
}
