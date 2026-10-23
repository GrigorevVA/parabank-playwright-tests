import { expect } from '@playwright/test';
import type { NewAccountType } from '@app/api/rest/create-account';
import { fetchAccount, openAccount } from '@app/api/rest/helpers/account-helper';
import { LeftMenu } from '@app/components/left-menu';
import { OPENING_DEPOSIT } from '@app/data/account-types';
import { AccountActivityPage } from '@app/pages/account-activity-page';
import { AccountsOverviewPage } from '@app/pages/accounts-overview-page';
import { BillPayPage } from '@app/pages/bill-pay-page';
import { OpenNewAccountPage } from '@app/pages/open-new-account-page';
import { TransferFundsPage } from '@app/pages/transfer-funds-page';
import { Given, Then, When } from './fixtures';
import './parameter-types';

Given('I have a second {accountType} account', async ({ accounts }, type: NewAccountType) => {
  const [firstAccount] = accounts;
  accounts.push(await openAccount(firstAccount.customerId, type, firstAccount.id));
});

When('I open a new {accountType} account', async ({ accounts }, type: NewAccountType) => {
  await LeftMenu.open('Open New Account');
  await OpenNewAccountPage.openAccount(type, accounts[0].id);
  const accountNumber = await OpenNewAccountPage.getNewAccountNumber();
  accounts.push(await fetchAccount(Number(accountNumber)));
});

When('I go to Accounts Overview', async () => {
  await LeftMenu.open('Accounts Overview');
});

When('I transfer ${int} to my second account', async ({ accounts }, amount: number) => {
  await LeftMenu.open('Transfer Funds');
  await TransferFundsPage.transfer(amount, accounts[0].id, accounts[1].id);
});

When('I pay a ${float} bill', async ({ accounts, payee }, amount: number) => {
  await LeftMenu.open('Bill Pay');
  await BillPayPage.payBill(payee, amount, accounts[0].id);
});

When('I open my account activity', async ({ accounts }) => {
  await LeftMenu.open('Accounts Overview');
  await AccountsOverviewPage.openAccount(String(accounts[0].id));
});

Then(
  'I see the ${float} bill payment confirmation',
  async ({ accounts, payee }, amount: number) => {
    await expect(
      BillPayPage.paymentResult().locator,
      'Payment result should name payee, amount and account',
    ).toHaveText(
      `Bill Payment to ${payee.name} in the amount of $${amount.toFixed(2)} from account ${accounts[0].id} was successful.`,
    );
  },
);

Then('I see the ${float} bill payment in the activity', async ({ payee }, amount: number) => {
  await expect(
    AccountActivityPage.transactionRow(`Bill Payment to ${payee.name}`).locator,
    'Bill payment should appear in the account activity with its amount',
  ).toContainText(`$${amount.toFixed(2)}`);
});

Then('I see the new account in the overview', async ({ accounts }) => {
  await expect(
    AccountsOverviewPage.accountRow(String(accounts[1].id)).locator,
    'New account should appear in overview with the opening deposit',
  ).toContainText(OPENING_DEPOSIT);
});

Then('I see the ${int} transfer confirmation', async ({ accounts }, amount: number) => {
  await expect(
    TransferFundsPage.transferResult().locator,
    'Transfer result should name the amount and both accounts',
  ).toHaveText(
    `$${amount.toFixed(2)} has been transferred from account #${accounts[0].id} to account #${accounts[1].id}.`,
  );
});
