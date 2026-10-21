import { faker } from '@faker-js/faker';
import type { NewCustomer } from '../register';

// ParaBank stores at most 20 characters of a city and answers
// "This username already exists." for a longer one
const CITY_MAX_LENGTH = 20;

export function buildCustomer(): NewCustomer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    street: faker.location.streetAddress(),
    city: faker.location.city().slice(0, CITY_MAX_LENGTH).trimEnd(),
    state: faker.location.state({ abbreviated: true }),
    zipCode: faker.location.zipCode('#####'),
    phoneNumber: faker.string.numeric(10),
    ssn: faker.string.numeric(9),
    username: `qa_${faker.string.alphanumeric(10)}`,
    // password goes into the REST login URL path, so no special characters
    password: faker.string.alphanumeric(12),
  };
}
