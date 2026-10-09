import type { ProductSummary } from './api';
import { finalPrice } from './catalog';
import { createLocalStore, useStore } from './store';
import { toast } from './toast';

export const MAX_QUANTITY = 99;

export interface CartLine {
  id: number;
  title: string;
  thumbnail: string;
  /** Unit price after discount, fixed when the item was added. */
  price: number;
  /** Unit price before discount. */
  listPrice: number;
  stock: number;
  quantity: number;
}

export function maxQuantity(stock: number): number {
  return Math.max(0, Math.min(stock, MAX_QUANTITY));
}

export function clampQuantity(quantity: number, stock: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(Math.max(Math.floor(quantity), 1), maxQuantity(stock));
}

export function addLine(
  lines: CartLine[],
  product: ProductSummary,
  quantity = 1
): CartLine[] {
  const existing = lines.find((line) => line.id === product.id);
  if (existing) {
    return setLineQuantity(lines, product.id, existing.quantity + quantity);
  }
  if (product.stock <= 0) return lines;
  return [
    ...lines,
    {
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: finalPrice(product),
      listPrice: product.price,
      stock: product.stock,
      quantity: clampQuantity(quantity, product.stock),
    },
  ];
}

export function setLineQuantity(
  lines: CartLine[],
  id: number,
  quantity: number
): CartLine[] {
  return lines.map((line) =>
    line.id === id
      ? { ...line, quantity: clampQuantity(quantity, line.stock) }
      : line
  );
}

export function removeLine(lines: CartLine[], id: number): CartLine[] {
  return lines.filter((line) => line.id !== id);
}

/** Puts a removed line back at its old position (undo). */
export function restoreLine(
  lines: CartLine[],
  line: CartLine,
  index: number
): CartLine[] {
  if (lines.some((existing) => existing.id === line.id)) return lines;
  return [...lines.slice(0, index), line, ...lines.slice(index)];
}

export function cartSummary(lines: CartLine[]) {
  let count = 0;
  let subtotal = 0;
  let listTotal = 0;
  for (const line of lines) {
    count += line.quantity;
    subtotal += line.price * line.quantity;
    listTotal += line.listPrice * line.quantity;
  }
  return {
    count,
    subtotal: roundCents(subtotal),
    savings: roundCents(listTotal - subtotal),
  };
}

export function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export const cartStore = createLocalStore<CartLine[]>('fakeshop:cart', []);

export function useCart() {
  const lines = useStore(cartStore);
  return { lines, ...cartSummary(lines) };
}

export const cart = {
  add: (product: ProductSummary, quantity = 1) =>
    cartStore.set((lines) => addLine(lines, product, quantity)),
  setQuantity: (id: number, quantity: number) =>
    cartStore.set((lines) => setLineQuantity(lines, id, quantity)),
  remove: (id: number) => cartStore.set((lines) => removeLine(lines, id)),
  restore: (line: CartLine, index: number) =>
    cartStore.set((lines) => restoreLine(lines, line, index)),
  clear: () => cartStore.set([]),
  quantityOf: (id: number) =>
    cartStore.get().find((line) => line.id === id)?.quantity ?? 0,
};

export function addToCartWithToast(product: ProductSummary, quantity = 1) {
  if (cart.quantityOf(product.id) >= maxQuantity(product.stock)) {
    toast(`You already have all available ${product.title} in your cart`, {
      label: 'View cart',
      to: '/cart',
    });
    return;
  }
  cart.add(product, quantity);
  toast(`${product.title} added to your cart`, {
    label: 'View cart',
    to: '/cart',
  });
}
