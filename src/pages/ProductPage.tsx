import { Suspense, use, useEffect, useRef, useState } from 'react';
import { Link, useLoaderData, useParams } from 'react-router';
import {
  LuPackage,
  LuRotateCcw,
  LuShare2,
  LuShieldCheck,
  LuShoppingBag,
  LuTruck,
  LuX,
} from 'react-icons/lu';

import Breadcrumbs from '../components/Breadcrumbs';
import Price from '../components/Price';
import ProductRail from '../components/ProductRail';
import QuantityPicker from '../components/QuantityPicker';
import Rating from '../components/Rating';
import WishlistButton from '../components/WishlistButton';
import type { Product, ProductSummary } from '../lib/api';
import { addToCartWithToast, maxQuantity, useCart } from '../lib/cart';
import { categoryName, finalPrice, isOnSale } from '../lib/catalog';
import {
  formatDate,
  formatPercent,
  formatPrice,
  pluralize,
} from '../lib/format';
import { markViewed, pickByIds, useRecentlyViewed } from '../lib/lists';
import { toast } from '../lib/toast';

interface LoaderData {
  product: Promise<Product>;
  catalog: Promise<ProductSummary[]>;
}

export default function ProductPage() {
  const { product, catalog } = useLoaderData<LoaderData>();
  const { id } = useParams();
  return (
    // The key shows the skeleton again when moving from one product to another.
    <Suspense key={id} fallback={<ProductSkeleton />}>
      <ProductDetails productPromise={product} catalogPromise={catalog} />
    </Suspense>
  );
}

async function share(product: Product) {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title: product.title, url });
    } catch {
      // The user closed the share sheet.
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    toast('Link copied to the clipboard');
  } catch {
    toast('Could not copy the link');
  }
}

function Gallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0);
  const zoomRef = useRef<HTMLDialogElement>(null);
  const images =
    product.images.length > 0 ? product.images : [product.thumbnail];
  const image = images[Math.min(selected, images.length - 1)];

  return (
    <div className="space-y-3">
      <button
        type="button"
        className="image-tile relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-3xl"
        onClick={() => zoomRef.current?.showModal()}
        aria-label="Enlarge image"
      >
        <img
          src={image}
          alt={product.title}
          width={600}
          height={600}
          fetchPriority="high"
          className="size-full object-contain p-6"
        />
        {isOnSale(product) && (
          <span className="absolute top-4 left-4 rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white">
            −{formatPercent(product.discountPercentage)}
          </span>
        )}
      </button>
      {images.length > 1 && (
        <ul
          className="flex gap-3 overflow-x-auto pb-1"
          aria-label="Product images"
        >
          {images.map((src, index) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setSelected(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={index === selected}
                className="image-tile size-20 cursor-pointer overflow-hidden rounded-xl ring-2 ring-transparent aria-[current=true]:ring-brand-600"
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  className="size-full object-contain p-1.5"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
      <dialog
        ref={zoomRef}
        aria-label={product.title}
        onClick={() => zoomRef.current?.close()}
        className="m-auto max-h-[92dvh] max-w-[92vw] overflow-hidden rounded-3xl bg-white p-0 backdrop:bg-zinc-950/80"
      >
        <img
          src={image}
          alt={product.title}
          className="max-h-[92dvh] w-auto object-contain"
        />
        <button
          type="button"
          className="btn-icon absolute top-3 right-3 bg-white/90 text-zinc-900 hover:bg-white dark:text-zinc-900"
          aria-label="Close image"
          autoFocus
        >
          <LuX className="size-6" />
        </button>
      </dialog>
    </div>
  );
}

function ProductDetails({
  productPromise,
  catalogPromise,
}: {
  productPromise: Promise<Product>;
  catalogPromise: Promise<ProductSummary[]>;
}) {
  const product = use(productPromise);
  const catalog = use(catalogPromise);
  const [quantity, setQuantity] = useState(1);
  const inCart =
    useCart().lines.find((line) => line.id === product.id)?.quantity ?? 0;
  const recentIds = useRecentlyViewed();

  useEffect(() => markViewed(product.id), [product.id]);

  const available = maxQuantity(product.stock) - inCart;
  const soldOut = product.stock <= 0;
  const related = catalog
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort((a, b) => b.rating - a.rating);
  const recent = pickByIds(
    catalog,
    recentIds.filter((id) => id !== product.id)
  );

  const addButton = (
    <button
      type="button"
      className="btn-primary flex-1"
      disabled={soldOut || available <= 0}
      onClick={() => {
        addToCartWithToast(product, Math.min(quantity, available));
        setQuantity(1);
      }}
    >
      <LuShoppingBag className="size-5" aria-hidden="true" />
      {soldOut
        ? 'Out of stock'
        : available <= 0
          ? 'All in your cart'
          : 'Add to cart'}
    </button>
  );

  const facts = [
    { icon: LuTruck, text: product.shippingInformation },
    { icon: LuShieldCheck, text: product.warrantyInformation },
    { icon: LuRotateCcw, text: product.returnPolicy },
  ];

  return (
    <div className="space-y-14 pb-20 lg:pb-0">
      <title>{`${product.title} | FakeShop`}</title>
      <meta name="description" content={product.description} />

      <div>
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            {
              label: categoryName(product.category),
              to: `/category/${product.category}`,
            },
            { label: product.title },
          ]}
        />
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          <Gallery product={product} />

          <div className="space-y-6">
            <div className="space-y-3">
              {product.brand && (
                <p className="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                  {product.brand}
                </p>
              )}
              <h1 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
                {product.title}
              </h1>
              <a href="#reviews" className="inline-block">
                <Rating
                  rating={product.rating}
                  size="md"
                  label={pluralize(product.reviews.length, 'review', 'reviews')}
                />
              </a>
            </div>

            <div className="space-y-1">
              <Price product={product} size="lg" />
              {isOnSale(product) && (
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  You save {formatPrice(product.price - finalPrice(product))}
                </p>
              )}
            </div>

            <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
              {product.description}
            </p>

            <p
              className={`flex items-center gap-2 text-sm font-semibold ${soldOut ? 'text-zinc-500' : product.stock <= 5 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'}`}
            >
              <LuPackage className="size-4" aria-hidden="true" />
              {soldOut
                ? 'Out of stock'
                : product.stock <= 5
                  ? `Only ${product.stock} left in stock`
                  : `In stock (${product.stock} available)`}
              {inCart > 0 && (
                <Link to="/cart" className="link font-medium">
                  · {inCart} in your cart
                </Link>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {!soldOut && available > 0 && (
                <QuantityPicker
                  quantity={Math.min(quantity, available)}
                  stock={available}
                  onChange={setQuantity}
                  label="Quantity to add"
                />
              )}
              <div className="hidden flex-1 sm:flex md:order-last md:basis-full lg:order-none lg:basis-auto">
                {addButton}
              </div>
              <WishlistButton
                productId={product.id}
                title={product.title}
                className="btn-icon size-11 ring-1 ring-zinc-300 dark:ring-zinc-700"
              />
              <button
                type="button"
                className="btn-icon size-11 ring-1 ring-zinc-300 dark:ring-zinc-700"
                onClick={() => share(product)}
                aria-label="Share this product"
                title="Share"
              >
                <LuShare2 className="size-5" />
              </button>
            </div>

            <ul className="card divide-y divide-zinc-200 dark:divide-zinc-800">
              {facts.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 px-4 py-3 text-sm"
                >
                  <Icon
                    className="size-5 shrink-0 text-brand-600 dark:text-brand-400"
                    aria-hidden="true"
                  />
                  {text}
                </li>
              ))}
            </ul>

            <details className="card group px-4 py-3">
              <summary className="cursor-pointer font-semibold">
                Specifications
              </summary>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <dt className="text-zinc-500">SKU</dt>
                <dd>{product.sku}</dd>
                <dt className="text-zinc-500">Weight</dt>
                <dd>{product.weight} kg</dd>
                <dt className="text-zinc-500">Dimensions</dt>
                <dd>
                  {product.dimensions.width} × {product.dimensions.height} ×{' '}
                  {product.dimensions.depth} cm
                </dd>
                <dt className="text-zinc-500">Tags</dt>
                <dd>{product.tags.join(', ')}</dd>
              </dl>
            </details>
          </div>
        </div>
      </div>

      <section
        id="reviews"
        aria-labelledby="reviews-heading"
        className="scroll-mt-32"
      >
        <h2 id="reviews-heading" className="mb-4 text-xl font-bold sm:text-2xl">
          Customer reviews
        </h2>
        {product.reviews.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No reviews yet.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-3">
            {product.reviews.map((review) => (
              <li
                key={`${review.reviewerName}-${review.date}-${review.comment}`}
                className="card space-y-2 p-5"
              >
                <Rating rating={review.rating} />
                <p className="font-medium">“{review.comment}”</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {review.reviewerName} · {formatDate(review.date)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ProductRail
        title={`More in ${categoryName(product.category)}`}
        products={related}
      />
      <ProductRail title="Recently viewed" products={recent} />

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-zinc-200 bg-white/95 p-3 backdrop-blur sm:hidden dark:border-zinc-800 dark:bg-zinc-900/95">
        <p className="font-bold">{formatPrice(finalPrice(product))}</p>
        {addButton}
      </div>
    </div>
  );
}

function ProductSkeleton() {
  const block = 'rounded-lg bg-zinc-200 dark:bg-zinc-800';
  return (
    <div className="animate-pulse" aria-busy="true">
      <span className="sr-only">Loading product</span>
      <div className={`mb-4 h-4 w-64 ${block}`} />
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <div className="aspect-square rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-4">
          <div className={`h-4 w-24 ${block}`} />
          <div className={`h-10 w-4/5 ${block}`} />
          <div className={`h-5 w-40 ${block}`} />
          <div className={`h-9 w-32 ${block}`} />
          <div className={`h-24 w-full ${block}`} />
          <div className={`h-11 w-full rounded-full ${block}`} />
        </div>
      </div>
    </div>
  );
}
