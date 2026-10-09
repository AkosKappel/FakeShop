import { useId, type ReactNode } from 'react';
import { useForm, useWatch, type FieldError } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { LuCheck, LuLock, LuShoppingBag } from 'react-icons/lu';

import EmptyState from '../components/EmptyState';
import OrderSummary from '../components/OrderSummary';
import { cart, useCart } from '../lib/cart';
import {
  DELIVERY_METHODS,
  addBusinessDays,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  isValidCardNumber,
  isValidCvv,
  isValidExpiry,
  orderTotals,
  promoStore,
  type DeliveryMethod,
} from '../lib/checkout';
import { formatPrice, formatShortDate } from '../lib/format';
import {
  addressStore,
  newOrderNumber,
  saveOrder,
  type ShippingAddress,
} from '../lib/orders';
import { useStore } from '../lib/store';

interface CheckoutForm extends ShippingAddress {
  delivery: DeliveryMethod;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const TEST_CARD = '4242 4242 4242 4242';

// Pseudo and grouping regions that Intl knows but nobody ships to.
const NOT_COUNTRIES = new Set(['EU', 'EZ', 'UN', 'QO', 'XA', 'XB', 'ZZ']);

function countryOptions(): { code: string; name: string }[] {
  const names = new Intl.DisplayNames(['en'], {
    type: 'region',
    fallback: 'none',
  });
  const options: { code: string; name: string }[] = [];
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      const name = names.of(code);
      if (name && !NOT_COUNTRIES.has(code)) options.push({ code, name });
    }
  }
  return options.sort((x, y) => x.name.localeCompare(y.name));
}

const COUNTRIES = countryOptions();

function defaultCountry(): string {
  try {
    const region = new Intl.Locale(navigator.language).maximize().region;
    if (region && COUNTRIES.some((c) => c.code === region)) return region;
  } catch {
    // Unknown locale, use the default below.
  }
  return 'US';
}

function Field({
  label,
  error,
  hint,
  className = '',
  children,
}: {
  label: string;
  error?: FieldError;
  hint?: string;
  className?: string;
  children: (props: {
    id: string;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
  }) => ReactNode;
}) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children({
        id,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {error ? (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {error.message}
        </p>
      ) : (
        hint && (
          <p
            id={`${id}-hint`}
            className="mt-1 text-xs text-zinc-500 dark:text-zinc-400"
          >
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function Steps() {
  const steps = ['Cart', 'Details', 'Confirmation'];
  return (
    <ol
      className="mb-8 flex items-center gap-2 text-sm font-medium"
      aria-label="Checkout steps"
    >
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-2">
          {index > 0 && (
            <span
              className="h-px w-6 bg-zinc-300 sm:w-12 dark:bg-zinc-700"
              aria-hidden="true"
            />
          )}
          <span
            aria-current={index === 1 ? 'step' : undefined}
            className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${index === 0 ? 'bg-emerald-600 text-white' : index === 1 ? 'bg-brand-600 text-white' : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
          >
            {index === 0 ? (
              <LuCheck className="size-4" aria-label="Done:" />
            ) : (
              index + 1
            )}
          </span>
          <span className={index === 2 ? 'text-zinc-500' : ''}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { lines } = useCart();
  const promoCode = useStore(promoStore) ?? undefined;
  const savedAddress = useStore(addressStore);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      fullName: '',
      address: '',
      city: '',
      zip: '',
      country: defaultCountry(),
      ...savedAddress,
      delivery: 'standard',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  });

  const delivery = useWatch({ control, name: 'delivery' });
  const totals = orderTotals(lines, delivery, promoCode);

  if (lines.length === 0) {
    return (
      <>
        <title>Checkout | FakeShop</title>
        <h1 className="sr-only">Checkout</h1>
        <EmptyState
          icon={LuShoppingBag}
          title="Your cart is empty"
          actions={
            <Link to="/products" className="btn-primary">
              Browse products
            </Link>
          }
        >
          <p>Add something to your cart before checking out.</p>
        </EmptyState>
      </>
    );
  }

  const onSubmit = (data: CheckoutForm) => {
    const shipping: ShippingAddress = {
      email: data.email.trim(),
      fullName: data.fullName.trim(),
      address: data.address.trim(),
      city: data.city.trim(),
      zip: data.zip.trim(),
      country: data.country,
    };
    const number = newOrderNumber();
    saveOrder({
      number,
      placedAt: new Date().toISOString(),
      lines,
      totals,
      promoCode,
      delivery: data.delivery,
      shipping,
      cardLast4: digitsOnly(data.cardNumber).slice(-4),
    });
    addressStore.set(shipping);
    cart.clear();
    promoStore.set(null);
    navigate(`/orders/${number}`, { replace: true });
  };

  const required = (label: string) => ({
    required: `Enter your ${label}`,
    validate: (value: string) => value.trim() !== '' || `Enter your ${label}`,
  });

  const section = 'card space-y-4 p-5 sm:p-6';
  const sectionTitle = 'text-lg font-bold';

  return (
    <>
      <title>Checkout | FakeShop</title>
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight">Checkout</h1>
      <Steps />
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]"
      >
        <div className="space-y-6">
          <section className={section} aria-labelledby="contact-heading">
            <h2 id="contact-heading" className={sectionTitle}>
              Contact and delivery address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Email"
                error={errors.email}
                hint="Only used on this page. No email is sent."
                className="sm:col-span-2"
              >
                {(props) => (
                  <input
                    {...props}
                    type="email"
                    autoComplete="email"
                    className="field"
                    {...register('email', {
                      required: 'Enter your email',
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: 'Enter a valid email, like name@example.com',
                      },
                    })}
                  />
                )}
              </Field>
              <Field
                label="Full name"
                error={errors.fullName}
                className="sm:col-span-2"
              >
                {(props) => (
                  <input
                    {...props}
                    autoComplete="name"
                    className="field"
                    {...register('fullName', required('full name'))}
                  />
                )}
              </Field>
              <Field
                label="Street address"
                error={errors.address}
                className="sm:col-span-2"
              >
                {(props) => (
                  <input
                    {...props}
                    autoComplete="street-address"
                    className="field"
                    {...register('address', required('street address'))}
                  />
                )}
              </Field>
              <Field label="City" error={errors.city}>
                {(props) => (
                  <input
                    {...props}
                    autoComplete="address-level2"
                    className="field"
                    {...register('city', required('city'))}
                  />
                )}
              </Field>
              <Field label="Postal code" error={errors.zip}>
                {(props) => (
                  <input
                    {...props}
                    autoComplete="postal-code"
                    className="field"
                    {...register('zip', {
                      ...required('postal code'),
                      pattern: {
                        value: /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/,
                        message: 'Enter a valid postal code',
                      },
                    })}
                  />
                )}
              </Field>
              <Field
                label="Country"
                error={errors.country}
                className="sm:col-span-2"
              >
                {(props) => (
                  <select
                    {...props}
                    autoComplete="country"
                    className="select-field"
                    {...register('country', { required: 'Choose a country' })}
                  >
                    {COUNTRIES.map(({ code, name }) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
          </section>

          <fieldset className={section}>
            <legend className={`${sectionTitle} float-left mb-4 w-full`}>
              Delivery method
            </legend>
            <div className="clear-both grid gap-3 sm:grid-cols-2">
              {(Object.keys(DELIVERY_METHODS) as DeliveryMethod[]).map(
                (key) => {
                  const method = DELIVERY_METHODS[key];
                  const cost = orderTotals(lines, key, promoCode).shipping;
                  const [from, to] = method.days.map((days) =>
                    formatShortDate(addBusinessDays(new Date(), days))
                  );
                  return (
                    <label
                      key={key}
                      className="flex cursor-pointer gap-3 rounded-xl p-4 ring-1 ring-zinc-300 has-checked:bg-brand-50 has-checked:ring-2 has-checked:ring-brand-600 dark:ring-zinc-700 dark:has-checked:bg-brand-950"
                    >
                      <input
                        type="radio"
                        value={key}
                        className="mt-1 size-4 accent-brand-600"
                        {...register('delivery')}
                      />
                      <span className="flex-1">
                        <span className="flex justify-between font-semibold">
                          {method.label}
                          <span>{cost === 0 ? 'Free' : formatPrice(cost)}</span>
                        </span>
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          Arrives {from} – {to}
                        </span>
                      </span>
                    </label>
                  );
                }
              )}
            </div>
          </fieldset>

          <section className={section} aria-labelledby="payment-heading">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 id="payment-heading" className={sectionTitle}>
                Payment
              </h2>
              <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <LuLock className="size-3.5" aria-hidden="true" />
                Demo only: nothing is charged or stored
              </p>
            </div>
            <p className="rounded-xl bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800">
              Use the test card{' '}
              <strong className="font-mono">{TEST_CARD}</strong>, any future
              date and any 3 digits.{' '}
              <button
                type="button"
                className="link cursor-pointer"
                onClick={() => {
                  setValue('cardNumber', TEST_CARD, { shouldValidate: true });
                  setValue(
                    'expiry',
                    formatExpiry(`12${(new Date().getFullYear() + 3) % 100}`),
                    { shouldValidate: true }
                  );
                  setValue('cvv', '123', { shouldValidate: true });
                }}
              >
                Fill it in
              </button>
            </p>
            <div className="grid gap-4 sm:grid-cols-4">
              <Field
                label="Card number"
                error={errors.cardNumber}
                className="sm:col-span-2"
              >
                {(props) => (
                  <input
                    {...props}
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="1234 1234 1234 1234"
                    className="field font-mono"
                    {...register('cardNumber', {
                      required: 'Enter your card number',
                      validate: (value) =>
                        isValidCardNumber(value) ||
                        'This card number is not valid',
                      onChange: (event) =>
                        setValue(
                          'cardNumber',
                          formatCardNumber(event.target.value)
                        ),
                    })}
                  />
                )}
              </Field>
              <Field label="Expiry (MM/YY)" error={errors.expiry}>
                {(props) => (
                  <input
                    {...props}
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    className="field font-mono"
                    {...register('expiry', {
                      required: 'Enter the expiry date',
                      validate: (value) =>
                        isValidExpiry(value) || 'Enter a future date as MM/YY',
                      onChange: (event) =>
                        setValue('expiry', formatExpiry(event.target.value)),
                    })}
                  />
                )}
              </Field>
              <Field label="CVC" error={errors.cvv}>
                {(props) => (
                  <input
                    {...props}
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength={4}
                    className="field font-mono"
                    {...register('cvv', {
                      required: 'Enter the 3 or 4 digit code',
                      validate: (value) =>
                        isValidCvv(value) || 'Enter the 3 or 4 digit code',
                    })}
                  />
                )}
              </Field>
            </div>
          </section>
        </div>

        <aside
          aria-label="Order summary"
          className="card space-y-5 p-5 lg:sticky lg:top-32"
        >
          <h2 className="text-lg font-bold">Order summary</h2>
          <ul className="max-h-72 space-y-3 overflow-y-auto pt-2 pr-2">
            {lines.map((line) => (
              <li key={line.id} className="flex items-center gap-3 text-sm">
                <span className="image-tile relative size-14 shrink-0 rounded-lg">
                  <img
                    src={line.thumbnail}
                    alt=""
                    className="size-full object-contain p-1"
                  />
                  <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-zinc-700 text-[11px] font-bold text-white">
                    {line.quantity}
                  </span>
                </span>
                <span className="line-clamp-2 flex-1">{line.title}</span>
                <span className="font-medium">
                  {formatPrice(line.price * line.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <OrderSummary
            totals={totals}
            promoCode={promoCode}
            shippingLabel={`${DELIVERY_METHODS[delivery].label} delivery`}
          />
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={isSubmitting}
          >
            <LuLock className="size-4" aria-hidden="true" />
            Place order · {formatPrice(totals.total)}
          </button>
          <Link to="/cart" className="link block text-center text-sm">
            Back to cart
          </Link>
        </aside>
      </form>
    </>
  );
}
