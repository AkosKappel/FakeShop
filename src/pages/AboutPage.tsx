import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { IconType } from 'react-icons';
import {
  LuFilter,
  LuGithub,
  LuGlobe,
  LuHeart,
  LuLinkedin,
  LuMoon,
  LuPackage,
  LuRefreshCw,
  LuSearch,
  LuShieldCheck,
  LuShoppingBag,
  LuSmartphone,
  LuTag,
} from 'react-icons/lu';

import { LogoMark } from '../components/Logo';
import { dependencies, devDependencies } from '../../package.json';

type PackageName = keyof typeof dependencies | keyof typeof devDependencies;

function version(name: PackageName): string {
  const range =
    (dependencies as Record<string, string>)[name] ??
    (devDependencies as Record<string, string>)[name];
  return range.replace(/^[\^~]/, '').split('.')[0];
}

const FEATURES: { icon: IconType; title: string; text: string }[] = [
  {
    icon: LuSearch,
    title: 'Instant search',
    text: 'Search 190+ products by name, brand or category, with suggestions as you type.',
  },
  {
    icon: LuFilter,
    title: 'Filters you can share',
    text: 'Sort and filter by price, rating, brand, stock and sale. Every filter lives in the URL.',
  },
  {
    icon: LuShoppingBag,
    title: 'Cart with undo',
    text: 'Stock-aware quantities, free-delivery progress, promo codes and undo on remove.',
  },
  {
    icon: LuShieldCheck,
    title: 'Realistic checkout',
    text: 'Browser autofill, card number checksum, expiry checks and delivery dates in business days.',
  },
  {
    icon: LuHeart,
    title: 'Wishlist and history',
    text: 'Save products for later, see what you viewed recently and revisit past orders.',
  },
  {
    icon: LuRefreshCw,
    title: 'Synced tabs',
    text: 'Add something in one tab and every other open tab updates right away.',
  },
  {
    icon: LuMoon,
    title: 'Dark mode',
    text: 'Follows your system setting, or pick one yourself. No flash on load.',
  },
  {
    icon: LuSmartphone,
    title: 'Made for every screen',
    text: 'Swipeable product rows, a filter drawer and a sticky add-to-cart bar on phones.',
  },
];

const STACK: { name: string; version?: PackageName; why: string }[] = [
  {
    name: 'React',
    version: 'react',
    why: 'Components, Suspense with use() for streaming product data, and native <title> tags.',
  },
  {
    name: 'React Router',
    version: 'react-router',
    why: 'Route loaders fetch data before a page renders, with error pages and scroll restoration built in.',
  },
  {
    name: 'TypeScript',
    version: 'typescript',
    why: 'Typed API responses, cart and order models.',
  },
  {
    name: 'Tailwind CSS',
    version: 'tailwindcss',
    why: 'Design tokens in CSS, dark mode and a handful of shared component classes.',
  },
  {
    name: 'React Hook Form',
    version: 'react-hook-form',
    why: 'Checkout validation without re-rendering the whole form on every key press.',
  },
  {
    name: 'Vite',
    version: 'vite',
    why: 'Fast dev server and an optimised static build for GitHub Pages.',
  },
  {
    name: 'Vitest and Playwright',
    why: 'Unit tests for prices, cart and checkout rules; end-to-end tests of the whole purchase, with accessibility checks.',
  },
  {
    name: 'GitHub Actions',
    why: 'Lint, typecheck and tests on every push; deploys to GitHub Pages only when they pass.',
  },
];

const CHANGELOG = [
  {
    date: '2024-06',
    text: 'First version: React 18, 20 products from Fake Store API, cart and a simple checkout.',
  },
  {
    date: '2026-10',
    text: 'Rebuilt: 194 products from DummyJSON, search, filters, wishlist, order history, new design with dark mode, accessibility pass, tests and CI.',
  },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-32">
      <h2 id={`${id}-heading`} className="mb-5 text-2xl font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16">
      <title>About | FakeShop</title>

      <header className="text-center">
        <LogoMark className="mx-auto mb-5 size-16" />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          About FakeShop
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          FakeShop is a demo online store: a portfolio project that shows how a
          modern shop front works, from search and filters to a full checkout.
          It looks real, but nothing is for sale.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: 'What is real',
            items: [
              'The interface, search, filters and sorting',
              'Cart, promo code and price calculations',
              'Checkout validation and order history',
            ],
            tone: 'text-emerald-700 dark:text-emerald-400',
          },
          {
            title: 'What is pretend',
            items: [
              'Products, prices and reviews (from DummyJSON)',
              'Payments: no card is ever charged',
              'Delivery: nothing ships, ever',
            ],
            tone: 'text-brand-700 dark:text-brand-400',
          },
          {
            title: 'Where your data goes',
            items: [
              'Nowhere. Cart, wishlist and orders stay in this browser (localStorage)',
              'Card details are never saved, only the last 4 digits of an order',
              'No accounts, no cookies, no tracking',
            ],
            tone: 'text-sky-700 dark:text-sky-400',
          },
        ].map((column) => (
          <div key={column.title} className="card p-6">
            <h2 className={`mb-3 font-bold ${column.tone}`}>{column.title}</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              {column.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Section id="features" title="What you can do">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card p-5">
              <Icon
                className="mb-3 size-6 text-brand-600 dark:text-brand-400"
                aria-hidden="true"
              />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="demo" title="Demo tips">
        <div className="card divide-y divide-zinc-200 dark:divide-zinc-800">
          {[
            {
              icon: LuTag,
              text: (
                <>
                  Promo codes: <strong className="font-mono">FAKE10</strong> for
                  10% off, <strong className="font-mono">FREESHIP</strong> for
                  free delivery. Enter them in the{' '}
                  <Link to="/cart" className="link">
                    cart
                  </Link>
                  .
                </>
              ),
            },
            {
              icon: LuShieldCheck,
              text: (
                <>
                  Test card:{' '}
                  <strong className="font-mono">4242 4242 4242 4242</strong>,
                  any future expiry date and any 3-digit code. Other numbers
                  must pass the same checksum real cards use.
                </>
              ),
            },
            {
              icon: LuSearch,
              text: (
                <>
                  Try searching for{' '}
                  <Link to="/products?q=apple" className="link">
                    apple
                  </Link>
                  , then narrow it down with the price and brand filters, and
                  share the URL.
                </>
              ),
            },
            {
              icon: LuRefreshCw,
              text: 'Open the shop in two tabs and add something to the cart in one of them.',
            },
            {
              icon: LuPackage,
              text: (
                <>
                  Place an order, then find it again under{' '}
                  <Link to="/orders" className="link">
                    Your orders
                  </Link>
                  .
                </>
              ),
            },
          ].map(({ icon: Icon, text }, index) => (
            <p key={index} className="flex gap-4 p-5 text-sm sm:text-base">
              <Icon
                className="mt-0.5 size-5 shrink-0 text-brand-600 dark:text-brand-400"
                aria-hidden="true"
              />
              <span>{text}</span>
            </p>
          ))}
        </div>
      </Section>

      <Section id="tech" title="How it is built">
        <p className="mb-5 max-w-3xl text-zinc-700 dark:text-zinc-300">
          A single-page app with no backend of its own. The product catalog
          (about 8 kB compressed) is fetched once from the free{' '}
          <a
            href="https://dummyjson.com/docs/products"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            DummyJSON API
          </a>{' '}
          and cached, so search, filters and paging run instantly in the
          browser. Product pages load their details on demand and show a
          skeleton meanwhile. Cart, wishlist, orders and theme live in small
          stores saved to localStorage.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {STACK.map((item) => (
            <li key={item.name} className="card p-5">
              <h3 className="flex items-baseline gap-2 font-semibold">
                {item.name}
                {item.version && (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    v{version(item.version)}
                  </span>
                )}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {item.why}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="changelog" title="Changelog">
        <ol className="space-y-4 border-l-2 border-zinc-200 pl-6 dark:border-zinc-800">
          {CHANGELOG.map((entry) => (
            <li key={entry.date} className="relative">
              <span
                className="absolute top-1.5 -left-[1.95rem] size-3 rounded-full bg-brand-600"
                aria-hidden="true"
              />
              <p className="font-mono text-sm font-semibold">{entry.date}</p>
              <p className="text-zinc-700 dark:text-zinc-300">{entry.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="author" title="Who made it">
        <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-lg font-bold">Ákos Kappel</p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Full stack developer. FakeShop is one of the projects in my
              portfolio; the source code is open on GitHub.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/AkosKappel/FakeShop"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <LuGithub className="size-4" aria-hidden="true" />
              Source code
            </a>
            <a
              href="https://portfolio-taupe-eta-51.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <LuGlobe className="size-4" aria-hidden="true" />
              Portfolio
            </a>
            <a
              href="https://www.linkedin.com/in/%C3%A1kos-kappel-b53344220/"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              <LuLinkedin className="size-4" aria-hidden="true" />
              LinkedIn
            </a>
          </div>
        </div>
      </Section>
    </div>
  );
}
