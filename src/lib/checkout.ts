import { cartSummary, roundCents, type CartLine } from './cart';
import { createLocalStore } from './store';

export const FREE_SHIPPING_THRESHOLD = 50;

export const DELIVERY_METHODS = {
  standard: { label: 'Standard', days: [3, 5], price: 4.99 },
  express: { label: 'Express', days: [1, 2], price: 14.99 },
} as const;

export type DeliveryMethod = keyof typeof DELIVERY_METHODS;

export const PROMO_CODES: Record<
  string,
  { description: string; percentOff?: number; freeShipping?: boolean }
> = {
  FAKE10: { description: '10% off everything', percentOff: 10 },
  FREESHIP: { description: 'Free delivery', freeShipping: true },
};

/** The promo code applied in the cart, carried over to checkout. */
export const promoStore = createLocalStore<string | null>(
  'fakeshop:promo',
  null
);

export function findPromo(code: string) {
  const normalized = code.trim().toUpperCase();
  const promo = PROMO_CODES[normalized];
  return promo ? { code: normalized, ...promo } : undefined;
}

export function shippingCost(
  subtotal: number,
  method: DeliveryMethod,
  freeShipping = false
): number {
  if (freeShipping) return 0;
  if (method === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return DELIVERY_METHODS[method].price;
}

export function orderTotals(
  lines: CartLine[],
  method: DeliveryMethod,
  promoCode?: string
) {
  const { subtotal, savings } = cartSummary(lines);
  const promo = promoCode ? findPromo(promoCode) : undefined;
  const discount = roundCents((subtotal * (promo?.percentOff ?? 0)) / 100);
  const shipping = shippingCost(subtotal, method, promo?.freeShipping);
  return {
    subtotal,
    savings,
    discount,
    shipping,
    total: roundCents(subtotal - discount + shipping),
  };
}

export type OrderTotals = ReturnType<typeof orderTotals>;

/** Adds business days (Mon–Fri) to a date. */
export function addBusinessDays(from: Date, days: number): Date {
  const date = new Date(from);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return date;
}

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Luhn checksum, as used by real card numbers. */
export function isValidCardNumber(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length < 12 || digits.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** Accepts MM/YY for the current month or later. */
export function isValidExpiry(value: string, today = new Date()): boolean {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const thisMonth = today.getFullYear() * 12 + today.getMonth();
  return year * 12 + (month - 1) >= thisMonth;
}

export const isValidCvv = (value: string) => /^\d{3,4}$/.test(value.trim());

export function formatCardNumber(value: string): string {
  return digitsOnly(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function formatExpiry(value: string): string {
  const digits = digitsOnly(value).slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
    : digits;
}
