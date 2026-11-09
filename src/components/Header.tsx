import { useEffect, useEffectEvent, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import {
  LuChevronDown,
  LuHeart,
  LuMenu,
  LuMoon,
  LuShoppingBag,
  LuSun,
  LuUser,
  LuX,
} from 'react-icons/lu';

import CommandPalette from './CommandPalette';
import Logo from './Logo';
import SearchBox from './SearchBox';
import { useSession } from '../lib/auth';
import { cartAdded, cartStore, useCart } from '../lib/cart';
import { CATEGORY_GROUPS, categoryName } from '../lib/catalog';
import { formatPrice, pluralize } from '../lib/format';
import { useCompare, useWishlist } from '../lib/lists';
import { NAV_LINKS } from '../lib/navigation';
import { setTheme, useTheme } from '../lib/theme';

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

const MINI_CART_LINES = 4;

/**
 * The header cart link with a preview popover: opens on mouse hover (with a
 * short delay either way, so passing over it does nothing) and on keyboard
 * focus, and flashes after an add. Touch has no hover, so a tap simply follows
 * the link to the cart.
 */
function MiniCart() {
  const { lines, count, subtotal, savings } = useCart();
  const { pathname } = useLocation();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(undefined);
  // The cart and checkout pages already show everything the preview would.
  const disabled = pathname === '/cart' || pathname === '/checkout';

  const open = () => {
    window.clearTimeout(timer.current);
    const panel = panelRef.current;
    const link = linkRef.current;
    if (!panel || !link || disabled || cartStore.get().length === 0) return;
    // The popover lives in the top layer; pin it under the link, right-aligned.
    const rect = link.getBoundingClientRect();
    panel.style.top = `${rect.bottom + 8}px`;
    panel.style.right = `${Math.max(16, document.documentElement.clientWidth - rect.right)}px`;
    if (!panel.matches(':popover-open')) panel.showPopover();
  };

  const close = () => {
    window.clearTimeout(timer.current);
    const panel = panelRef.current;
    if (panel?.matches(':popover-open')) panel.hidePopover();
  };

  const later = (action: () => void, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(action, delay);
  };

  const flash = useEffectEvent(() => {
    if (!matchMedia('(hover: hover)').matches) return;
    open();
    later(close, 3000);
  });
  useEffect(() => cartAdded.subscribe(flash), []);

  const onNavigate = useEffectEvent(close);
  useEffect(() => onNavigate(), [pathname]);

  return (
    <div
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') later(open, 150);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') later(close, 250);
      }}
      onFocus={() => window.clearTimeout(timer.current)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <Link
        ref={linkRef}
        to="/cart"
        className="btn-icon relative"
        aria-label={`Cart, ${pluralize(count, 'item', 'items')}`}
        onFocus={(event) => {
          // Only keyboard focus: a tap or click focuses the link too, but navigates.
          if (event.currentTarget.matches(':focus-visible')) open();
        }}
      >
        <LuShoppingBag className="size-5" />
        <CountBadge count={count} />
      </Link>
      <div
        ref={panelRef}
        popover="auto"
        role="region"
        aria-label="Cart preview"
        onToggle={(event) => {
          // Escape or an outside click hides it; don't leave focus inside.
          if (
            event.newState === 'closed' &&
            event.currentTarget.contains(document.activeElement)
          ) {
            linkRef.current?.focus();
          }
        }}
        onClick={(event) => {
          if ((event.target as Element).closest('a')) close();
        }}
        className="card fixed inset-auto m-0 w-80 max-w-[calc(100vw-2rem)] p-4 shadow-2xl"
      >
        <p className="font-bold">
          Your cart{' '}
          <span className="font-normal text-zinc-500 dark:text-zinc-400">
            ({pluralize(count, 'item', 'items')})
          </span>
        </p>
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {lines.slice(0, MINI_CART_LINES).map((line) => (
            <li key={line.id} className="flex items-center gap-3 py-3">
              <img
                src={line.thumbnail}
                alt=""
                width={56}
                height={56}
                className="image-tile size-14 shrink-0 rounded-lg object-contain"
              />
              <div className="min-w-0 flex-1 text-sm">
                <Link
                  to={`/products/${line.id}`}
                  className="line-clamp-2 font-semibold hover:underline"
                >
                  {line.title}
                </Link>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Qty {line.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">
                {formatPrice(line.price * line.quantity)}
              </p>
            </li>
          ))}
        </ul>
        {lines.length > MINI_CART_LINES && (
          <p className="pb-3 text-sm text-zinc-500 dark:text-zinc-400">
            and{' '}
            {pluralize(
              lines.length - MINI_CART_LINES,
              'more product',
              'more products'
            )}
          </p>
        )}
        <dl className="space-y-1 border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
          <div className="flex justify-between font-bold">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          {savings > 0 && (
            <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
              <dt>You save</dt>
              <dd>{formatPrice(savings)}</dd>
            </div>
          )}
        </dl>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to="/cart" className="btn-secondary">
            View cart
          </Link>
          <Link to="/checkout" className="btn-primary">
            Checkout
          </Link>
        </div>
      </div>
    </div>
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
  const wishlistCount = useWishlist().length;
  const compareCount = useCompare().length;
  const session = useSession();
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
          <CommandPalette />
          <ThemeToggle />
          <Link
            to="/account"
            className="btn-icon"
            aria-label={
              session ? `Account of ${session.user.firstName}` : 'Sign in'
            }
            title={session ? 'Your account' : 'Sign in'}
          >
            {session ? (
              <img
                src={session.user.image}
                alt=""
                className="size-7 rounded-full bg-zinc-200 ring-2 ring-brand-500 dark:bg-zinc-700"
              />
            ) : (
              <LuUser className="size-5" />
            )}
          </Link>
          <Link
            to="/wishlist"
            className="btn-icon relative"
            aria-label={`Wishlist, ${pluralize(wishlistCount, 'item', 'items')}`}
          >
            <LuHeart className="size-5" />
            <CountBadge count={wishlistCount} />
          </Link>
          <MiniCart />
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
