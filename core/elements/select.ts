import { step } from '../utils/step';
import { HtmlElement } from './html-element';

export class Select extends HtmlElement {
  async select(option: string): Promise<void> {
    await step(`Select ${option} in ${this.name}`, async () => {
      await this.locator.selectOption(option);
    });
  }
}
