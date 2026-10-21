import { test } from '@playwright/test';

export function step<T>(title: string, body: () => Promise<T>): Promise<T> {
  return test.step(title, body, { box: true });
}
