import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

import { mockApi } from './mocks';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}

const cartLink = (page: Page) => page.getByRole('link', { name: /^Cart, / });

test('home page shows the hero, departments and deals', async ({ page }) => {
  await page.goto('./');
  await expect(
    page.getByRole('heading', { level: 1, name: /Nothing you pay for/ })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Shop by department' })
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: "Today's deals" })
  ).toBeVisible();
  await expect(page).toHaveTitle('FakeShop – a demo online store');
  await expectNoA11yViolations(page);
});

test('search from the header keeps the query in the URL', async ({ page }) => {
  await page.goto('./');
  const search = page.getByRole('combobox', { name: 'Search products' });
  await search.fill('mascara');
  await search.press('Enter');
  await expect(page).toHaveURL(/\/products\?q=mascara$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Results for “mascara”'
  );
  await expect(
    page.getByRole('link', { name: 'Essence Mascara Lash Princess' })
  ).toBeVisible();
  await expect(search).toHaveValue('mascara');
});

test('filters and sorting live in the URL and can be cleared', async ({
  page,
}, testInfo) => {
  await page.goto('category/smartphones?sort=price-asc');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Smartphones'
  );
  const count = page.getByText(/^\d+ products?$/);
  const all = Number((await count.textContent())?.split(' ')[0]);

  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Filters' }).click();
  }
  // The checkbox follows the URL, so check the URL rather than using check().
  await page.getByRole('checkbox', { name: 'On sale' }).click();
  await expect(page).toHaveURL(/sale=1/);
  await expect(page.getByRole('checkbox', { name: 'On sale' })).toBeChecked();
  await expect(page).toHaveURL(/sort=price-asc/);
  const onSale = Number((await count.textContent())?.split(' ')[0]);
  expect(onSale).toBeLessThan(all);
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: /^Show \d+ products?$/ }).click();
  }

  await page.getByRole('button', { name: 'Remove filter On sale' }).click();
  await expect(count).toHaveText(`${all} products`);
  await expectNoA11yViolations(page);
});

test('an unknown product shows a not found page', async ({ page }) => {
  await page.goto('products/9999');
  await expect(
    page.getByRole('heading', { name: 'This product does not exist' })
  ).toBeVisible();
});

test('add to cart, change quantity, remove and undo', async ({ page }) => {
  await page.goto('products/1');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Essence Mascara Lash Princess',
    })
  ).toBeVisible();
  await expectNoA11yViolations(page);

  await page.getByRole('button', { name: 'Increase quantity' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByRole('status')).toContainText('added to your cart');
  await expect(cartLink(page)).toHaveAccessibleName('Cart, 2 items');

  await page
    .getByRole('status')
    .getByRole('link', { name: 'View cart' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Your cart'
  );
  // 9.99 with 10.48% off is 8.94; two of them are 17.88.
  await expect(page.getByText('$17.88').first()).toBeVisible();

  await page.getByRole('button', { name: 'Increase quantity' }).click();
  await expect(cartLink(page)).toHaveAccessibleName('Cart, 3 items');

  await page.getByRole('button', { name: /^Remove Essence Mascara/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Your cart is empty' })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Undo' }).click();
  await expect(cartLink(page)).toHaveAccessibleName('Cart, 3 items');
});

test('out of stock products cannot be added', async ({ page }) => {
  await page.goto('products/117');
  await expect(
    page.getByRole('button', { name: 'Out of stock' })
  ).toBeDisabled();
});

test('promo code changes the total', async ({ page }) => {
  await page.goto('products/2');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.goto('cart');
  await page.getByLabel('Promo code').fill('nope');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText('This code is not valid')).toBeVisible();
  await page.getByLabel('Promo code').fill('fake10');
  await page.getByRole('button', { name: 'Apply' }).click();
  await expect(page.getByText('Promo code FAKE10')).toBeVisible();
  await expectNoA11yViolations(page);
});

test('checkout validates, places the order and never stores the card', async ({
  page,
}) => {
  await page.goto('checkout');
  await expect(
    page.getByRole('heading', { name: 'Your cart is empty' })
  ).toBeVisible();

  await page.goto('products/1');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.goto('checkout');
  await expectNoA11yViolations(page);

  await page.getByRole('button', { name: /^Place order/ }).click();
  await expect(page.getByText('Enter your email')).toBeVisible();
  await expect(page.getByLabel('Email')).toBeFocused();

  await page.getByLabel('Email').fill('ada@example.com');
  await page.getByLabel('Full name').fill('Ada Lovelace');
  await page.getByLabel('Street address').fill('12 Analytical Street');
  await page.getByLabel('City').fill('London');
  await page.getByLabel('Postal code').fill('NW1 6XE');
  await page.getByLabel('Country').selectOption('GB');
  await page.getByText('Express').click();

  await page.getByLabel('Card number').fill('4242 4242 4242 4241');
  await page.getByLabel('Card number').blur();
  await expect(page.getByText('This card number is not valid')).toBeVisible();
  await page.getByRole('button', { name: 'Fill it in' }).click();
  await expect(page.getByLabel('Card number')).toHaveValue(
    '4242 4242 4242 4242'
  );

  await page.getByRole('button', { name: /^Place order/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Thank you, Ada!' })
  ).toBeVisible();
  await expect(page).toHaveURL(/\/orders\/FS-/);
  await expect(page.getByText('•••• 4242')).toBeVisible();
  await expect(cartLink(page)).toHaveAccessibleName('Cart, 0 items');

  const storage = await page.evaluate(() =>
    JSON.stringify({ ...localStorage })
  );
  expect(storage).not.toContain('4242 4242');
  expect(storage).not.toContain('4242424242424242');

  await page.goto('orders');
  await expect(page.getByText(/^FS-/)).toBeVisible();
});

test('wishlist saves products', async ({ page }) => {
  await page.goto('products/1');
  await page
    .getByRole('button', {
      name: 'Save Essence Mascara Lash Princess to wishlist',
    })
    .click();
  await page.goto('wishlist');
  await expect(
    page.getByRole('link', { name: 'Essence Mascara Lash Princess' })
  ).toBeVisible();
});

test('compare products side by side', async ({ page }) => {
  for (const id of [1, 2]) {
    await page.goto(`products/${id}`);
    await page.getByRole('button', { name: /^Compare / }).click();
    await expect(
      page.getByRole('button', { name: /^Compare / })
    ).toHaveAttribute('aria-pressed', 'true');
  }
  await page.goto('compare');
  await expect(page.getByRole('columnheader')).toHaveCount(2);
  await expect(page.getByRole('rowheader', { name: 'Price' })).toBeVisible();
  await expectNoA11yViolations(page);
  await page.getByRole('button', { name: /^Remove Essence Mascara/ }).click();
  await expect(page.getByRole('columnheader')).toHaveCount(1);
});

test('demo sign-in fills the checkout and keeps no sensitive data', async ({
  page,
}) => {
  await page.goto('account');
  await page.getByLabel('Username').fill('emilys');
  await page.getByLabel('Password', { exact: true }).fill('wrong');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'Wrong username or password'
  );

  await page.getByRole('button', { name: 'Use the demo account' }).click();
  await expect(page.getByRole('heading', { name: 'Hi, Emily' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Account of Emily' })
  ).toBeVisible();
  await expectNoA11yViolations(page);

  const storage = await page.evaluate(() =>
    JSON.stringify({ ...localStorage })
  );
  expect(storage).not.toContain('900-590-289');
  expect(storage).not.toContain('emilyspass');

  await page.goto('products/1');
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.goto('checkout');
  await expect(page.getByLabel('Email')).toHaveValue(
    'emily.johnson@x.dummyjson.com'
  );
  await expect(page.getByLabel('Country')).toHaveValue('US');

  await page.goto('account');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(
    page.getByRole('button', { name: 'Use the demo account' })
  ).toBeVisible();
});

test('an expired session signs out', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() =>
    localStorage.setItem(
      'fakeshop:session',
      JSON.stringify({ accessToken: 'old', user: { firstName: 'Emily' } })
    )
  );
  await page.goto('account');
  await expect(page.getByText('Your session has expired')).toBeVisible();
});

test('cart stays in sync across tabs', async ({ page, context }) => {
  await page.goto('cart');
  const other = await context.newPage();
  await mockApi(other);
  await other.goto('products/1');
  await other.getByRole('button', { name: 'Add to cart' }).click();
  await expect(cartLink(page)).toHaveAccessibleName('Cart, 1 item');
  await expect(
    page.getByRole('link', { name: 'Essence Mascara Lash Princess' })
  ).toBeVisible();
});

test('theme choice survives a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('about');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expectNoA11yViolations(page);
});

test('mobile menu opens and navigates', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile',
    'The menu button is mobile only'
  );
  await page.goto('./');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await menu.getByRole('link', { name: 'Laptops' }).click();
  await expect(menu).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Laptops');
});
