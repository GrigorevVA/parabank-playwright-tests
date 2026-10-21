import { expect, type APIResponse } from '@playwright/test';

export type StatusCheckOptions = {
  soft?: boolean;
};

export function expectStatus(
  response: APIResponse,
  status: number,
  requestName: string,
  { soft = false }: StatusCheckOptions = {},
): void {
  const check = soft ? expect.soft : expect;
  check(response.status(), `${requestName} should return ${status}`).toBe(status);
}
