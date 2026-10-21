import { HtmlElement } from '@core/elements/html-element';
import { Input } from '@core/elements/input';
import { Select } from '@core/elements/select';
import { getPage } from '@core/page-holder';
import { step } from '@core/utils/step';

export class TransferFundsPage {
  // fields have no labels, only ids
  static readonly amountInput = () => new Input(getPage().locator('#amount'), 'Amount input');

  static readonly fromAccountSelect = () =>
    new Select(getPage().locator('#fromAccountId'), 'From account select');

  static readonly toAccountSelect = () =>
    new Select(getPage().locator('#toAccountId'), 'To account select');

  static readonly transferButton = () =>
    new HtmlElement(getPage().getByRole('button', { name: 'Transfer', exact: true }), 'Transfer button');

  static readonly transferResult = () =>
    new HtmlElement(
      getPage().getByRole('paragraph').filter({ hasText: 'has been transferred' }),
      'Transfer result',
    );

  static async transfer(amount: number, fromAccountId: number, toAccountId: number): Promise<void> {
    await step(`Transfer $${amount} from account ${fromAccountId} to account ${toAccountId}`, async () => {
      await TransferFundsPage.amountInput().fill(String(amount));
      await TransferFundsPage.fromAccountSelect().select(String(fromAccountId));
      await TransferFundsPage.toAccountSelect().select(String(toAccountId));
      await TransferFundsPage.transferButton().click();
    });
  }
}
