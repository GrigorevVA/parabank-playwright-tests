import { HtmlElement } from '@core/elements/html-element';
import { getPage } from '@core/page-holder';

export class AccountsOverviewPage {
  static readonly title = () =>
    new HtmlElement(getPage().getByRole('heading', { name: 'Accounts Overview' }), 'Accounts Overview title');
}
