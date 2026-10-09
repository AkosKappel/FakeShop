import { describe, expect, it } from 'vitest';

import type { CartLine } from './cart';
import {
  addBusinessDays,
  findPromo,
  formatCardNumber,
  formatExpiry,
  isValidCardNumber,
  isValidCvv,
  isValidExpiry,
  orderTotals,
} from './checkout';

const line = (price: number, quantity: number): CartLine => ({
  id: price,
  title: 'Item',
  thumbnail: '',
  price,
  listPrice: price,
  stock: 10,
  quantity,
});

describe('card validation', () => {
  it('checks the Luhn checksum', () => {
    expect(isValidCardNumber('4242 4242 4242 4242')).toBe(true);
    expect(isValidCardNumber('5555555555554444')).toBe(true);
    expect(isValidCardNumber('4242 4242 4242 4241')).toBe(false);
    expect(isValidCardNumber('4242')).toBe(false);
  });

  it('accepts expiry dates from this month on', () => {
    const today = new Date(2026, 9, 9);
    expect(isValidExpiry('10/26', today)).toBe(true);
    expect(isValidExpiry('09/26', today)).toBe(false);
    expect(isValidExpiry('13/30', today)).toBe(false);
    expect(isValidExpiry('1230', today)).toBe(false);
  });

  it('checks the security code', () => {
    expect(isValidCvv('123')).toBe(true);
    expect(isValidCvv('1234')).toBe(true);
    expect(isValidCvv('12a')).toBe(false);
  });

  it('formats while typing', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatExpiry('1230')).toBe('12/30');
    expect(formatExpiry('1')).toBe('1');
  });
});

describe('orderTotals', () => {
  it('charges standard delivery below the free threshold', () => {
    expect(orderTotals([line(20, 1)], 'standard')).toMatchObject({
      subtotal: 20,
      shipping: 4.99,
      total: 24.99,
    });
  });

  it('makes standard delivery free from $50, but not express', () => {
    expect(orderTotals([line(25, 2)], 'standard').shipping).toBe(0);
    expect(orderTotals([line(25, 2)], 'express').shipping).toBe(14.99);
  });

  it('applies promo codes', () => {
    expect(orderTotals([line(25, 2)], 'standard', 'fake10')).toMatchObject({
      discount: 5,
      total: 45,
    });
    expect(orderTotals([line(10, 1)], 'express', 'FREESHIP').shipping).toBe(0);
    expect(findPromo('nope')).toBeUndefined();
  });
});

describe('addBusinessDays', () => {
  it('skips weekends', () => {
    // Friday 2026-10-09 plus 1 business day is Monday 2026-10-12.
    expect(addBusinessDays(new Date(2026, 9, 9), 1).getDate()).toBe(12);
    expect(addBusinessDays(new Date(2026, 9, 9), 5).getDate()).toBe(16);
  });
});
