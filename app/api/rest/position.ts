import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const positionUrl = (positionId: number): string => `services/bank/positions/${positionId}`;

export function getPosition(positionId: number): Promise<APIResponse> {
  return getRequest().get(positionUrl(positionId), { headers: JSON_HEADERS });
}
