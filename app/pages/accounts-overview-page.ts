import { HtmlElement } from '@core/elements/html-element';
import { getPage } from '@core/page-holder';
import { step } from '@core/utils/step';

export class AccountsOverviewPage {
  static readonly title = () =>
    new HtmlElement(
      getPage().getByRole('heading', { name: 'Accounts Overview' }),
      'Accounts Overview title',
    );

  static readonly accountRow = (accountNumber: string) =>
    new HtmlElement(
      getPage()
        .getByRole('row')
        .filter({ has: getPage().getByRole('link', { name: accountNumber, exact: true }) }),
      `Account ${accountNumber} row`,
    );

  static readonly accountLink = (accountNumber: string) =>
    new HtmlElement(
      getPage().getByRole('link', { name: accountNumber, exact: true }),
      `Account ${accountNumber} link`,
    );

  static async openAccount(accountNumber: string): Promise<void> {
    await step(`Open account ${accountNumber} activity`, () =>
      AccountsOverviewPage.accountLink(accountNumber).click(),
    );
  }
}
