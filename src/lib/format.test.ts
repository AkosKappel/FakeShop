import { describe, expect, it } from 'vitest';

import { flagEmoji, formatPrice, pluralize } from './format';

describe('format', () => {
  it('turns a region code into a flag emoji', () => {
    expect(flagEmoji('GB')).toBe('🇬🇧');
    expect(flagEmoji('sk')).toBe('🇸🇰');
  });

  it('formats prices, including zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(1299.5)).toBe('$1,299.50');
  });

  it('pluralizes', () => {
    expect(pluralize(1, 'item', 'items')).toBe('1 item');
    expect(pluralize(3, 'item', 'items')).toBe('3 items');
  });
});
