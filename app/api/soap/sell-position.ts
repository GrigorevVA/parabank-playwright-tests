import type { APIResponse } from '@playwright/test';
import type { PositionSale } from '../rest/sell-position';
import type { SoapPosition } from './buy-position';
import { postSoap } from './parabank-soap';

// remaining positions; after the last sale the response element is empty
export type SellPositionResponse = {
  sellPositionResponse: { position?: SoapPosition[] } | '';
};

export function soapSellPosition(
  customerId: number,
  accountId: number,
  sale: PositionSale,
): Promise<APIResponse> {
  return postSoap('sellPosition', { customerId, accountId, ...sale });
}
