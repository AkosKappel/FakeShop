import type { ReactNode } from 'react';
import { Link, useLoaderData } from 'react-router';
import { LuScale, LuShoppingBag, LuX } from 'react-icons/lu';

import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import Price from '../components/Price';
import Rating from '../components/Rating';
import type { Product } from '../lib/api';
import { addToCartWithToast } from '../lib/cart';
import { categoryName, finalPrice } from '../lib/catalog';
import {
  MAX_COMPARE,
  compareStore,
  pickByIds,
  toggleId,
  useCompare,
} from '../lib/lists';

interface Row {
  label: string;
  render: (product: Product) => ReactNode;
  /** Marks the best value in the row when the products differ. */
  best?: { value: (product: Product) => number; prefer: 'min' | 'max' };
}

const ROWS: Row[] = [
  {
    label: 'Price',
    render: (p) => <Price product={p} />,
    best: { value: finalPrice, prefer: 'min' },
  },
  {
    label: 'Rating',
    render: (p) => (
      <Rating rating={p.rating} label={`${p.reviews.length} reviews`} />
    ),
    best: { value: (p) => p.rating, prefer: 'max' },
  },
  { label: 'Brand', render: (p) => p.brand ?? '–' },
  { label: 'Category', render: (p) => categoryName(p.category) },
  {
    label: 'Stock',
    render: (p) => (p.stock > 0 ? `${p.stock} available` : 'Out of stock'),
  },
  {
    label: 'Weight',
    render: (p) => `${p.weight} kg`,
    best: { value: (p) => p.weight, prefer: 'min' },
  },
  {
    label: 'Dimensions',
    render: ({ dimensions: d }) => `${d.width} × ${d.height} × ${d.depth} cm`,
  },
  { label: 'Warranty', render: (p) => p.warrantyInformation },
  { label: 'Shipping', render: (p) => p.shippingInformation },
  { label: 'Returns', render: (p) => p.returnPolicy },
];

function bestIds(products: Product[], best: NonNullable<Row['best']>) {
  const values = products.map(best.value);
  const target =
    best.prefer === 'min' ? Math.min(...values) : Math.max(...values);
  if (values.every((value) => value === target)) return new Set<number>();
  return new Set(
    products.filter((_, i) => values[i] === target).map((p) => p.id)
  );
}

export default function ComparePage() {
  const { products: loaded } = useLoaderData<{ products: Product[] }>();
  // Products removed on this page disappear at once; nothing new needs loading.
  const products = pickByIds(loaded, useCompare());

  const remove = (id: number) =>
    compareStore.set((ids) => toggleId(ids, id, MAX_COMPARE));

  return (
    <>
      <title>Compare products | FakeShop</title>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Compare' }]} />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Compare products
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Up to {MAX_COMPARE} products side by side. The best value in each
            row is highlighted.
          </p>
        </div>
        {products.length > 0 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => compareStore.set([])}
          >
            Clear
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={LuScale}
          title="Nothing to compare yet"
          actions={
            <Link to="/products" className="btn-primary">
              Browse products
            </Link>
          }
        >
          <p>
            Press the scales button on a product page to add it here, then add
            one or two more.
          </p>
        </EmptyState>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[40rem] table-fixed border-collapse text-sm">
            <caption className="sr-only">Product comparison</caption>
            <colgroup>
              <col className="w-28 sm:w-40" />
              {products.map((p) => (
                <col key={p.id} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <td className="sticky left-0 z-20 bg-white dark:bg-zinc-900" />
                {products.map((product) => (
                  <th
                    key={product.id}
                    scope="col"
                    className="p-4 text-left align-top font-normal"
                  >
                    <div className="relative">
                      <button
                        type="button"
                        className="btn-icon absolute -top-1 right-0 z-10 size-8"
                        onClick={() => remove(product.id)}
                        aria-label={`Remove ${product.title} from comparison`}
                      >
                        <LuX className="size-4" />
                      </button>
                      <Link
                        to={`/products/${product.id}`}
                        className="group block"
                      >
                        <span className="image-tile mb-3 block aspect-square w-full max-w-40 rounded-2xl p-3">
                          <img
                            src={product.thumbnail}
                            alt=""
                            className="size-full object-contain transition-transform group-hover:scale-105"
                          />
                        </span>
                        <span className="line-clamp-2 pr-8 font-semibold group-hover:underline">
                          {product.title}
                        </span>
                      </Link>
                      <button
                        type="button"
                        className="btn-primary mt-3 h-9 px-4 text-xs"
                        disabled={product.stock <= 0}
                        onClick={() => addToCartWithToast(product)}
                      >
                        <LuShoppingBag className="size-4" aria-hidden="true" />
                        Add to cart
                      </button>
                    </div>
                  </th>
                ))}
                {products.length < MAX_COMPARE && (
                  <td className="p-4 align-top">
                    <Link
                      to="/products"
                      className="flex aspect-square max-w-40 items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 p-4 text-center text-sm font-medium text-zinc-500 hover:border-brand-500 hover:text-brand-700 dark:border-zinc-700"
                    >
                      Add a product
                    </Link>
                  </td>
                )}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const best =
                  row.best && products.length > 1
                    ? bestIds(products, row.best)
                    : new Set<number>();
                return (
                  <tr
                    key={row.label}
                    className="border-t border-zinc-200 dark:border-zinc-800"
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-20 bg-white px-3 py-4 text-left sm:p-4 align-top font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                    >
                      {row.label}
                    </th>
                    {products.map((product) => (
                      <td
                        key={product.id}
                        className={`p-4 align-top ${best.has(product.id) ? 'bg-emerald-50 dark:bg-emerald-950/50' : ''}`}
                      >
                        {row.render(product)}
                        {best.has(product.id) && (
                          <span className="mt-1 block text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Best
                          </span>
                        )}
                      </td>
                    ))}
                    {products.length < MAX_COMPARE && <td />}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
