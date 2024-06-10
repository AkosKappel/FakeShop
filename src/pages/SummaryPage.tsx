import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useCart } from '../hooks/CartHooks';
import { formatPrice } from '../utils/helpers';

const SummaryPage = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const { shippingAddress, paymentMethod } = location.state || {};

  const handlePlaceOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert('Order placed!');
    navigate('/home');
  };

  return (
    <div className="flex justify-center">
      <div className="p-4 m-8 bg-white shadow rounded-md space-y-4 max-w-2xl">
        <h1 className="text-2xl font-bold text-center my-2">Order Summary</h1>
        <section className="text-lg">
          <h2 className="font-bold">Items</h2>
          {cart.items.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center space-x-12"
            >
              <p className="my-0.5">
                {product.title}
                <span className="ml-2 text-gray-400">
                  {' '}
                  x {product.quantity}
                </span>
              </p>
              <p>{formatPrice(product.price * product.quantity)}</p>
            </div>
          ))}
        </section>

        <section className="text-lg">
          <h2 className="font-bold">Shipping</h2>
          <p>{shippingAddress}</p>
        </section>

        <section className="text-lg">
          <h2 className="font-bold">Payment</h2>
          <p>{paymentMethod}</p>
        </section>

        <section className="flex justify-between text-lg font-bold">
          <p>Total</p>
          <p>{formatPrice(cart.totalPrice)}</p>
        </section>

        <section className="flex justify-between">
          <Link
            to="/checkout"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Back to Checkout
          </Link>
          <button
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </section>
      </div>
    </div>
  );
};

export default SummaryPage;
