import type { APIResponse } from '@playwright/test';
import type { SoapPosition } from './buy-position';
import { postSoap } from './parabank-soap';

export type GetPositionResponse = {
  getPositionResponse: { position: SoapPosition };
};

export function soapGetPosition(positionId: number): Promise<APIResponse> {
  return postSoap('getPosition', { positionId });
}
