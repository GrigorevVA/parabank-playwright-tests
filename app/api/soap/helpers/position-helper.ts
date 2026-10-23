import { expectStatus, type StatusCheckOptions } from '@core/api/expect-status';
import { parseSoapBody } from '@core/api/soap';
import { step } from '@core/utils/step';
import { POSITION_LIST_TAGS, type SoapPosition } from '../buy-position';
import { soapGetPosition, type GetPositionResponse } from '../get-position';
import { soapGetPositions, type GetPositionsResponse } from '../get-positions';

export function fetchSoapPosition(
  positionId: number,
  options?: StatusCheckOptions,
): Promise<SoapPosition> {
  return step(`Fetch position ${positionId} via SOAP`, async () => {
    const response = await soapGetPosition(positionId);
    expectStatus(response, 200, 'SOAP getPosition', options);
    return parseSoapBody<GetPositionResponse>(await response.text()).getPositionResponse.position;
  });
}

export function fetchSoapPositions(
  customerId: number,
  options?: StatusCheckOptions,
): Promise<SoapPosition[]> {
  return step(`Fetch positions of customer ${customerId} via SOAP`, async () => {
    const response = await soapGetPositions(customerId);
    expectStatus(response, 200, 'SOAP getPositions', options);
    return parseSoapBody<GetPositionsResponse>(await response.text(), POSITION_LIST_TAGS)
      .getPositionsResponse.position;
  });
}
