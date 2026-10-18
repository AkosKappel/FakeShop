import type { ProductSummary } from './api';
import {
  CATEGORY_GROUPS,
  categoryName,
  matchesQuery,
  matchesText,
} from './catalog';

export const NAV_LINKS = [
  { to: '/products', label: 'All products' },
  { to: '/products?sale=1&sort=discount', label: 'Deals' },
  { to: '/products?sort=rating', label: 'Top rated' },
  { to: '/about', label: 'About' },
];

export interface PaletteOption {
  kind: 'page' | 'category' | 'product' | 'search';
  to: string;
  label: string;
  product?: ProductSummary;
}

export const PALETTE_PRODUCT_LIMIT = 5;

/** The pages and categories the header links to, as quick find entries. */
export function pageOptions(signedIn: boolean): PaletteOption[] {
  const pages = [
    { to: '/', label: 'Home' },
    ...NAV_LINKS,
    { to: '/categories', label: 'All categories' },
    { to: '/wishlist', label: 'Wishlist' },
    { to: '/cart', label: 'Cart' },
    { to: '/compare', label: 'Compare' },
    { to: '/orders', label: 'Your orders' },
    { to: '/account', label: signedIn ? 'Your account' : 'Sign in' },
  ];
  return [
    ...pages.map((page) => ({ kind: 'page' as const, ...page })),
    ...CATEGORY_GROUPS.flatMap((group) =>
      group.categories.map((slug) => ({
        kind: 'category' as const,
        to: `/category/${slug}`,
        label: categoryName(slug),
      }))
    ),
  ];
}

/**
 * Matching pages, then the first few matching products, then a search for
 * the query. Without a query it lists every page.
 */
export function paletteOptions(
  query: string,
  pages: PaletteOption[],
  catalog: ProductSummary[]
): PaletteOption[] {
  const q = query.trim();
  const matchingPages = pages.filter((page) => matchesText(page.label, q));
  if (!q) return matchingPages;

  const products = catalog
    .filter((product) => matchesQuery(product, q))
    .slice(0, PALETTE_PRODUCT_LIMIT)
    .map((product) => ({
      kind: 'product' as const,
      to: `/products/${product.id}`,
      label: product.title,
      product,
    }));
  return [
    ...matchingPages,
    ...products,
    {
      kind: 'search',
      to: `/products?${new URLSearchParams({ q })}`,
      label: `Search products for “${q}”`,
    },
  ];
}

/** Moves a selection by one step, wrapping around at both ends. */
export function wrapIndex(index: number, step: number, length: number) {
  return (index + step + length) % length;
}
