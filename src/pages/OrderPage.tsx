import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { LuCircleCheck, LuCopy } from 'react-icons/lu';

import OrderDetails from '../components/OrderDetails';
import { deliveryWindow, useOrders } from '../lib/orders';
import { toast } from '../lib/toast';
import NotFoundPage from './NotFoundPage';

export default function OrderPage() {
  const { number } = useParams();
  const order = useOrders().find((o) => o.number === number);
  const [openedAt] = useState(() => Date.now());

  if (!order) return <NotFoundPage what="order" />;

  const firstName = order.shipping.fullName.split(' ')[0];
  const isNew = openedAt - new Date(order.placedAt).getTime() < 10 * 60 * 1000;

  const copyNumber = () =>
    navigator.clipboard
      .writeText(order.number)
      .then(() => toast('Order number copied'))
      .catch(() => toast('Could not copy the order number'));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <title>{`Order ${order.number} | FakeShop`}</title>
      <div className="card flex flex-col items-center px-6 py-10 text-center">
        <LuCircleCheck
          className="mb-4 size-14 text-emerald-500"
          aria-hidden="true"
        />
        <h1 className="text-3xl font-extrabold tracking-tight">
          {isNew ? `Thank you, ${firstName}!` : `Order ${order.number}`}
        </h1>
        <p className="mt-2 max-w-md text-zinc-600 dark:text-zinc-400">
          {isNew
            ? 'Your order is placed. Well, pretend-placed: this is a demo, so nothing was charged and nothing will ship.'
            : 'A demo order, kept in this browser only.'}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <p>
            Order number <strong className="font-mono">{order.number}</strong>
            <button
              type="button"
              className="btn-icon ml-1 size-8 align-middle"
              onClick={copyNumber}
              aria-label="Copy order number"
            >
              <LuCopy className="size-4" />
            </button>
          </p>
          <p>
            Expected <strong>{deliveryWindow(order)}</strong>
          </p>
        </div>
      </div>
      <section className="card p-5 sm:p-6" aria-labelledby="details-heading">
        <h2 id="details-heading" className="mb-4 text-lg font-bold">
          Order details
        </h2>
        <OrderDetails order={order} />
      </section>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/products" className="btn-primary">
          Continue shopping
        </Link>
        <Link to="/orders" className="btn-secondary">
          All your orders
        </Link>
      </div>
    </div>
  );
}
