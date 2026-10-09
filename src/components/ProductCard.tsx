import { Link } from 'react-router';
import { LuShoppingBag } from 'react-icons/lu';

import Price from './Price';
import Rating from './Rating';
import WishlistButton from './WishlistButton';
import type { ProductSummary } from '../lib/api';
import { addToCartWithToast } from '../lib/cart';
import { categoryName, isOnSale } from '../lib/catalog';
import { formatPercent } from '../lib/format';

interface ProductCardProps {
  product: ProductSummary;
  /** Load the image eagerly (first row above the fold). */
  priority?: boolean;
}

export default function ProductCard({ product, priority }: ProductCardProps) {
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 5;

  return (
    <article className="card group relative flex w-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="image-tile relative aspect-square">
        <img
          src={product.thumbnail}
          alt=""
          width={300}
          height={300}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        {isOnSale(product) && (
          <span className="absolute top-3 left-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white">
            −{formatPercent(product.discountPercentage)}
          </span>
        )}
        <WishlistButton
          productId={product.id}
          title={product.title}
          className="btn-icon absolute top-2 right-2 z-10 bg-white/80 text-zinc-700 backdrop-blur hover:bg-white dark:text-zinc-700 dark:hover:bg-white"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
          {product.brand ?? categoryName(product.category)}
        </p>
        <h3 className="line-clamp-2 leading-snug font-semibold">
          <Link
            to={`/products/${product.id}`}
            viewTransition
            className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:rounded-2xl after:focus-visible:outline-2 after:focus-visible:outline-brand-500"
          >
            {product.title}
          </Link>
        </h3>
        <Rating rating={product.rating} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <Price product={product} />
            {(soldOut || lowStock) && (
              <p
                className={`text-xs font-medium ${soldOut ? 'text-zinc-500' : 'text-amber-700 dark:text-amber-400'}`}
              >
                {soldOut ? 'Out of stock' : `Only ${product.stock} left`}
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn-icon relative z-10 bg-zinc-900 text-white hover:bg-brand-600 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-brand-500 dark:hover:text-white"
            onClick={() => addToCartWithToast(product)}
            disabled={soldOut}
            aria-label={`Add ${product.title} to cart`}
            title="Add to cart"
          >
            <LuShoppingBag className="size-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
