import { HtmlElement } from '@core/elements/html-element';
import { Input } from '@core/elements/input';
import { getPage } from '@core/page-holder';
import { step } from '@core/utils/step';
import type { NewCustomer } from '../api/rest/register';
import { formRow } from '../components/form-row';
import { PROFILE_FIELDS, REGISTER_FIELD_LABELS, type RegisterField } from '../data/register-fields';

export class UpdateProfilePage {
  static readonly field = (field: RegisterField) =>
    new Input(formRow(REGISTER_FIELD_LABELS[field]).locator('input'), `${field} input`);

  static readonly updateProfileButton = () =>
    new HtmlElement(
      getPage().getByRole('button', { name: 'Update Profile' }),
      'Update Profile button',
    );

  static readonly profileUpdatedTitle = () =>
    new HtmlElement(
      getPage().getByRole('heading', { name: 'Profile Updated' }),
      'Profile Updated title',
    );

  static async updateProfile(customer: NewCustomer): Promise<void> {
    await step(`Update profile to ${customer.firstName} ${customer.lastName}`, async () => {
      for (const field of PROFILE_FIELDS) {
        await UpdateProfilePage.field(field).fill(customer[field]);
      }
      await UpdateProfilePage.updateProfileButton().click();
    });
  }
}
