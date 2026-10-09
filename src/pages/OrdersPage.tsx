import { Link } from 'react-router';
import { LuPackage } from 'react-icons/lu';

import Breadcrumbs from '../components/Breadcrumbs';
import EmptyState from '../components/EmptyState';
import OrderDetails from '../components/OrderDetails';
import { formatDate, formatPrice, pluralize } from '../lib/format';
import { ordersStore, useOrders } from '../lib/orders';

export default function OrdersPage() {
  const orders = useOrders();

  const clearHistory = () => {
    if (window.confirm('Delete all demo orders from this browser?')) {
      ordersStore.set([]);
    }
  };

  return (
    <>
      <title>Your orders | FakeShop</title>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders' }]} />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Your orders
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Demo orders placed in this browser
          </p>
        </div>
        {orders.length > 0 && (
          <button
            type="button"
            className="btn-secondary"
            onClick={clearHistory}
          >
            Clear history
          </button>
        )}
      </div>
      {orders.length === 0 ? (
        <EmptyState
          icon={LuPackage}
          title="No orders yet"
          actions={
            <Link to="/products" className="btn-primary">
              Start shopping
            </Link>
          }
        >
          <p>
            Orders you place appear here, with their details and delivery dates.
          </p>
        </EmptyState>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.number}>
              <details className="card group">
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-x-6 gap-y-1 p-5 [&::-webkit-details-marker]:hidden">
                  <span>
                    <span className="block font-mono font-semibold">
                      {order.number}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {formatDate(order.placedAt)} ·{' '}
                      {pluralize(
                        order.lines.reduce(
                          (sum, line) => sum + line.quantity,
                          0
                        ),
                        'item',
                        'items'
                      )}
                    </span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="font-bold">
                      {formatPrice(order.totals.total)}
                    </span>
                    <span className="text-sm text-brand-700 group-open:hidden dark:text-brand-400">
                      Show details
                    </span>
                    <span className="hidden text-sm text-brand-700 group-open:inline dark:text-brand-400">
                      Hide details
                    </span>
                  </span>
                </summary>
                <div className="border-t border-zinc-200 p-5 dark:border-zinc-800">
                  <OrderDetails order={order} />
                  <Link
                    to={`/orders/${order.number}`}
                    className="link mt-4 inline-block text-sm"
                  >
                    Open order page
                  </Link>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
