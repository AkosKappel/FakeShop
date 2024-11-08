import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaShippingFast,
  FaCreditCard,
  FaMapMarkerAlt,
  FaCheckCircle,
} from 'react-icons/fa';

import { useCart } from '../hooks/CartHooks';
import { formatPrice } from '../utils/helpers';

const SummaryPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const orderState = location.state || {};

  const handlePlaceOrder = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert('Order placed successfully!');
    clearCart();
    navigate('/home');
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-2xl p-6 bg-white shadow-lg rounded-lg space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800">
          Order Summary
        </h1>

        {/* Items Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FaCheckCircle className="text-green-500" />
            <span>Items</span>
          </h2>
          {cart.items.map((product) => (
            <div key={product.id} className="flex justify-between items-center">
              <p className="text-gray-700">
                {product.title}
                <span className="text-gray-400"> x {product.quantity}</span>
              </p>
              <p className="font-semibold">
                {formatPrice(product.discountPrice * product.quantity)}
              </p>
            </div>
          ))}
        </section>

        {/* Shipping Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FaMapMarkerAlt className="text-blue-500" />
            <span>Shipping</span>
          </h2>
          <p className="text-gray-700">{orderState.fullName}</p>
          <p className="text-gray-700">
            {orderState.address}, {orderState.city}, {orderState.country}
          </p>
        </section>

        {/* Payment Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FaCreditCard className="text-yellow-500" />
            <span>Payment</span>
          </h2>
          <p className="text-gray-700">{orderState.cardNumber}</p>
          <p className="text-gray-700">{orderState.expiryDate}</p>
        </section>

        {/* Delivery Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <FaShippingFast className="text-pink-500" />
            <span>Delivery</span>
          </h2>
          <p className="text-gray-700">{orderState.deliveryMethod}</p>
        </section>

        {/* Total Section */}
        <section className="flex justify-between text-lg font-bold text-gray-800">
          <p>Total</p>
          <p>{formatPrice(cart.totalPrice)}</p>
        </section>

        {/* Actions Section */}
        <section className="flex justify-between space-x-4">
          <Link
            to="/checkout"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition-colors"
          >
            Back to Checkout
          </Link>
          <button
            onClick={handlePlaceOrder}
            title="Finalize and Confirm Order"
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105"
          >
            Place Order
          </button>
        </section>
      </div>
    </div>
  );
};

export default SummaryPage;
