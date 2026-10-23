import { HtmlElement } from '@core/elements/html-element';
import { Input } from '@core/elements/input';
import { getPage } from '@core/page-holder';
import { step } from '@core/utils/step';

export class HomePage {
  static readonly customerLoginTitle = () =>
    new HtmlElement(
      getPage().getByRole('heading', { name: 'Customer Login' }),
      'Customer Login title',
    );

  // inputs have no labels, only name attributes
  static readonly usernameInput = () =>
    new Input(getPage().locator('#loginPanel input[name="username"]'), 'Username input');

  static readonly passwordInput = () =>
    new Input(getPage().locator('#loginPanel input[name="password"]'), 'Password input');

  static readonly logInButton = () =>
    new HtmlElement(getPage().getByRole('button', { name: 'Log In' }), 'Log In button');

  static readonly loginError = (message: string) =>
    new HtmlElement(getPage().getByText(message, { exact: true }), 'Login error');

  static async open(): Promise<void> {
    await step('Open Home page', async () => {
      await getPage().goto('index.htm');
    });
  }

  static async logIn(username: string, password: string): Promise<void> {
    await step(`Log in as ${username}`, async () => {
      await HomePage.usernameInput().fill(username);
      await HomePage.passwordInput().fill(password);
      await HomePage.logInButton().click();
    });
  }
}
