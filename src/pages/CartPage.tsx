import { Link } from 'react-router-dom';
import { FaRegTrashAlt } from 'react-icons/fa';

import QuantityPicker from '../components/QuantityPicker';
import { useCart } from '../hooks/CartHooks';
import { CartItem } from '../types/Cart.interface';
import { formatPrice } from '../utils/helpers';

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const handleIncreaseQuantity = (item: CartItem) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecreaseQuantity = (item: CartItem) => {
    removeFromCart(item.id, 1);
  };

  const handleClearCart = () => {
    const confirmClear = window.confirm(
      'Are you sure you want to remove all items from your cart?'
    );
    if (confirmClear) clearCart();
  };

  return (
    <div className="container mx-auto">
      <div className="h-12"></div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mx-4 my-2">My Shopping Cart</h1>
        {cart.totalQuantity > 0 && (
          <button
            onClick={handleClearCart}
            className="rounded-md text-white px-4 py-2 mx-4 bg-pink-700 hover:bg-pink-800"
          >
            Remove All
          </button>
        )}
      </div>
      <div className="mt-4">
        {cart.totalQuantity === 0 ? (
          <div>
            <p className="text-center text-gray-600">Your cart is empty.</p>
            <div className="h-16"></div>
            <div className="flex justify-center">
              <Link
                to="/products"
                className="rounded-md text-white px-4 py-2 bg-pink-700 hover:bg-pink-800"
              >
                Continue Shopping
              </Link>
              <div className="w-4"></div>
              <Link
                to="/"
                className="rounded-md bg-gray-300 text-gray-800 px-4 py-2 hover:bg-gray-400"
              >
                Go to Home Page
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-white p-4 rounded-md shadow-md min-h-36 sm:flex-row flex-col"
              >
                <Link to={`/products/${item.id}`}>
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-32 h-32 object-contain rounded-md"
                    />
                    <div className="ml-4 max-w-xs lg:max-w-xl">
                      <h2 className="text-lg font-semibold wrap">
                        {item.title}
                      </h2>
                      <p className="text-gray-600">
                        {formatPrice(item.discountPrice)}
                      </p>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center justify-between space-x-3 mt-3 mx-2 md:w-1/3 sm:w-2/3 w-4/5">
                  <QuantityPicker
                    quantity={item.quantity}
                    onIncrement={() => handleIncreaseQuantity(item)}
                    onDecrement={() => handleDecreaseQuantity(item)}
                  />
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {formatPrice(item.discountPrice * item.quantity)}
                    </p>
                  </div>
                  <FaRegTrashAlt
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeFromCart(item.id, item.quantity)}
                  />
                </div>
              </div>
            ))}
            <div className="text-right m-4">
              <p className="text-lg font-bold">
                Total: {formatPrice(cart.totalPrice)}
              </p>
              <p className="text-lg font-bold">
                Quantity: {cart.totalQuantity}
              </p>
              <div className="flex justify-end space-x-4 my-6">
                <Link to="/products">
                  <button className="rounded-md bg-gray-300 text-gray-800 px-4 py-2 my-2 hover:bg-gray-400">
                    Continue Shopping
                  </button>
                </Link>
                <Link to="/checkout">
                  <button className="rounded-md bg-pink-700 hover:bg-pink-800 text-white px-4 py-2 my-2">
                    Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
