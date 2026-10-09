import { beforeEach, describe, expect, it } from 'vitest';

import type { ProductSummary } from './api';
import {
  addLine,
  cart,
  cartStore,
  cartSummary,
  clampQuantity,
  removeLine,
  restoreLine,
  setLineQuantity,
} from './cart';

const mascara: ProductSummary = {
  id: 1,
  title: 'Essence Mascara Lash Princess',
  price: 9.99,
  discountPercentage: 10.48,
  rating: 2.56,
  stock: 5,
  thumbnail: '',
  category: 'beauty',
  availabilityStatus: 'Low Stock',
};
const soldOut = { ...mascara, id: 2, stock: 0 };

describe('cart lines', () => {
  it('adds a product with its discounted price', () => {
    const lines = addLine([], mascara, 2);
    expect(lines).toEqual([
      expect.objectContaining({
        id: 1,
        price: 8.94,
        listPrice: 9.99,
        quantity: 2,
      }),
    ]);
  });

  it('merges repeated adds without mutating the old state', () => {
    const first = addLine([], mascara, 1);
    const second = addLine(first, mascara, 2);
    expect(first[0].quantity).toBe(1);
    expect(second[0].quantity).toBe(3);
  });

  it('never goes above the stock or below one', () => {
    expect(addLine([], mascara, 50)[0].quantity).toBe(5);
    const lines = addLine([], mascara, 1);
    expect(setLineQuantity(lines, 1, 0)[0].quantity).toBe(1);
    expect(setLineQuantity(lines, 1, -3)[0].quantity).toBe(1);
    expect(clampQuantity(Number.NaN, 5)).toBe(1);
  });

  it('does not add sold out products', () => {
    expect(addLine([], soldOut)).toEqual([]);
  });

  it('removes and restores a line at its old position', () => {
    const lines = addLine(addLine([], mascara), { ...mascara, id: 3 });
    const removed = removeLine(lines, 1);
    expect(removed.map((l) => l.id)).toEqual([3]);
    expect(restoreLine(removed, lines[0], 0).map((l) => l.id)).toEqual([1, 3]);
    expect(restoreLine(lines, lines[0], 0)).toBe(lines);
  });

  it('sums count, subtotal and savings', () => {
    const lines = addLine([], mascara, 3);
    expect(cartSummary(lines)).toEqual({
      count: 3,
      subtotal: 26.82,
      savings: 3.15,
    });
  });
});

describe('cart store', () => {
  beforeEach(() => cart.clear());

  it('saves the cart to localStorage', () => {
    cart.add(mascara, 2);
    expect(JSON.parse(localStorage.getItem('fakeshop:cart')!)).toHaveLength(1);
    expect(cart.quantityOf(1)).toBe(2);
  });

  it('picks up changes from other tabs', () => {
    const lines = addLine([], mascara, 4);
    localStorage.setItem('fakeshop:cart', JSON.stringify(lines));
    window.dispatchEvent(new StorageEvent('storage', { key: 'fakeshop:cart' }));
    expect(cartStore.get()).toEqual(lines);
  });
});
