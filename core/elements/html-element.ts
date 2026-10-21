import type { Locator } from '@playwright/test';
import { step } from '../utils/step';

export class HtmlElement {
  constructor(
    readonly locator: Locator,
    readonly name: string,
  ) {}

  async click(): Promise<void> {
    await step(`Click ${this.name}`, () => this.locator.click());
  }
}
