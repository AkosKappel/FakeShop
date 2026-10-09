import { Link, useLoaderData } from 'react-router';
import { LuHeart } from 'react-icons/lu';

import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import ProductGrid from '../components/ProductGrid';
import type { ProductSummary } from '../lib/api';
import { cart } from '../lib/cart';
import { pluralize } from '../lib/format';
import { pickByIds, useWishlist, wishlistStore } from '../lib/lists';
import { toast } from '../lib/toast';

export default function WishlistPage() {
  const { catalog } = useLoaderData<{ catalog: ProductSummary[] }>();
  const products = pickByIds(catalog, useWishlist());
  const available = products.filter((product) => product.stock > 0);

  const addAllToCart = () => {
    available.forEach((product) => cart.add(product));
    toast(
      `${pluralize(available.length, 'item', 'items')} added to your cart`,
      {
        label: 'View cart',
        to: '/cart',
      }
    );
  };

  return (
    <>
      <title>Wishlist | FakeShop</title>
      <Breadcrumbs
        items={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}
      />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Wishlist</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {pluralize(products.length, 'saved item', 'saved items')}, kept in
            this browser only
          </p>
        </div>
        {products.length > 0 && (
          <div className="flex gap-3">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => wishlistStore.set([])}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={addAllToCart}
              disabled={available.length === 0}
            >
              Add all to cart
            </button>
          </div>
        )}
      </div>
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState
          icon={LuHeart}
          title="Your wishlist is empty"
          actions={
            <Link to="/products" className="btn-primary">
              Browse products
            </Link>
          }
        >
          <p>Tap the heart on any product to save it for later.</p>
        </EmptyState>
      )}
    </>
  );
}
