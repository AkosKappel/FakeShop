import type { ProductSummary } from './api';

// Discounts below this are shown as the regular price, so "on sale" means something.
export const SALE_THRESHOLD = 10;
export const PAGE_SIZE = 24;

export function isOnSale(product: Pick<ProductSummary, 'discountPercentage'>) {
  return product.discountPercentage >= SALE_THRESHOLD;
}

export function finalPrice(
  product: Pick<ProductSummary, 'price' | 'discountPercentage'>
): number {
  if (!isOnSale(product)) return product.price;
  return Math.round(product.price * (100 - product.discountPercentage)) / 100;
}

export interface CategoryGroup {
  name: string;
  slug: string;
  categories: string[];
}

// DummyJSON's category list is fixed, so it lives here and the header
// renders without waiting for a request.
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: 'Fashion',
    slug: 'fashion',
    categories: [
      'tops',
      'womens-dresses',
      'womens-shoes',
      'womens-bags',
      'womens-jewellery',
      'mens-shirts',
      'mens-shoes',
      'sunglasses',
    ],
  },
  {
    name: 'Watches',
    slug: 'watches',
    categories: ['mens-watches', 'womens-watches'],
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    categories: ['smartphones', 'laptops', 'tablets', 'mobile-accessories'],
  },
  {
    name: 'Home & Kitchen',
    slug: 'home',
    categories: [
      'furniture',
      'home-decoration',
      'kitchen-accessories',
      'groceries',
    ],
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    categories: ['beauty', 'fragrances', 'skin-care'],
  },
  {
    name: 'Sports & Vehicles',
    slug: 'sports',
    categories: ['sports-accessories', 'motorcycle', 'vehicle'],
  },
];

const CATEGORY_NAMES: Record<string, string> = {
  'womens-dresses': "Women's Dresses",
  'womens-shoes': "Women's Shoes",
  'womens-bags': "Women's Bags",
  'womens-jewellery': "Women's Jewellery",
  'womens-watches': "Women's Watches",
  'mens-shirts': "Men's Shirts",
  'mens-shoes': "Men's Shoes",
  'mens-watches': "Men's Watches",
  'home-decoration': 'Home Decoration',
  'kitchen-accessories': 'Kitchen Accessories',
  'mobile-accessories': 'Mobile Accessories',
  'skin-care': 'Skin Care',
  'sports-accessories': 'Sports Accessories',
};

export function categoryName(slug: string): string {
  return (
    CATEGORY_NAMES[slug] ??
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}

export function isKnownCategory(slug: string): boolean {
  return CATEGORY_GROUPS.some((group) => group.categories.includes(slug));
}

export const SORT_OPTIONS = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
  discount: 'Biggest discount',
  name: 'Name: A to Z',
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;

export interface Filters {
  q: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock: boolean;
  onSale: boolean;
  sort: SortKey;
  page: number;
}

function positiveNumber(value: string | null): number | undefined {
  if (value === null || value.trim() === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

export function parseFilters(params: URLSearchParams): Filters {
  const sort = params.get('sort') ?? 'featured';
  const page = Math.floor(positiveNumber(params.get('page')) ?? 1);
  return {
    q: params.get('q')?.trim() ?? '',
    brands: params.getAll('brand'),
    minPrice: positiveNumber(params.get('min')),
    maxPrice: positiveNumber(params.get('max')),
    minRating: positiveNumber(params.get('rating')),
    inStock: params.get('stock') === '1',
    onSale: params.get('sale') === '1',
    sort: sort in SORT_OPTIONS ? (sort as SortKey) : 'featured',
    page: Math.max(page, 1),
  };
}

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Every word of the query must appear in the title, brand or category. */
export function matchesQuery(product: ProductSummary, query: string): boolean {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalize(
    `${product.title} ${product.brand ?? ''} ${categoryName(product.category)}`
  );
  return words.every((word) => haystack.includes(word));
}

export function applyFilters(
  products: ProductSummary[],
  filters: Filters
): ProductSummary[] {
  return products.filter((product) => {
    const price = finalPrice(product);
    return (
      matchesQuery(product, filters.q) &&
      (filters.brands.length === 0 ||
        filters.brands.includes(product.brand ?? '')) &&
      (filters.minPrice === undefined || price >= filters.minPrice) &&
      (filters.maxPrice === undefined || price <= filters.maxPrice) &&
      (filters.minRating === undefined ||
        product.rating >= filters.minRating) &&
      (!filters.inStock || product.stock > 0) &&
      (!filters.onSale || isOnSale(product))
    );
  });
}

export function sortProducts(
  products: ProductSummary[],
  sort: SortKey
): ProductSummary[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => finalPrice(a) - finalPrice(b));
    case 'price-desc':
      return sorted.sort((a, b) => finalPrice(b) - finalPrice(a));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'discount':
      return sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'featured':
      return sorted;
  }
}

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, pageCount);
  return {
    items: items.slice((current - 1) * size, current * size),
    page: current,
    pageCount,
  };
}

/** Brands present in a product list, most common first. */
export function brandsOf(products: ProductSummary[]): string[] {
  const counts = new Map<string, number>();
  for (const { brand } of products) {
    if (brand) counts.set(brand, (counts.get(brand) ?? 0) + 1);
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([brand]) => brand);
}
