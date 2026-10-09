import { useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import {
  LuChevronDown,
  LuHeart,
  LuMenu,
  LuMoon,
  LuShoppingBag,
  LuSun,
  LuX,
} from 'react-icons/lu';

import Logo from './Logo';
import SearchBox from './SearchBox';
import { useCart } from '../lib/cart';
import { CATEGORY_GROUPS, categoryName } from '../lib/catalog';
import { pluralize } from '../lib/format';
import { useCompare, useWishlist } from '../lib/lists';
import { setTheme, useTheme } from '../lib/theme';

const NAV_LINKS = [
  { to: '/products', label: 'All products' },
  { to: '/products?sale=1&sort=discount', label: 'Deals' },
  { to: '/products?sort=rating', label: 'Top rated' },
  { to: '/about', label: 'About' },
];

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span
      key={count}
      className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 animate-[badge-pop_300ms_ease-out] items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white"
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

function ThemeToggle() {
  const theme = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="btn-icon"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'dark' ? (
        <LuSun className="size-5" />
      ) : (
        <LuMoon className="size-5" />
      )}
    </button>
  );
}

function CategoryLinks({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORY_GROUPS.map((group) => (
        <div key={group.slug}>
          <p className="mb-2 text-xs font-bold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
            {group.name}
          </p>
          <ul className="space-y-1">
            {group.categories.map((slug) => (
              <li key={slug}>
                <Link
                  to={`/category/${slug}`}
                  onClick={onNavigate}
                  className="block rounded-lg px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {categoryName(slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CategoryMenu() {
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // The popover lives in the top layer; place it under the button when it opens.
  const placePanel = () => {
    const panel = panelRef.current;
    const button = buttonRef.current;
    if (!panel || !button) return;
    const rect = button.getBoundingClientRect();
    panel.style.top = `${rect.bottom + 8}px`;
    panel.style.left = `${Math.max(16, rect.left)}px`;
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        popoverTarget="category-menu"
        onClick={placePanel}
        className="flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        Categories
        <LuChevronDown className="size-4" aria-hidden="true" />
      </button>
      <div
        ref={panelRef}
        id="category-menu"
        popover="auto"
        className="card fixed inset-auto m-0 w-[min(56rem,calc(100vw-2rem))] p-6 shadow-2xl"
      >
        <CategoryLinks onNavigate={() => panelRef.current?.hidePopover()} />
        <Link
          to="/categories"
          onClick={() => panelRef.current?.hidePopover()}
          className="link mt-6 inline-block text-sm"
        >
          Browse all categories
        </Link>
      </div>
    </>
  );
}

function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        className="btn-icon lg:hidden"
        onClick={() => dialogRef.current?.showModal()}
        aria-label="Open menu"
      >
        <LuMenu className="size-6" />
      </button>
      <dialog
        ref={dialogRef}
        aria-label="Menu"
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === event.currentTarget) close();
        }}
        className="m-0 h-dvh max-h-none w-[min(22rem,88vw)] bg-white p-0 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
            <Logo />
            <button
              type="button"
              className="btn-icon"
              onClick={close}
              aria-label="Close menu"
            >
              <LuX className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-4">
            <ul className="mb-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={close}
                    className="block rounded-lg px-2 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/compare"
                  onClick={close}
                  className="block rounded-lg px-2 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Compare
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  onClick={close}
                  className="block rounded-lg px-2 py-2 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Your orders
                </Link>
              </li>
            </ul>
            <p className="mb-3 px-2 text-sm font-bold">Categories</p>
            <div className="px-2">
              <CategoryLinks onNavigate={close} />
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}

export default function Header() {
  const { count } = useCart();
  const wishlistCount = useWishlist().length;
  const compareCount = useCompare().length;
  const { pathname, search } = useLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4">
        <MobileMenu />
        <Logo />
        <div className="mx-4 hidden max-w-xl flex-1 md:block">
          <SearchBox />
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Link
            to="/wishlist"
            className="btn-icon relative"
            aria-label={`Wishlist, ${pluralize(wishlistCount, 'item', 'items')}`}
          >
            <LuHeart className="size-5" />
            <CountBadge count={wishlistCount} />
          </Link>
          <Link
            to="/cart"
            className="btn-icon relative"
            aria-label={`Cart, ${pluralize(count, 'item', 'items')}`}
          >
            <LuShoppingBag className="size-5" />
            <CountBadge count={count} />
          </Link>
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <SearchBox />
      </div>
      <nav
        aria-label="Main"
        className="mx-auto hidden h-11 max-w-7xl items-center gap-1 px-2 text-sm lg:flex"
      >
        <CategoryMenu />
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            aria-current={pathname + search === link.to ? 'page' : undefined}
            className="rounded-full px-3 py-1.5 font-semibold hover:bg-zinc-100 aria-[current=page]:text-brand-700 dark:hover:bg-zinc-800 dark:aria-[current=page]:text-brand-400"
          >
            {link.label}
          </Link>
        ))}
        {compareCount > 0 && (
          <NavLink
            to="/compare"
            className="ml-auto rounded-full px-3 py-1.5 font-semibold text-zinc-600 hover:bg-zinc-100 aria-[current=page]:text-brand-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:aria-[current=page]:text-brand-400"
          >
            Compare ({compareCount})
          </NavLink>
        )}
        <NavLink
          to="/orders"
          className={`${compareCount > 0 ? '' : 'ml-auto'} rounded-full px-3 py-1.5 font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800`}
        >
          Your orders
        </NavLink>
      </nav>
    </header>
  );
}
