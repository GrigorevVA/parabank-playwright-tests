import { HtmlElement } from '@core/elements/html-element';
import { Select } from '@core/elements/select';
import { getPage } from '@core/page-holder';
import { step } from '@core/utils/step';
import type { NewAccountType } from '../api/rest/create-account';

export class OpenNewAccountPage {
  // selects have no labels, only ids
  static readonly accountTypeSelect = () =>
    new Select(getPage().locator('#type'), 'Account type select');

  static readonly fromAccountSelect = () =>
    new Select(getPage().locator('#fromAccountId'), 'From account select');

  static readonly openNewAccountButton = () =>
    new HtmlElement(
      getPage().getByRole('button', { name: 'Open New Account' }),
      'Open New Account button',
    );

  static readonly newAccountLink = () =>
    new HtmlElement(
      getPage()
        .getByRole('paragraph')
        .filter({ hasText: 'Your new account number:' })
        .getByRole('link'),
      'New account link',
    );

  static async openAccount(type: NewAccountType, fromAccountId: number): Promise<void> {
    await step(`Open ${type} account`, async () => {
      await OpenNewAccountPage.accountTypeSelect().select(type);
      // the list of source accounts loads after the page, selectOption waits for the option
      await OpenNewAccountPage.fromAccountSelect().select(String(fromAccountId));
      await OpenNewAccountPage.openNewAccountButton().click();
    });
  }

  static async getNewAccountNumber(): Promise<string> {
    return step('Get new account number', () =>
      OpenNewAccountPage.newAccountLink().locator.innerText(),
    );
  }
}
