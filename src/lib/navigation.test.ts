import { describe, expect, it } from 'vitest';

import type { ProductSummary } from './api';
import {
  PALETTE_PRODUCT_LIMIT,
  pageOptions,
  paletteOptions,
  wrapIndex,
} from './navigation';

function product(id: number, title: string): ProductSummary {
  return {
    id,
    title,
    price: 10,
    discountPercentage: 0,
    rating: 4,
    stock: 10,
    thumbnail: '',
    category: 'beauty',
    availabilityStatus: 'In Stock',
  };
}

const pages = pageOptions(false);

describe('pageOptions', () => {
  it('lists the header pages and every category', () => {
    const labels = pages.map((option) => option.label);
    expect(labels).toEqual(
      expect.arrayContaining(['Home', 'Deals', 'Cart', 'Sign in', 'Laptops'])
    );
    expect(pages.find((option) => option.label === 'Laptops')).toEqual({
      kind: 'category',
      to: '/category/laptops',
      label: 'Laptops',
    });
  });

  it('names the account page after the session', () => {
    const labels = pageOptions(true).map((option) => option.label);
    expect(labels).toContain('Your account');
    expect(labels).not.toContain('Sign in');
  });
});

describe('paletteOptions', () => {
  it('lists every page without a query', () => {
    expect(paletteOptions('  ', pages, [product(1, 'Phone')])).toEqual(pages);
  });

  it('puts matching pages, then products, then a search last', () => {
    const catalog = [product(1, 'iPhone 9'), product(2, 'Red Lipstick')];
    const options = paletteOptions(' phone ', pages, catalog);
    expect(options.map((option) => [option.kind, option.to])).toEqual([
      ['category', '/category/smartphones'],
      ['product', '/products/1'],
      ['search', '/products?q=phone'],
    ]);
    expect(options.at(-1)?.label).toBe('Search products for “phone”');
  });

  it('ignores case and accents and limits the products', () => {
    const catalog = Array.from({ length: 8 }, (_, i) =>
      product(i, `Crème ${i}`)
    );
    const options = paletteOptions('CREME', pages, catalog);
    expect(options.filter((option) => option.kind === 'product')).toHaveLength(
      PALETTE_PRODUCT_LIMIT
    );
  });

  it('encodes the query in the search link', () => {
    const options = paletteOptions('a&b c', pages, []);
    expect(options.at(-1)?.to).toBe('/products?q=a%26b+c');
  });
});

describe('wrapIndex', () => {
  it('moves by one and wraps at both ends', () => {
    expect(wrapIndex(0, 1, 3)).toBe(1);
    expect(wrapIndex(2, 1, 3)).toBe(0);
    expect(wrapIndex(0, -1, 3)).toBe(2);
  });
});
