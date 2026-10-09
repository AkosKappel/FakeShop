import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

const fixtures = fileURLToPath(new URL('./fixtures/', import.meta.url));

// 1×1 transparent PNG, so tests never download product photos.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

const TOKEN = 'test-token';

// Shaped like DummyJSON's /auth/me, including fields the app must not keep.
const DEMO_USER = {
  id: 1,
  username: 'emilys',
  firstName: 'Emily',
  lastName: 'Johnson',
  email: 'emily.johnson@x.dummyjson.com',
  image: 'https://dummyjson.com/icon/emilys/128',
  ssn: '900-590-289',
  password: 'emilyspass',
  address: {
    address: '626 Main Street',
    city: 'Phoenix',
    postalCode: '29112',
    country: 'United States',
  },
};

/** Serves the DummyJSON API and its images from local fixtures. */
export async function mockApi(page: Page) {
  await page.route('https://cdn.dummyjson.com/**', (route) =>
    route.fulfill({ contentType: 'image/png', body: PIXEL })
  );
  await page.route('https://dummyjson.com/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === '/auth/login') {
      const { username, password } = route.request().postDataJSON();
      return username === 'emilys' && password === 'emilyspass'
        ? route.fulfill({ json: { accessToken: TOKEN, id: 1, username } })
        : route.fulfill({
            status: 400,
            json: { message: 'Invalid credentials' },
          });
    }
    if (url.pathname === '/auth/me') {
      const authorized =
        route.request().headers().authorization === `Bearer ${TOKEN}`;
      return authorized
        ? route.fulfill({ json: DEMO_USER })
        : route.fulfill({ status: 401, json: { message: 'Token Expired!' } });
    }
    if (url.pathname === '/products') {
      return route.fulfill({ path: `${fixtures}catalog.json` });
    }
    const product = /^\/products\/(\d+)$/.exec(url.pathname);
    const file = product && `${fixtures}products/${product[1]}.json`;
    if (file && existsSync(file)) return route.fulfill({ path: file });
    return route.fulfill({ status: 404, json: { message: 'Not found' } });
  });
}

export const catalog: {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  stock: number;
  category: string;
}[] = JSON.parse(readFileSync(`${fixtures}catalog.json`, 'utf8')).products;
