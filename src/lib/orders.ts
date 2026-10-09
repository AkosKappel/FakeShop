import type { CartLine } from './cart';
import {
  DELIVERY_METHODS,
  addBusinessDays,
  type DeliveryMethod,
  type OrderTotals,
} from './checkout';
import { formatShortDate } from './format';
import { createLocalStore, useStore } from './store';

export interface ShippingAddress {
  email: string;
  fullName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  number: string;
  placedAt: string;
  lines: CartLine[];
  totals: OrderTotals;
  promoCode?: string;
  delivery: DeliveryMethod;
  shipping: ShippingAddress;
  /** Only the last four digits are ever stored. */
  cardLast4: string;
}

export const ordersStore = createLocalStore<Order[]>('fakeshop:orders', []);

// The address (never payment details) is remembered to prefill the next checkout.
export const addressStore = createLocalStore<ShippingAddress | null>(
  'fakeshop:address',
  null
);

export function useOrders() {
  return useStore(ordersStore);
}

export function newOrderNumber(now = Date.now()): string {
  return `FS-${now.toString(36).toUpperCase()}`;
}

export function saveOrder(order: Order) {
  ordersStore.set((orders) => [order, ...orders]);
}

export function deliveryWindow(order: Order): string {
  const placed = new Date(order.placedAt);
  const [from, to] = DELIVERY_METHODS[order.delivery].days.map((days) =>
    formatShortDate(addBusinessDays(placed, days))
  );
  return `${from} – ${to}`;
}
