import { parseSoapBody, type SoapFault } from '@core/api/soap';
import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { buyPosition } from '@app/api/rest/helpers/position-helper';
import {
  POSITION_LIST_TAGS,
  soapBuyPosition,
  type BuyPositionResponse,
} from '@app/api/soap/buy-position';
import { soapGetPosition } from '@app/api/soap/get-position';
import { fetchSoapPosition, fetchSoapPositions } from '@app/api/soap/helpers/position-helper';
import { soapSellPosition, type SellPositionResponse } from '@app/api/soap/sell-position';
import { ACME_ORDER, SALE_PRICE } from '@app/data/position-orders';

const SOLD_SHARES = 4;

// CRUD: buy creates a position, partial sale updates it, full sale deletes it;
// positions for the update and delete tests are bought via REST as setup
test.describe('ParaBank SOAP: positions', () => {
  let checking: Account;

  test.beforeEach(async () => {
    const customer = await registerCustomer(buildCustomer());
    [checking] = await fetchCustomerAccounts(customer.id);
  });

  test('Bought position can be read', async () => {
    const response = await soapBuyPosition(checking.customerId, checking.id, ACME_ORDER);

    expect(response.status(), 'SOAP buyPosition should return 200').toBe(200);
    const [position] = parseSoapBody<BuyPositionResponse>(await response.text(), POSITION_LIST_TAGS)
      .buyPositionResponse.position;
    expect(position, 'Buy should answer with the new position').toMatchObject({
      customerId: String(checking.customerId),
      symbol: ACME_ORDER.symbol,
      shares: String(ACME_ORDER.shares),
    });
    expect(
      await fetchSoapPosition(Number(position.positionId)),
      'Position should be readable by id',
    ).toEqual(position);
    expect(
      await fetchSoapPositions(checking.customerId),
      'Customer should own the position',
    ).toEqual([position]);
  });

  test('Partial sale reduces the shares', async () => {
    const [position] = await buyPosition(checking.customerId, checking.id, ACME_ORDER);

    const response = await soapSellPosition(checking.customerId, checking.id, {
      positionId: position.positionId,
      shares: SOLD_SHARES,
      pricePerShare: SALE_PRICE,
    });

    expect(response.status(), 'SOAP sellPosition should return 200').toBe(200);
    expect(
      (await fetchSoapPosition(position.positionId)).shares,
      'Position should keep the rest of the shares',
    ).toBe(String(ACME_ORDER.shares - SOLD_SHARES));
  });

  test('Full sale deletes the position', async () => {
    const [position] = await buyPosition(checking.customerId, checking.id, ACME_ORDER);

    const response = await soapSellPosition(checking.customerId, checking.id, {
      positionId: position.positionId,
      shares: ACME_ORDER.shares,
      pricePerShare: SALE_PRICE,
    });

    expect(response.status(), 'SOAP sellPosition should return 200').toBe(200);
    expect(
      parseSoapBody<SellPositionResponse>(await response.text()).sellPositionResponse,
      'No positions should remain',
    ).toBe('');
    const deleted = await soapGetPosition(position.positionId);
    expect(deleted.status(), 'Sold position should return a fault').toBe(500);
    expect(
      parseSoapBody<SoapFault>(await deleted.text()).Fault.faultstring,
      'Fault should name the position',
    ).toBe(`Could not find position #${position.positionId}`);
  });
});
