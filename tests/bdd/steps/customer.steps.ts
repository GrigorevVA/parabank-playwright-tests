import { expect } from '@playwright/test';
import { fetchCustomerAccounts } from '@app/api/rest/helpers/account-helper';
import { registerCustomer } from '@app/api/rest/helpers/customer-helper';
import { LeftMenu } from '@app/components/left-menu';
import { WRONG_PASSWORD } from '@app/data/negative-data';
import type { RegisterField } from '@app/data/register-fields';
import { AccountsOverviewPage } from '@app/pages/accounts-overview-page';
import { HomePage } from '@app/pages/home-page';
import { RegisterPage } from '@app/pages/register-page';
import { Given, Then, When } from './fixtures';
import './parameter-types';
import type { PasswordKind } from './parameter-types';

Given('a registered customer', async ({ newCustomer, accounts }) => {
  const customer = await registerCustomer(newCustomer);
  accounts.push(...(await fetchCustomerAccounts(customer.id)));
});

Given('I am logged in', async ({ newCustomer }) => {
  await HomePage.open();
  await HomePage.logIn(newCustomer.username, newCustomer.password);
});

Given('I am on the Home page', async () => {
  await HomePage.open();
});

Given('I am on the Register page', async () => {
  await RegisterPage.open();
});

When('I log in with a {passwordKind} password', async ({ newCustomer }, kind: PasswordKind) => {
  const password = kind === 'valid' ? newCustomer.password : WRONG_PASSWORD;
  await HomePage.logIn(newCustomer.username, password);
});

When('I log out', async () => {
  await LeftMenu.logOut();
});

When('I register as a new customer', async ({ newCustomer }) => {
  await RegisterPage.register(newCustomer);
});

When('I register as a new customer with a mismatched password confirmation', async ({ newCustomer }) => {
  await RegisterPage.register(newCustomer, WRONG_PASSWORD);
});

When(
  'I register as a new customer without {registerField}',
  async ({ newCustomer }, field: RegisterField) => {
    await RegisterPage.register({ ...newCustomer, [field]: '' });
  },
);

Then('I see the Accounts Overview page', async () => {
  await expect(
    AccountsOverviewPage.title().locator,
    'Accounts Overview title should be visible',
  ).toBeVisible();
});

Then('I see the login error {string}', async ({}, message: string) => {
  await expect(HomePage.loginError(message).locator, 'Login error should be shown').toBeVisible();
});

Then('I see the Customer Login form', async () => {
  await expect(
    HomePage.customerLoginTitle().locator,
    'Customer Login title should be visible',
  ).toBeVisible();
});

Then('I see the welcome message for the new customer', async ({ newCustomer }) => {
  await expect(
    RegisterPage.welcomeTitle(newCustomer.username).locator,
    'Welcome title should name the new customer',
  ).toBeVisible();
  await expect(RegisterPage.successMessage().locator, 'Success message should be shown').toBeVisible();
});

Then('I see the {string} error under password confirmation', async ({}, message: string) => {
  await expect(RegisterPage.confirmError(message).locator, 'Confirm error should be shown').toBeVisible();
});

Then(
  'I see the {string} error under {registerField}',
  async ({}, message: string, field: RegisterField) => {
    await expect(
      RegisterPage.fieldError(field, message).locator,
      `${field} error should be shown`,
    ).toBeVisible();
  },
);
