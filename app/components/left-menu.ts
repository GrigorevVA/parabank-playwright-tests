import { HtmlElement } from '@core/elements/html-element';
import { getPage } from '@core/page-holder';
import { step } from '@core/utils/step';

export type AccountServicesItem =
  | 'Open New Account'
  | 'Accounts Overview'
  | 'Transfer Funds'
  | 'Bill Pay'
  | 'Find Transactions'
  | 'Update Contact Info'
  | 'Request Loan'
  | 'Log Out';

export class LeftMenu {
  static readonly link = (item: AccountServicesItem) =>
    new HtmlElement(getPage().getByRole('link', { name: item, exact: true }), `${item} link`);

  static async open(item: AccountServicesItem): Promise<void> {
    await step(`Open ${item} page`, () => LeftMenu.link(item).click());
  }

  static async logOut(): Promise<void> {
    await step('Log out', () => LeftMenu.link('Log Out').click());
  }
}
