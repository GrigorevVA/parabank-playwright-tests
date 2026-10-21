import { step } from '../utils/step';
import { HtmlElement } from './html-element';

export class Input extends HtmlElement {
  async fill(value: string): Promise<void> {
    await step(`Fill ${this.name}`, () => this.locator.fill(value));
  }
}
