import { HtmlElement } from '@core/elements/html-element';
import { Input } from '@core/elements/input';
import { Select } from '@core/elements/select';
import { getPage } from '@core/page-holder';
import { step } from '@core/utils/step';
import type { Payee } from '../api/rest/bill-pay';
import { formRow } from '../components/form-row';

export class BillPayPage {
  static readonly payeeNameInput = () => new Input(formRow('Payee Name:').locator('input'), 'Payee Name input');

  static readonly addressInput = () => new Input(formRow('Address:').locator('input'), 'Address input');

  static readonly cityInput = () => new Input(formRow('City:').locator('input'), 'City input');

  static readonly stateInput = () => new Input(formRow('State:').locator('input'), 'State input');

  static readonly zipCodeInput = () => new Input(formRow('Zip Code:').locator('input'), 'Zip Code input');

  static readonly phoneInput = () => new Input(formRow('Phone #:').locator('input'), 'Phone input');

  // "Account #:" is also part of "Verify Account #:"
  static readonly accountInput = () =>
    new Input(formRow('Account #:').filter({ hasNotText: 'Verify' }).locator('input'), 'Account input');

  static readonly verifyAccountInput = () =>
    new Input(formRow('Verify Account #:').locator('input'), 'Verify Account input');

  static readonly amountInput = () => new Input(formRow('Amount:').locator('input'), 'Amount input');

  static readonly fromAccountSelect = () =>
    new Select(formRow('From account #:').getByRole('combobox'), 'From account select');

  static readonly sendPaymentButton = () =>
    new HtmlElement(getPage().getByRole('button', { name: 'Send Payment' }), 'Send Payment button');

  static readonly paymentResult = () =>
    new HtmlElement(
      getPage().getByRole('paragraph').filter({ hasText: 'was successful' }),
      'Payment result',
    );

  static async payBill(payee: Payee, amount: number, fromAccountId: number): Promise<void> {
    await step(`Pay $${amount} to ${payee.name} from account ${fromAccountId}`, async () => {
      await BillPayPage.payeeNameInput().fill(payee.name);
      await BillPayPage.addressInput().fill(payee.address.street);
      await BillPayPage.cityInput().fill(payee.address.city);
      await BillPayPage.stateInput().fill(payee.address.state);
      await BillPayPage.zipCodeInput().fill(payee.address.zipCode);
      await BillPayPage.phoneInput().fill(payee.phoneNumber);
      await BillPayPage.accountInput().fill(String(payee.accountNumber));
      await BillPayPage.verifyAccountInput().fill(String(payee.accountNumber));
      await BillPayPage.amountInput().fill(String(amount));
      await BillPayPage.fromAccountSelect().select(String(fromAccountId));
      await BillPayPage.sendPaymentButton().click();
    });
  }
}
