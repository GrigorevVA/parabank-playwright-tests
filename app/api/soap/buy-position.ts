import type { APIResponse } from '@playwright/test';
import type { PositionOrder } from '../rest/buy-position';
import { postSoap } from './parabank-soap';

// pass to parseSoapBody so a single position is still an array
export const POSITION_LIST_TAGS = ['position'];

export type SoapPosition = {
  positionId: string;
  customerId: string;
  name: string;
  symbol: string;
  shares: string;
  purchasePrice: string;
};

// answers with all positions of the customer
export type BuyPositionResponse = {
  buyPositionResponse: { position: SoapPosition[] };
};

export function soapBuyPosition(
  customerId: number,
  accountId: number,
  order: PositionOrder,
): Promise<APIResponse> {
  return postSoap('buyPosition', { customerId, accountId, ...order });
}
