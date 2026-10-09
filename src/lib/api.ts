const API_URL = 'https://dummyjson.com';

const SUMMARY_FIELDS = [
  'title',
  'price',
  'discountPercentage',
  'rating',
  'stock',
  'brand',
  'thumbnail',
  'category',
  'availabilityStatus',
].join(',');

export interface ProductSummary {
  id: number;
  title: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  category: string;
  availabilityStatus: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

export interface Product extends ProductSummary {
  description: string;
  images: string[];
  tags: string[];
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  returnPolicy: string;
  reviews: Review[];
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, path: string) {
    super(`Request to ${path} failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

const cache = new Map<string, Promise<unknown>>();

// Responses are cached for the lifetime of the tab: the demo data never
// changes, and back/forward navigation should not refetch.
function getJson<T>(path: string): Promise<T> {
  let request = cache.get(path) as Promise<T> | undefined;
  if (!request) {
    request = fetch(API_URL + path).then((response) => {
      if (!response.ok) throw new ApiError(response.status, path);
      return response.json() as Promise<T>;
    });
    cache.set(path, request);
    request.catch(() => cache.delete(path));
  }
  return request;
}

// The whole catalog is about 8 kB gzipped, so lists, search, filters and
// paging all run on one cached request.
export async function getCatalog(): Promise<ProductSummary[]> {
  const data = await getJson<{ products: ProductSummary[] }>(
    `/products?limit=0&select=${SUMMARY_FIELDS}`
  );
  return data.products;
}

export function getProduct(id: string | number): Promise<Product> {
  return getJson<Product>(`/products/${encodeURIComponent(id)}`);
}

export function isNotFound(error: unknown): boolean {
  return error instanceof ApiError && [400, 404].includes(error.status);
}
