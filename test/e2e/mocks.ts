import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Page } from '@playwright/test';

const fixtures = fileURLToPath(new URL('./fixtures/', import.meta.url));

// 1×1 transparent PNG, so tests never download product photos.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

/** Serves the DummyJSON API and its images from local fixtures. */
export async function mockApi(page: Page) {
  await page.route('https://cdn.dummyjson.com/**', (route) =>
    route.fulfill({ contentType: 'image/png', body: PIXEL })
  );
  await page.route('https://dummyjson.com/**', (route) => {
    const url = new URL(route.request().url());
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
