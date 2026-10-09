import type { OrderTotals } from '../lib/checkout';
import { formatPrice } from '../lib/format';

interface OrderSummaryProps {
  totals: OrderTotals;
  promoCode?: string | null;
  shippingLabel?: string;
}

export default function OrderSummary({
  totals,
  promoCode,
  shippingLabel = 'Delivery',
}: OrderSummaryProps) {
  const row = 'flex justify-between gap-4';
  return (
    <div className="space-y-2 text-sm">
      <dl className="space-y-2">
        <div className={row}>
          <dt className="text-zinc-600 dark:text-zinc-400">Subtotal</dt>
          <dd className="font-medium">{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className={row}>
            <dt className="text-zinc-600 dark:text-zinc-400">
              Promo code {promoCode}
            </dt>
            <dd className="font-medium text-emerald-700 dark:text-emerald-400">
              −{formatPrice(totals.discount)}
            </dd>
          </div>
        )}
        <div className={row}>
          <dt className="text-zinc-600 dark:text-zinc-400">{shippingLabel}</dt>
          <dd className="font-medium">
            {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
          </dd>
        </div>
        <div
          className={`${row} border-t border-zinc-200 pt-3 text-base dark:border-zinc-800`}
        >
          <dt className="font-bold">Total</dt>
          <dd className="font-bold">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      {totals.savings > 0 && (
        <p className="text-right text-sm font-medium text-emerald-700 dark:text-emerald-400">
          You save {formatPrice(totals.savings)} on sale prices
        </p>
      )}
    </div>
  );
}
