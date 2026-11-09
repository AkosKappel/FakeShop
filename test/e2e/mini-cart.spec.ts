import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { mockApi } from './mocks';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

const cartLink = (page: Page) => page.getByRole('link', { name: /^Cart, / });
const preview = (page: Page) =>
  page.getByRole('region', { name: 'Cart preview' });

async function addMascara(page: Page) {
  await page.goto('products/1');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(cartLink(page)).toHaveAccessibleName('Cart, 1 item');
}

test('mini cart opens on hover and after an add', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Touch has no hover');
  await addMascara(page);

  // Flashes after the add, with the sale price and the saving.
  await expect(preview(page)).toBeVisible();
  await expect(preview(page)).toContainText('Essence Mascara Lash Princess');
  await expect(preview(page)).toContainText('Qty 1');
  await expect(preview(page)).toContainText('Subtotal$8.94');
  await expect(preview(page)).toContainText('You save$1.05');
  const results = await new AxeBuilder({ page })
    .include('[popover]')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(preview(page)).toBeHidden();

  await cartLink(page).hover();
  await expect(preview(page)).toBeVisible();
  await page.mouse.move(10, 600);
  await expect(preview(page)).toBeHidden();

  await cartLink(page).hover();
  await preview(page).getByRole('link', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(preview(page)).toBeHidden();
});

test('mini cart works with the keyboard', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'Needs a keyboard');
  await addMascara(page);
  await page.keyboard.press('Escape');

  await page.getByRole('link', { name: /^Wishlist, / }).focus();
  await page.keyboard.press('Tab');
  await expect(cartLink(page)).toBeFocused();
  await expect(preview(page)).toBeVisible();

  await page.keyboard.press('Tab');
  await expect(
    preview(page).getByRole('link', { name: 'Essence Mascara Lash Princess' })
  ).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(preview(page)).toBeHidden();
  await expect(cartLink(page)).toBeFocused();
});

test('a tap on the cart goes to the cart page', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Touch only');
  await addMascara(page);
  await expect(preview(page)).toBeHidden();

  await cartLink(page).tap();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(preview(page)).toBeHidden();
});
