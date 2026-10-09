import { useRef, useState, type FormEvent } from 'react';
import { Link, useLoaderData, useParams, useSearchParams } from 'react-router';
import {
  LuChevronLeft,
  LuChevronRight,
  LuSearch,
  LuSlidersHorizontal,
  LuStar,
  LuX,
} from 'react-icons/lu';

import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import ProductGrid from '../components/ProductGrid';
import type { ProductSummary } from '../lib/api';
import {
  SORT_OPTIONS,
  applyFilters,
  brandsOf,
  categoryName,
  isKnownCategory,
  matchesQuery,
  paginate,
  parseFilters,
  sortProducts,
  type Filters,
  type SortKey,
} from '../lib/catalog';
import { formatPrice, pluralize } from '../lib/format';
import NotFoundPage from './NotFoundPage';

type Changes = Record<string, string | string[] | null>;

const BRANDS_SHOWN = 8;

function countBy<T>(items: T[], key: (item: T) => string | undefined) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const value = key(item);
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

interface FilterPanelProps {
  filters: Filters;
  /** Products matching the category and search, before the other filters. */
  pool: ProductSummary[];
  slug?: string;
  params: URLSearchParams;
  update: (changes: Changes) => void;
}

function FilterPanel({
  filters,
  pool,
  slug,
  params,
  update,
}: FilterPanelProps) {
  const [showAllBrands, setShowAllBrands] = useState(false);
  const brands = brandsOf(pool);
  const brandCounts = countBy(pool, (p) => p.brand);
  const categoryCounts = countBy(pool, (p) => p.category);
  const visibleBrands = showAllBrands ? brands : brands.slice(0, BRANDS_SHOWN);
  const query = params.toString() ? `?${params}` : '';

  const applyPrice = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    update({ min: String(data.get('min')), max: String(data.get('max')) });
  };

  const toggleBrand = (brand: string) =>
    update({
      brand: filters.brands.includes(brand)
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand],
    });

  const heading = 'mb-3 text-sm font-bold';
  const option =
    'flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800';
  const checkbox = 'size-4 accent-brand-600';

  return (
    <div className="space-y-7">
      <section>
        <h2 className={heading}>Category</h2>
        {slug ? (
          <Link to={`/products${query}`} className="link text-sm">
            ← All categories
          </Link>
        ) : (
          <ul className="max-h-64 space-y-0.5 overflow-y-auto">
            {[...categoryCounts]
              .sort((a, b) =>
                categoryName(a[0]).localeCompare(categoryName(b[0]))
              )
              .map(([category, count]) => (
                <li key={category}>
                  <Link to={`/category/${category}${query}`} className={option}>
                    <span className="flex-1">{categoryName(category)}</span>
                    <span className="text-xs text-zinc-500">{count}</span>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className={heading}>Price</h2>
        <form
          key={`${filters.minPrice}-${filters.maxPrice}`}
          onSubmit={applyPrice}
          className="flex items-end gap-2"
        >
          <label className="flex-1 text-xs text-zinc-600 dark:text-zinc-400">
            Min ($)
            <input
              name="min"
              type="number"
              min={0}
              inputMode="decimal"
              defaultValue={filters.minPrice}
              className="field mt-1 h-10"
            />
          </label>
          <label className="flex-1 text-xs text-zinc-600 dark:text-zinc-400">
            Max ($)
            <input
              name="max"
              type="number"
              min={0}
              inputMode="decimal"
              defaultValue={filters.maxPrice}
              className="field mt-1 h-10"
            />
          </label>
          <button type="submit" className="btn-secondary h-10 px-4">
            Go
          </button>
        </form>
      </section>

      <section>
        <h2 className={heading}>Customer rating</h2>
        <div className="space-y-0.5">
          {[undefined, 4.5, 4, 3].map((rating) => (
            <label key={rating ?? 'any'} className={option}>
              <input
                type="radio"
                name="rating"
                className={checkbox}
                checked={filters.minRating === rating}
                onChange={() =>
                  update({ rating: rating ? String(rating) : null })
                }
              />
              {rating ? (
                <span className="flex items-center gap-1">
                  {rating}
                  <LuStar
                    className="size-3.5 fill-amber-400 text-amber-400"
                    aria-label="stars"
                  />
                  & up
                </span>
              ) : (
                'Any rating'
              )}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className={heading}>Availability</h2>
        <label className={option}>
          <input
            type="checkbox"
            className={checkbox}
            checked={filters.inStock}
            onChange={() => update({ stock: filters.inStock ? null : '1' })}
          />
          In stock only
        </label>
        <label className={option}>
          <input
            type="checkbox"
            className={checkbox}
            checked={filters.onSale}
            onChange={() => update({ sale: filters.onSale ? null : '1' })}
          />
          On sale
        </label>
      </section>

      {brands.length > 0 && (
        <section>
          <h2 className={heading}>Brand</h2>
          <div className="space-y-0.5">
            {visibleBrands.map((brand) => (
              <label key={brand} className={option}>
                <input
                  type="checkbox"
                  className={checkbox}
                  checked={filters.brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                <span className="flex-1">{brand}</span>
                <span className="text-xs text-zinc-500">
                  {brandCounts.get(brand)}
                </span>
              </label>
            ))}
          </div>
          {brands.length > BRANDS_SHOWN && (
            <button
              type="button"
              className="link mt-2 cursor-pointer px-2 text-sm"
              onClick={() => setShowAllBrands(!showAllBrands)}
            >
              {showAllBrands
                ? 'Show fewer'
                : `Show all ${brands.length} brands`}
            </button>
          )}
        </section>
      )}
    </div>
  );
}

function activeChips(filters: Filters): { label: string; changes: Changes }[] {
  const chips: { label: string; changes: Changes }[] = [];
  if (filters.q) chips.push({ label: `“${filters.q}”`, changes: { q: null } });
  for (const brand of filters.brands) {
    chips.push({
      label: brand,
      changes: { brand: filters.brands.filter((b) => b !== brand) },
    });
  }
  if (filters.minPrice !== undefined)
    chips.push({
      label: `From ${formatPrice(filters.minPrice)}`,
      changes: { min: null },
    });
  if (filters.maxPrice !== undefined)
    chips.push({
      label: `Up to ${formatPrice(filters.maxPrice)}`,
      changes: { max: null },
    });
  if (filters.minRating !== undefined)
    chips.push({
      label: `${filters.minRating}★ & up`,
      changes: { rating: null },
    });
  if (filters.inStock)
    chips.push({ label: 'In stock', changes: { stock: null } });
  if (filters.onSale) chips.push({ label: 'On sale', changes: { sale: null } });
  return chips;
}

function pageHref(params: URLSearchParams, page: number) {
  const next = new URLSearchParams(params);
  if (page === 1) next.delete('page');
  else next.set('page', String(page));
  return next.toString() ? `?${next}` : '?';
}

function Pagination({
  page,
  pageCount,
  params,
}: {
  page: number;
  pageCount: number;
  params: URLSearchParams;
}) {
  if (pageCount <= 1) return null;
  const arrow =
    'btn-icon ring-1 ring-zinc-300 dark:ring-zinc-700 aria-disabled:pointer-events-none aria-disabled:opacity-40';
  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1"
    >
      <Link
        to={pageHref(params, page - 1)}
        className={arrow}
        aria-disabled={page === 1}
        aria-label="Previous page"
      >
        <LuChevronLeft className="size-5" />
      </Link>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
        <Link
          key={number}
          to={pageHref(params, number)}
          aria-current={number === page ? 'page' : undefined}
          className="flex size-10 items-center justify-center rounded-full text-sm font-semibold hover:bg-zinc-100 aria-[current=page]:bg-zinc-900 aria-[current=page]:text-white dark:hover:bg-zinc-800 dark:aria-[current=page]:bg-zinc-100 dark:aria-[current=page]:text-zinc-900"
        >
          {number}
        </Link>
      ))}
      <Link
        to={pageHref(params, page + 1)}
        className={arrow}
        aria-disabled={page === pageCount}
        aria-label="Next page"
      >
        <LuChevronRight className="size-5" />
      </Link>
    </nav>
  );
}

export default function ProductsPage() {
  const { catalog } = useLoaderData<{ catalog: ProductSummary[] }>();
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const filtersDialog = useRef<HTMLDialogElement>(null);

  if (slug && !isKnownCategory(slug)) return <NotFoundPage what="category" />;

  const filters = parseFilters(params);
  const inCategory = slug
    ? catalog.filter((product) => product.category === slug)
    : catalog;
  const pool = inCategory.filter((product) => matchesQuery(product, filters.q));
  const results = sortProducts(applyFilters(inCategory, filters), filters.sort);
  const { items, page, pageCount } = paginate(results, filters.page);
  const chips = activeChips(filters);

  const title = slug
    ? categoryName(slug)
    : filters.q
      ? `Results for “${filters.q}”`
      : filters.onSale
        ? 'Deals'
        : 'All products';

  const update = (changes: Changes) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      next.delete(key);
      for (const item of [value ?? []].flat()) {
        if (item.trim() !== '') next.append(key, item);
      }
    }
    // Any filter change starts again from the first page.
    if (!('page' in changes)) next.delete('page');
    setParams(next, { preventScrollReset: true, replace: true });
  };

  const clearAll = () =>
    setParams(new URLSearchParams(), { preventScrollReset: true });

  const panel = (
    <FilterPanel
      filters={filters}
      pool={pool}
      slug={slug}
      params={params}
      update={update}
    />
  );

  return (
    <>
      <title>{`${title} | FakeShop`}</title>
      <Breadcrumbs
        items={[
          { label: 'Home', to: '/' },
          ...(slug
            ? [{ label: 'Categories', to: '/categories' }, { label: title }]
            : [{ label: 'Products' }]),
        ]}
      />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p
            className="mt-1 text-sm text-zinc-600 dark:text-zinc-400"
            aria-live="polite"
          >
            {pluralize(results.length, 'product', 'products')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-secondary lg:hidden"
            onClick={() => filtersDialog.current?.showModal()}
          >
            <LuSlidersHorizontal className="size-4" aria-hidden="true" />
            Filters
            {chips.length > 0 && (
              <span className="rounded-full bg-brand-600 px-1.5 text-xs text-white">
                {chips.length}
              </span>
            )}
          </button>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline">Sort by</span>
            <select
              value={filters.sort}
              onChange={(event) =>
                update({
                  sort:
                    event.target.value === 'featured'
                      ? null
                      : event.target.value,
                })
              }
              className="field h-11 w-auto rounded-full pr-8"
              aria-label="Sort products"
            >
              {(Object.keys(SORT_OPTIONS) as SortKey[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_OPTIONS[key]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <ul
          className="mb-6 flex flex-wrap items-center gap-2"
          aria-label="Active filters"
        >
          {chips.map((chip) => (
            <li key={chip.label}>
              <button
                type="button"
                onClick={() => update(chip.changes)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-zinc-200 py-1.5 pr-2 pl-3 text-sm font-medium hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                aria-label={`Remove filter ${chip.label}`}
              >
                {chip.label}
                <LuX className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={clearAll}
              className="link cursor-pointer px-2 text-sm"
            >
              Clear all
            </button>
          </li>
        </ul>
      )}

      <div className="flex gap-8">
        <aside aria-label="Filters" className="hidden w-60 shrink-0 lg:block">
          {panel}
        </aside>
        <div className="min-w-0 flex-1">
          {items.length > 0 ? (
            <>
              <ProductGrid products={items} />
              <Pagination page={page} pageCount={pageCount} params={params} />
            </>
          ) : (
            <EmptyState
              icon={LuSearch}
              title="No products match"
              actions={
                <>
                  {chips.length > 0 && (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={clearAll}
                    >
                      Clear all filters
                    </button>
                  )}
                  <Link to="/categories" className="btn-secondary">
                    Browse categories
                  </Link>
                </>
              }
            >
              <p>
                Try fewer filters or another word, for example{' '}
                <Link to="/products?q=phone" className="link">
                  phone
                </Link>
                ,{' '}
                <Link to="/products?q=watch" className="link">
                  watch
                </Link>{' '}
                or{' '}
                <Link to="/products?q=perfume" className="link">
                  perfume
                </Link>
                .
              </p>
            </EmptyState>
          )}
        </div>
      </div>

      <dialog
        ref={filtersDialog}
        aria-label="Filters"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-0 ml-auto h-dvh max-h-none w-[min(24rem,92vw)] bg-white p-0 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-lg font-bold">Filters</p>
            <button
              type="button"
              className="btn-icon"
              onClick={() => filtersDialog.current?.close()}
              aria-label="Close filters"
            >
              <LuX className="size-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{panel}</div>
          <div className="flex gap-3 border-t border-zinc-200 p-4 dark:border-zinc-800">
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={clearAll}
            >
              Clear all
            </button>
            <button
              type="button"
              className="btn-primary flex-1"
              onClick={() => filtersDialog.current?.close()}
            >
              Show {pluralize(results.length, 'product', 'products')}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
