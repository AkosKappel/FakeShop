import { Fragment } from 'react';
import { Link } from 'react-router';
import { LuPlus, LuShoppingBag } from 'react-icons/lu';

import Price from './Price';
import type { ProductSummary } from '../lib/api';
import { addAllToCartWithToast, roundCents } from '../lib/cart';
import { finalPrice } from '../lib/catalog';
import { formatPrice } from '../lib/format';

interface BoughtTogetherProps {
  product: ProductSummary;
  suggestions: ProductSummary[];
}

export default function BoughtTogether({
  product,
  suggestions,
}: BoughtTogetherProps) {
  if (suggestions.length === 0) return null;

  const items = [product, ...suggestions];
  const total = roundCents(items.reduce((sum, p) => sum + finalPrice(p), 0));
  const listTotal = roundCents(items.reduce((sum, p) => sum + p.price, 0));

  return (
    <section aria-labelledby="together-heading">
      <h2 id="together-heading" className="mb-4 text-xl font-bold sm:text-2xl">
        Frequently bought together
      </h2>
      <div className="card flex flex-col gap-6 p-5 lg:flex-row lg:items-center">
        <ul className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start">
          {items.map((item, index) => (
            <Fragment key={item.id}>
              {index > 0 && (
                <li
                  aria-hidden="true"
                  className="hidden self-center text-zinc-400 sm:block"
                >
                  <LuPlus className="size-5" />
                </li>
              )}
              <li className="flex flex-1 items-center gap-3 sm:flex-col sm:items-start">
                <img
                  src={item.thumbnail}
                  alt=""
                  width={96}
                  height={96}
                  loading="lazy"
                  className="image-tile size-20 shrink-0 rounded-xl object-contain sm:size-24"
                />
                <div className="min-w-0 space-y-1 text-sm">
                  {index === 0 ? (
                    <p className="line-clamp-2 font-semibold">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        This item:{' '}
                      </span>
                      {item.title}
                    </p>
                  ) : (
                    <Link
                      to={`/products/${item.id}`}
                      className="line-clamp-2 font-semibold hover:underline"
                    >
                      {item.title}
                    </Link>
                  )}
                  <Price product={item} />
                </div>
              </li>
            </Fragment>
          ))}
        </ul>
        <div className="space-y-3 border-t border-zinc-200 pt-5 lg:w-60 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 dark:border-zinc-800">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Total for all {items.length}
          </p>
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-2xl font-bold">{formatPrice(total)}</span>
            {listTotal > total && (
              <span className="text-sm text-zinc-500 line-through dark:text-zinc-400">
                <span className="sr-only">Regular price </span>
                {formatPrice(listTotal)}
              </span>
            )}
          </p>
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => addAllToCartWithToast(items)}
          >
            <LuShoppingBag className="size-5" aria-hidden="true" />
            Add all {items.length} to cart
          </button>
        </div>
      </div>
    </section>
  );
}
