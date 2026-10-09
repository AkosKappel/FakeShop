import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import {
  LuArrowRight,
  LuShoppingBag,
  LuTag,
  LuTrash2,
  LuX,
} from 'react-icons/lu';

import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import OrderSummary from '../components/OrderSummary';
import QuantityPicker from '../components/QuantityPicker';
import { cart, useCart, type CartLine } from '../lib/cart';
import {
  FREE_SHIPPING_THRESHOLD,
  findPromo,
  orderTotals,
  promoStore,
} from '../lib/checkout';
import { formatPrice, pluralize } from '../lib/format';
import { useStore } from '../lib/store';
import { toast } from '../lib/toast';

function removeWithUndo(line: CartLine, index: number) {
  cart.remove(line.id);
  toast(`${line.title} removed from your cart`, {
    label: 'Undo',
    onClick: () => cart.restore(line, index),
  });
}

function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const missing = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);
  return (
    <div className="space-y-2">
      <p className="text-sm">
        {missing > 0 ? (
          <>
            Add <strong>{formatPrice(missing)}</strong> more for free standard
            delivery.
          </>
        ) : (
          <strong className="text-emerald-700 dark:text-emerald-400">
            Your order qualifies for free standard delivery.
          </strong>
        )}
      </p>
      <div
        className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
        role="progressbar"
        aria-label="Progress to free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

function PromoCodeForm() {
  const applied = useStore(promoStore);
  const [error, setError] = useState('');

  const apply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = String(new FormData(event.currentTarget).get('code'));
    const promo = findPromo(code);
    if (!promo) {
      setError('This code is not valid. Try FAKE10 or FREESHIP.');
      return;
    }
    setError('');
    promoStore.set(promo.code);
    toast(`Code ${promo.code} applied: ${promo.description.toLowerCase()}`);
  };

  if (applied) {
    return (
      <p className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        <span className="flex items-center gap-2">
          <LuTag className="size-4" aria-hidden="true" />
          <span>
            <strong>{applied}</strong> · {findPromo(applied)?.description}
          </span>
        </span>
        <button
          type="button"
          className="cursor-pointer rounded-full p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900"
          onClick={() => promoStore.set(null)}
          aria-label={`Remove promo code ${applied}`}
        >
          <LuX className="size-4" />
        </button>
      </p>
    );
  }

  return (
    <form onSubmit={apply} noValidate>
      <label htmlFor="promo-code" className="mb-1 block text-sm font-medium">
        Promo code
      </label>
      <div className="flex gap-2">
        <input
          id="promo-code"
          name="code"
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="FAKE10"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'promo-error' : undefined}
          className="field uppercase placeholder:normal-case"
        />
        <button type="submit" className="btn-secondary">
          Apply
        </button>
      </div>
      {error && (
        <p
          id="promo-error"
          className="mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </form>
  );
}

export default function CartPage() {
  const { lines, count } = useCart();
  const promoCode = useStore(promoStore);
  const totals = orderTotals(lines, 'standard', promoCode ?? undefined);

  return (
    <>
      <title>{`Cart (${count}) | FakeShop`}</title>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cart' }]} />
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">
        Your cart
        {count > 0 && (
          <span className="ml-3 text-lg font-medium text-zinc-500 dark:text-zinc-400">
            {pluralize(count, 'item', 'items')}
          </span>
        )}
      </h1>

      {lines.length === 0 ? (
        <EmptyState
          icon={LuShoppingBag}
          title="Your cart is empty"
          actions={
            <>
              <Link to="/products" className="btn-primary">
                Start shopping
              </Link>
              <Link to="/wishlist" className="btn-secondary">
                Open your wishlist
              </Link>
            </>
          }
        >
          <p>
            Find something you like. It is all free, because none of it is real.
          </p>
        </EmptyState>
      ) : (
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
          <ul className="card divide-y divide-zinc-200 dark:divide-zinc-800">
            {lines.map((line, index) => (
              <li key={line.id} className="flex gap-4 p-4 sm:p-5">
                <Link
                  to={`/products/${line.id}`}
                  className="image-tile size-24 shrink-0 overflow-hidden rounded-xl sm:size-28"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <img
                    src={line.thumbnail}
                    alt=""
                    className="size-full object-contain p-2"
                  />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        to={`/products/${line.id}`}
                        className="line-clamp-2 font-semibold hover:underline"
                      >
                        {line.title}
                      </Link>
                      <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
                        {formatPrice(line.price)}
                        {line.listPrice > line.price && (
                          <span className="ml-2 line-through">
                            {formatPrice(line.listPrice)}
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="font-bold">
                      {formatPrice(line.price * line.quantity)}
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <QuantityPicker
                      quantity={line.quantity}
                      stock={line.stock}
                      onChange={(quantity) =>
                        cart.setQuantity(line.id, quantity)
                      }
                      label={`Quantity of ${line.title}`}
                    />
                    <button
                      type="button"
                      className="btn-icon text-zinc-500 hover:text-red-600"
                      onClick={() => removeWithUndo(line, index)}
                      aria-label={`Remove ${line.title} from cart`}
                      title="Remove"
                    >
                      <LuTrash2 className="size-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside
            aria-label="Order summary"
            className="card space-y-5 p-5 lg:sticky lg:top-32"
          >
            <h2 className="text-lg font-bold">Order summary</h2>
            <FreeShippingProgress subtotal={totals.subtotal} />
            <PromoCodeForm />
            <OrderSummary
              totals={totals}
              promoCode={promoCode}
              shippingLabel="Standard delivery"
            />
            <Link to="/checkout" className="btn-primary w-full">
              Go to checkout
              <LuArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link to="/products" className="link block text-center text-sm">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </>
  );
}
