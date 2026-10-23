import { HtmlElement } from '@core/elements/html-element';
import { getPage } from '@core/page-holder';

export class AccountActivityPage {
  static readonly transactionRow = (description: string) =>
    new HtmlElement(
      getPage()
        .getByRole('row')
        .filter({ has: getPage().getByRole('link', { name: description, exact: true }) }),
      `${description} row`,
    );
}
