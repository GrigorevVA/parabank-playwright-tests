import { apiTest as test, expect } from '@fixtures/base.fixture';
import type { Account } from '@app/api/rest/account';
import { buildCustomer } from '@app/api/rest/builders/customer-builder';
import { postBuyPosition, type Position } from '@app/api/rest/buy-position';
import { fetchAccount, fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { buyPosition, fetchCustomerPositions } from '@app/api/rest/helpers/position-helper';
import { getPosition } from '@app/api/rest/position';
import { postSellPosition } from '@app/api/rest/sell-position';
import { UNKNOWN_POSITION_ID } from '@app/data/negative-data';
import { ACME_ORDER, SALE_PRICE } from '@app/data/position-orders';
import { allureLabels } from '@core/utils/allure-labels';
import { EPIC } from '@app/data/report-labels';

const SOLD_SHARES = 4;

// CRUD: buy creates a position, partial sale updates it, full sale deletes it
test.describe('ParaBank REST: positions', allureLabels(EPIC.REST, 'Positions', 'normal'), () => {
  let checking: Account;

  test.beforeEach(async () => {
    const customer = await registerCustomer(buildCustomer());
    [checking] = await fetchCustomerAccounts(customer.id);
  });

  test('Bought position can be read', async () => {
    const response = await postBuyPosition(checking.customerId, checking.id, ACME_ORDER);

    expect(response.status(), 'Buy position should return 200').toBe(200);
    const [position]: Position[] = await response.json();
    const expected = {
      customerId: checking.customerId,
      name: ACME_ORDER.name,
      symbol: ACME_ORDER.symbol,
      shares: ACME_ORDER.shares,
      purchasePrice: ACME_ORDER.pricePerShare,
    };
    expect(position, 'Buy should answer with the new position').toMatchObject(expected);
    expect(
      await (await getPosition(position.positionId)).json(),
      'Position should be readable by id',
    ).toEqual(position);
    expect(
      await fetchCustomerPositions(checking.customerId),
      'Customer should own the position',
    ).toEqual([position]);
    expect((await fetchAccount(checking.id)).balance, 'Account should pay for the shares').toBe(
      checking.balance - ACME_ORDER.shares * ACME_ORDER.pricePerShare,
    );
  });

  test('Partial sale reduces the shares', async () => {
    const [position] = await buyPosition(checking.customerId, checking.id, ACME_ORDER);
    const paid = await fetchAccount(checking.id);

    const response = await postSellPosition(checking.customerId, checking.id, {
      positionId: position.positionId,
      shares: SOLD_SHARES,
      pricePerShare: SALE_PRICE,
    });

    expect(response.status(), 'Sell position should return 200').toBe(200);
    expect(
      await (await getPosition(position.positionId)).json(),
      'Position should keep the rest',
    ).toMatchObject({
      positionId: position.positionId,
      shares: ACME_ORDER.shares - SOLD_SHARES,
    });
    expect(
      (await fetchAccount(checking.id)).balance,
      'Account should receive the sale amount',
    ).toBe(paid.balance + SOLD_SHARES * SALE_PRICE);
  });

  test('Full sale deletes the position', async () => {
    const [position] = await buyPosition(checking.customerId, checking.id, ACME_ORDER);

    const response = await postSellPosition(checking.customerId, checking.id, {
      positionId: position.positionId,
      shares: ACME_ORDER.shares,
      pricePerShare: SALE_PRICE,
    });

    expect(response.status(), 'Sell position should return 200').toBe(200);
    expect(await response.json(), 'No positions should remain').toEqual([]);
    const deleted = await getPosition(position.positionId);
    expect(deleted.status(), 'Sold position should not be found').toBe(400);
    expect(await deleted.text(), 'Error should name the position').toBe(
      `Could not find position #${position.positionId}`,
    );
  });

  test('Selling an unknown position is rejected', async () => {
    const response = await postSellPosition(checking.customerId, checking.id, {
      positionId: UNKNOWN_POSITION_ID,
      shares: ACME_ORDER.shares,
      pricePerShare: SALE_PRICE,
    });

    expect(response.status(), 'Selling an unknown position should return 400').toBe(400);
    expect(await response.text(), 'Error should explain the failed sale').toContain(
      'Could not sell position',
    );
    expect((await fetchAccount(checking.id)).balance, 'Balance should not change').toBe(
      checking.balance,
    );
  });

  test('Unknown position is not found', async () => {
    const response = await getPosition(UNKNOWN_POSITION_ID);

    expect(response.status(), 'Unknown position should return 400').toBe(400);
    expect(await response.text(), 'Error should name the position').toBe(
      `Could not find position #${UNKNOWN_POSITION_ID}`,
    );
  });
});
