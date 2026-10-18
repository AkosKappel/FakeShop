import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { mockApi } from './mocks';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

async function openPalette(page: Page) {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('ControlOrMeta+K');
  const dialog = page.getByRole('dialog', { name: 'Quick find' });
  await expect(dialog).toBeVisible();
  const input = dialog.getByRole('combobox', { name: 'Page or product' });
  await expect(input).toBeFocused();
  return { dialog, input };
}

test('quick find opens a product with the keyboard', async ({ page }) => {
  const { dialog, input } = await openPalette(page);
  await expect(dialog.getByRole('option', { name: 'Deals' })).toBeVisible();

  await input.fill('mascara');
  const product = dialog.getByRole('option', {
    name: /Essence Mascara Lash Princess/,
  });
  const search = dialog.getByRole('option', {
    name: 'Search products for “mascara”',
  });
  await expect(product).toHaveAttribute('aria-selected', 'true');
  await expect(dialog.getByRole('option', { name: 'Deals' })).toHaveCount(0);

  const results = await new AxeBuilder({ page })
    .include('dialog')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

  // Up from the first option wraps to the search, down wraps back.
  await input.press('ArrowUp');
  await expect(search).toHaveAttribute('aria-selected', 'true');
  await expect(input).toHaveAttribute(
    'aria-activedescendant',
    (await search.getAttribute('id'))!
  );
  await input.press('ArrowDown');
  await expect(product).toHaveAttribute('aria-selected', 'true');

  await input.press('Enter');
  await expect(page).toHaveURL(/\/products\/1$/);
  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Essence Mascara Lash Princess',
    })
  ).toBeVisible();
});

test('quick find searches for the query', async ({ page }) => {
  const { input } = await openPalette(page);
  await input.fill('mascara');
  await input.press('ArrowUp');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/products\?q=mascara$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Results for “mascara”'
  );
});

test('quick find closes with Escape and the shortcut', async ({ page }) => {
  const { dialog, input } = await openPalette(page);
  await input.press('Escape');
  await expect(dialog).toBeHidden();

  await page.keyboard.press('ControlOrMeta+K');
  await expect(dialog).toBeVisible();
  await expect(input).toHaveValue('');
  await page.keyboard.press('ControlOrMeta+K');
  await expect(dialog).toBeHidden();
});

test('quick find opens a page with a click', async ({ page }) => {
  const { dialog, input } = await openPalette(page);
  await input.fill('laptops');
  await dialog.getByRole('option', { name: /Laptops/ }).click();
  await expect(page).toHaveURL(/\/category\/laptops$/);
  await expect(dialog).toBeHidden();
});
