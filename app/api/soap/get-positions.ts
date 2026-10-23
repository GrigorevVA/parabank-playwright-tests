import type { APIResponse } from '@playwright/test';
import type { SoapPosition } from './buy-position';
import { postSoap } from './parabank-soap';

export type GetPositionsResponse = {
  getPositionsResponse: { position: SoapPosition[] };
};

export function soapGetPositions(customerId: number): Promise<APIResponse> {
  return postSoap('getPositions', { customerId });
}
