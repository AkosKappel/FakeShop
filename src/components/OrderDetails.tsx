import { Link } from 'react-router';

import OrderSummary from './OrderSummary';
import { DELIVERY_METHODS } from '../lib/checkout';
import { flagEmoji, formatPrice } from '../lib/format';
import { deliveryWindow, type Order } from '../lib/orders';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export default function OrderDetails({ order }: { order: Order }) {
  const { shipping } = order;
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_20rem]">
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {order.lines.map((line) => (
          <li key={line.id} className="flex items-center gap-4 py-3 first:pt-0">
            <span className="image-tile size-16 shrink-0 rounded-xl">
              <img
                src={line.thumbnail}
                alt=""
                className="size-full object-contain p-1.5"
              />
            </span>
            <span className="min-w-0 flex-1">
              <Link
                to={`/products/${line.id}`}
                className="line-clamp-2 font-medium hover:underline"
              >
                {line.title}
              </Link>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {line.quantity} × {formatPrice(line.price)}
              </span>
            </span>
            <span className="font-semibold">
              {formatPrice(line.price * line.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="space-y-5 text-sm">
        <div>
          <h3 className="mb-1 font-bold">Delivery address</h3>
          <address className="text-zinc-700 not-italic dark:text-zinc-300">
            {shipping.fullName}
            <br />
            {shipping.address}
            <br />
            {shipping.zip} {shipping.city}
            <br />
            {flagEmoji(shipping.country)}{' '}
            {regionNames.of(shipping.country) ?? shipping.country}
          </address>
        </div>
        <div>
          <h3 className="mb-1 font-bold">Delivery</h3>
          <p className="text-zinc-700 dark:text-zinc-300">
            {DELIVERY_METHODS[order.delivery].label}, expected{' '}
            {deliveryWindow(order)}
          </p>
        </div>
        <div>
          <h3 className="mb-1 font-bold">Payment</h3>
          <p className="font-mono text-zinc-700 dark:text-zinc-300">
            •••• {order.cardLast4}
          </p>
        </div>
        <OrderSummary
          totals={order.totals}
          promoCode={order.promoCode}
          shippingLabel={`${DELIVERY_METHODS[order.delivery].label} delivery`}
        />
      </div>
    </div>
  );
}
