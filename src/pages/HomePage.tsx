import { Link, useLoaderData } from 'react-router';
import {
  LuArrowRight,
  LuCopy,
  LuRotateCcw,
  LuShieldCheck,
  LuTruck,
} from 'react-icons/lu';

import ProductRail from '../components/ProductRail';
import type { ProductSummary } from '../lib/api';
import { CATEGORY_GROUPS, isOnSale } from '../lib/catalog';
import { FREE_SHIPPING_THRESHOLD } from '../lib/checkout';
import { formatPrice } from '../lib/format';
import { pickByIds, useRecentlyViewed } from '../lib/lists';
import { toast } from '../lib/toast';

const PROMO_CODE = 'FAKE10';
const HERO_CATEGORIES = ['fragrances', 'smartphones', 'mens-watches'];

const PERKS = [
  {
    icon: LuTruck,
    title: 'Free delivery',
    text: `On standard orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
  },
  {
    icon: LuRotateCcw,
    title: '30-day returns',
    text: 'Easy, because nothing ever arrives',
  },
  {
    icon: LuShieldCheck,
    title: 'Safe checkout',
    text: 'No payment is taken, card data never leaves the page',
  },
];

function topBy(
  products: ProductSummary[],
  score: (product: ProductSummary) => number,
  count = 12
) {
  return [...products].sort((a, b) => score(b) - score(a)).slice(0, count);
}

function copyPromoCode() {
  navigator.clipboard
    .writeText(PROMO_CODE)
    .then(() => toast(`Code ${PROMO_CODE} copied, use it in your cart`))
    .catch(() => toast(`Use code ${PROMO_CODE} in your cart`));
}

export default function HomePage() {
  const { catalog } = useLoaderData<{ catalog: ProductSummary[] }>();
  const recent = pickByIds(catalog, useRecentlyViewed());

  const deals = topBy(catalog.filter(isOnSale), (p) => p.discountPercentage);
  // No product in two rails: a shared image name would cancel the view transition.
  const dealIds = new Set(deals.map((p) => p.id));
  const topRated = topBy(
    catalog.filter((p) => !dealIds.has(p.id)),
    (p) => p.rating
  );
  const heroProducts = HERO_CATEGORIES.flatMap((category) =>
    topBy(
      catalog.filter((p) => p.category === category),
      (p) => p.rating,
      1
    )
  );
  const groupCovers = CATEGORY_GROUPS.map((group) => ({
    ...group,
    cover: topBy(
      catalog.filter((p) => group.categories.includes(p.category)),
      (p) => p.rating,
      1
    )[0],
  }));

  return (
    <div className="space-y-14">
      <title>FakeShop – a demo online store</title>

      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-brand-600 via-brand-700 to-zinc-900 px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-xl">
          <p className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
            Demo store · nothing is for sale
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Everything you want. Nothing you pay for.
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Browse {catalog.length} products in {CATEGORY_GROUPS.length}{' '}
            departments, fill your cart and check out, all without spending a
            cent.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="btn bg-white text-zinc-900 hover:bg-zinc-100"
            >
              Shop now
              <LuArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/products?sale=1&sort=discount"
              className="btn text-white ring-1 ring-white/50 ring-inset hover:bg-white/10"
            >
              Today's deals
            </Link>
          </div>
        </div>
        <div
          className="pointer-events-none absolute top-1/2 right-6 hidden -translate-y-1/2 lg:flex"
          aria-hidden="true"
        >
          {heroProducts.map((product, index) => (
            <div
              key={product.id}
              className={`-ml-10 size-52 rounded-3xl bg-white/95 p-4 shadow-2xl ${['-rotate-6 translate-y-6', 'z-10 -translate-y-4', 'rotate-6 translate-y-8'][index]}`}
            >
              <img
                src={product.thumbnail}
                alt=""
                className="size-full object-contain"
              />
            </div>
          ))}
        </div>
      </section>

      <ul className="grid gap-4 sm:grid-cols-3">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="card flex items-center gap-4 p-5 sm:flex-col sm:items-start lg:flex-row lg:items-center"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      <section aria-labelledby="departments" className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 id="departments" className="text-xl font-bold sm:text-2xl">
            Shop by department
          </h2>
          <Link to="/categories" className="link text-sm">
            All categories
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
          {groupCovers.map((group) => (
            <li key={group.slug}>
              <Link
                to={`/categories#${group.slug}`}
                className="card group flex flex-col items-center gap-3 p-4 text-center transition-shadow hover:shadow-lg"
              >
                {group.cover && (
                  <span className="image-tile flex aspect-square w-full items-center justify-center rounded-xl p-3">
                    <img
                      src={group.cover.thumbnail}
                      alt=""
                      loading="lazy"
                      className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </span>
                )}
                <span className="text-sm font-semibold">{group.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ProductRail
        title="Today's deals"
        products={deals}
        action={
          <Link
            to="/products?sale=1&sort=discount"
            className="link mr-2 text-sm"
          >
            See all
          </Link>
        }
      />

      <section className="card flex flex-col items-start justify-between gap-4 bg-zinc-900 p-6 text-white ring-0 sm:flex-row sm:items-center sm:p-8 dark:bg-zinc-800">
        <div>
          <h2 className="text-xl font-bold">10% off your first fake order</h2>
          <p className="mt-1 text-zinc-300">
            Enter{' '}
            <span className="font-mono font-semibold text-white">
              {PROMO_CODE}
            </span>{' '}
            in your cart. It works every time, because it is not real.
          </p>
        </div>
        <button
          type="button"
          className="btn bg-white text-zinc-900 hover:bg-zinc-100"
          onClick={copyPromoCode}
        >
          <LuCopy className="size-4" aria-hidden="true" />
          Copy code
        </button>
      </section>

      <ProductRail
        title="Top rated"
        products={topRated}
        action={
          <Link to="/products?sort=rating" className="link mr-2 text-sm">
            See all
          </Link>
        }
      />

      <ProductRail title="Recently viewed" products={recent} />
    </div>
  );
}
