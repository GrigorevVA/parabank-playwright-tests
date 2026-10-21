import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const loginUrl = (username: string, password: string): string =>
  `services/bank/login/${username}/${password}`;

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  address: { street: string; city: string; state: string; zipCode: string };
  phoneNumber: string;
  ssn: string;
};

export function getLogin(username: string, password: string): Promise<APIResponse> {
  return getRequest().get(loginUrl(username, password), { headers: JSON_HEADERS });
}
