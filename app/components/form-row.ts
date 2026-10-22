import type { Locator, Page } from '@playwright/test';
import { getPage } from '@core/page-holder';

// ParaBank forms are tables: the label sits in a neighbour cell, so a field is found by its row
export const formRow = (label: string, root: Page | Locator = getPage()): Locator =>
  root.getByRole('row').filter({ hasText: label });
