import type { APIRequestContext } from '@playwright/test';

let currentRequest: APIRequestContext | undefined;

export function setRequest(request: APIRequestContext): void {
  currentRequest = request;
}

export function getRequest(): APIRequestContext {
  if (!currentRequest) {
    throw new Error('Request is not set. Import test from fixtures/base.fixture.ts');
  }
  return currentRequest;
}
