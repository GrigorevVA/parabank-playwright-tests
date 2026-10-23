import { expect } from '@playwright/test';
import type { NewCustomer } from '@app/api/rest/register';
import { LeftMenu } from '@app/components/left-menu';
import { PROFILE_FIELDS } from '@app/data/register-fields';
import { UpdateProfilePage } from '@app/pages/update-profile-page';
import { Then, When } from './fixtures';

async function expectProfile(customer: NewCustomer): Promise<void> {
  for (const field of PROFILE_FIELDS) {
    await expect(
      UpdateProfilePage.field(field).locator,
      `${field} should show ${customer[field]}`,
    ).toHaveValue(customer[field]);
  }
}

When('I open my contact info', async () => {
  await LeftMenu.open('Update Contact Info');
});

When('I update my contact info', async ({ contactUpdate }) => {
  await UpdateProfilePage.updateProfile(contactUpdate);
});

// the form is filled asynchronously, so the current data is checked before any edit
Then('I see my registered contact info', async ({ newCustomer }) => {
  await expectProfile(newCustomer);
});

Then('I see the profile updated confirmation', async () => {
  await expect(
    UpdateProfilePage.profileUpdatedTitle().locator,
    'Profile Updated title should be visible',
  ).toBeVisible();
});

Then('I see my new contact info', async ({ contactUpdate }) => {
  await expectProfile(contactUpdate);
});
