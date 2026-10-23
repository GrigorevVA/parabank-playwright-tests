import type { APIResponse } from '@playwright/test';
import { getRequest } from '@core/request-holder';
import { JSON_HEADERS } from './json-headers';

const buyPositionUrl = (customerId: number): string =>
  `services/bank/customers/${customerId}/buyPosition`;

export type PositionOrder = {
  name: string;
  symbol: string;
  shares: number;
  pricePerShare: number;
};

export type Position = {
  positionId: number;
  customerId: number;
  name: string;
  symbol: string;
  shares: number;
  purchasePrice: number;
};

// answers with all positions of the customer
export function postBuyPosition(
  customerId: number,
  accountId: number,
  order: PositionOrder,
): Promise<APIResponse> {
  return getRequest().post(buyPositionUrl(customerId), {
    headers: JSON_HEADERS,
    params: { accountId, ...order },
  });
}
