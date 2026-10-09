import { describe, expect, it } from 'vitest';

import type { ProductSummary } from './api';
import {
  applyFilters,
  brandsOf,
  categoryName,
  finalPrice,
  isOnSale,
  matchesQuery,
  paginate,
  parseFilters,
  sortProducts,
} from './catalog';

function product(overrides: Partial<ProductSummary>): ProductSummary {
  return {
    id: 1,
    title: 'Product',
    price: 10,
    discountPercentage: 0,
    rating: 4,
    stock: 10,
    thumbnail: '',
    category: 'beauty',
    availabilityStatus: 'In Stock',
    ...overrides,
  };
}

describe('prices', () => {
  it('applies discounts of 10% and more, rounded to cents', () => {
    const mascara = { price: 9.99, discountPercentage: 10.48 };
    expect(isOnSale(mascara)).toBe(true);
    expect(finalPrice(mascara)).toBe(8.94);
  });

  it('ignores small discounts', () => {
    const item = { price: 20, discountPercentage: 4.5 };
    expect(isOnSale(item)).toBe(false);
    expect(finalPrice(item)).toBe(20);
  });
});

describe('categoryName', () => {
  it('uses proper names and falls back to title case', () => {
    expect(categoryName('womens-jewellery')).toBe("Women's Jewellery");
    expect(categoryName('home-decoration')).toBe('Home Decoration');
    expect(categoryName('new-thing')).toBe('New Thing');
  });
});

describe('parseFilters', () => {
  it('reads every filter from the URL', () => {
    const filters = parseFilters(
      new URLSearchParams(
        'q=phone&brand=Apple&brand=Samsung&min=10&max=500&rating=4&stock=1&sale=1&sort=price-desc&page=2'
      )
    );
    expect(filters).toEqual({
      q: 'phone',
      brands: ['Apple', 'Samsung'],
      minPrice: 10,
      maxPrice: 500,
      minRating: 4,
      inStock: true,
      onSale: true,
      sort: 'price-desc',
      page: 2,
    });
  });

  it('ignores invalid values', () => {
    const filters = parseFilters(
      new URLSearchParams('min=abc&max=-5&sort=random&page=0')
    );
    expect(filters.minPrice).toBeUndefined();
    expect(filters.maxPrice).toBeUndefined();
    expect(filters.sort).toBe('featured');
    expect(filters.page).toBe(1);
  });
});

describe('search and filters', () => {
  const phone = product({
    id: 1,
    title: 'iPhone 9',
    brand: 'Apple',
    category: 'smartphones',
    price: 549,
    rating: 4.7,
  });
  const case_ = product({
    id: 2,
    title: 'Café Case',
    brand: 'Generic',
    category: 'mobile-accessories',
    price: 12,
    discountPercentage: 15,
    rating: 3.2,
  });
  const laptop = product({
    id: 3,
    title: 'MacBook Pro',
    brand: 'Apple',
    category: 'laptops',
    price: 1999,
    stock: 0,
    rating: 4.1,
  });
  const all = [phone, case_, laptop];

  it('matches every word in title, brand or category, ignoring accents and case', () => {
    expect(matchesQuery(phone, 'apple iphone')).toBe(true);
    expect(matchesQuery(case_, 'cafe')).toBe(true);
    expect(matchesQuery(case_, 'mobile accessories')).toBe(true);
    expect(matchesQuery(phone, 'apple laptop')).toBe(false);
  });

  it('combines filters', () => {
    const base = parseFilters(new URLSearchParams());
    expect(applyFilters(all, { ...base, brands: ['Apple'] })).toEqual([
      phone,
      laptop,
    ]);
    expect(applyFilters(all, { ...base, inStock: true })).toEqual([
      phone,
      case_,
    ]);
    expect(applyFilters(all, { ...base, onSale: true })).toEqual([case_]);
    expect(applyFilters(all, { ...base, minRating: 4.5 })).toEqual([phone]);
    // The price filter uses the price after discount: 12 with 15% off is 10.20.
    expect(applyFilters(all, { ...base, maxPrice: 10.2 })).toEqual([case_]);
  });

  it('sorts by price after discount without changing the input', () => {
    expect(sortProducts(all, 'price-asc').map((p) => p.id)).toEqual([2, 1, 3]);
    expect(sortProducts(all, 'rating').map((p) => p.id)).toEqual([1, 3, 2]);
    expect(all.map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('lists brands by how often they appear', () => {
    expect(brandsOf(all)).toEqual(['Apple', 'Generic']);
  });
});

describe('paginate', () => {
  const items = Array.from({ length: 50 }, (_, i) => i);

  it('returns the requested page', () => {
    expect(paginate(items, 2, 24)).toEqual({
      items: items.slice(24, 48),
      page: 2,
      pageCount: 3,
    });
  });

  it('clamps pages past the end', () => {
    expect(paginate(items, 9, 24).page).toBe(3);
    expect(paginate([], 1, 24)).toEqual({ items: [], page: 1, pageCount: 1 });
  });
});
