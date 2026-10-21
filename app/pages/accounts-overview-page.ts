import { HtmlElement } from '@core/elements/html-element';
import { getPage } from '@core/page-holder';

export class AccountsOverviewPage {
  static readonly title = () =>
    new HtmlElement(getPage().getByRole('heading', { name: 'Accounts Overview' }), 'Accounts Overview title');

  static readonly accountRow = (accountNumber: string) =>
    new HtmlElement(
      getPage().getByRole('row').filter({ has: getPage().getByRole('link', { name: accountNumber, exact: true }) }),
      `Account ${accountNumber} row`,
    );
}
