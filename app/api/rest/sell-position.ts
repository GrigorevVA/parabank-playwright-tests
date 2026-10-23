import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const sellPositionUrl = (customerId: number): string =>
  `services/bank/customers/${customerId}/sellPosition`;

export type PositionSale = {
  positionId: number;
  shares: number;
  pricePerShare: number;
};

// selling all shares deletes the position; answers with the remaining positions
export function postSellPosition(
  customerId: number,
  accountId: number,
  sale: PositionSale,
): Promise<APIResponse> {
  return getRequest().post(sellPositionUrl(customerId), {
    headers: JSON_HEADERS,
    params: { accountId, ...sale },
  });
}
