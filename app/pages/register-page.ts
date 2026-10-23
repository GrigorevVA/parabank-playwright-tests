import { HtmlElement } from '@core/elements/html-element';
import { Input } from '@core/elements/input';
import { getPage } from '@core/page-holder';
import { step } from '@core/utils/step';
import type { NewCustomer } from '../api/rest/register';
import { formRow } from '../components/form-row';
import {
  REGISTER_FIELD_LABELS,
  REGISTER_SUCCESS_MESSAGE,
  type RegisterField,
} from '../data/register-fields';

const registerFormRow = (label: string) => formRow(label, getPage().locator('#customerForm'));

export class RegisterPage {
  static readonly field = (field: RegisterField) =>
    new Input(registerFormRow(REGISTER_FIELD_LABELS[field]).locator('input'), `${field} input`);

  static readonly confirmInput = () =>
    new Input(registerFormRow('Confirm:').locator('input'), 'Confirm input');

  static readonly fieldError = (field: RegisterField, message: string) =>
    new HtmlElement(
      registerFormRow(REGISTER_FIELD_LABELS[field]).getByText(message),
      `${field} error`,
    );

  static readonly confirmError = (message: string) =>
    new HtmlElement(registerFormRow('Confirm:').getByText(message), 'Confirm error');

  static readonly registerButton = () =>
    new HtmlElement(getPage().getByRole('button', { name: 'Register' }), 'Register button');

  static readonly welcomeTitle = (username: string) =>
    new HtmlElement(
      getPage().getByRole('heading', { name: `Welcome ${username}` }),
      'Welcome title',
    );

  static readonly successMessage = () =>
    new HtmlElement(getPage().getByText(REGISTER_SUCCESS_MESSAGE), 'Success message');

  static async open(): Promise<void> {
    await step('Open Register page', async () => {
      await getPage().goto('register.htm');
    });
  }

  static async register(customer: NewCustomer, confirmation = customer.password): Promise<void> {
    await step(`Register customer ${customer.username}`, async () => {
      for (const field of Object.keys(REGISTER_FIELD_LABELS) as RegisterField[]) {
        await RegisterPage.field(field).fill(customer[field]);
      }
      await RegisterPage.confirmInput().fill(confirmation);
      await RegisterPage.registerButton().click();
    });
  }
}
