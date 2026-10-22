import { expectStatus, type StatusCheckOptions } from '@core/api/expect-status';
import { step } from '@core/utils/step';
import { postBuyPosition, type Position, type PositionOrder } from '../buy-position';
import { getCustomerPositions } from '../customer-positions';

export function buyPosition(
  customerId: number,
  accountId: number,
  order: PositionOrder,
  options?: StatusCheckOptions,
): Promise<Position[]> {
  return step(`Buy ${order.shares} ${order.symbol} shares to get positions`, async () => {
    const response = await postBuyPosition(customerId, accountId, order);
    expectStatus(response, 200, 'Buy position', options);
    return response.json();
  });
}

export function fetchCustomerPositions(
  customerId: number,
  options?: StatusCheckOptions,
): Promise<Position[]> {
  return step(`Fetch positions of customer ${customerId}`, async () => {
    const response = await getCustomerPositions(customerId);
    expectStatus(response, 200, 'Get customer positions', options);
    return response.json();
  });
}
