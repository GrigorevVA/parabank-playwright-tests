import { HtmlElement } from '@core/elements/html-element';
import { getPage } from '@core/page-holder';

export class AccountsOverviewPage {
  static readonly title = () =>
    new HtmlElement(getPage().getByRole('heading', { name: 'Accounts Overview' }), 'Accounts Overview title');

  static readonly accountRow = (accountId: number) =>
    new HtmlElement(
      getPage().locator('#accountTable').getByRole('row').filter({ hasText: String(accountId) }),
      `Account ${accountId} row`,
    );
}
