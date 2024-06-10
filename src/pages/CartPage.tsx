import { useCart } from '../hooks/CartHooks';
import { CartItem } from '../types/Cart.interface';

const CartPage = () => {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();

  const handleAddToCart = () => {
    const item: CartItem = {
      id: 1,
      title: 'Product 1',
      price: 10,
      quantity: 1,
      description: 'A sample product',
      category: 'Category 1',
      image: 'image_url',
      rating: {
        rate: 4.5,
        count: 10,
      },
    };

    addToCart(item);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(1, 1);
  };

  return (
    <div>
      <h1>Shopping Cart Page</h1>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleRemoveFromCart}>Remove from Cart</button>
      <button onClick={clearCart}>Clear Cart</button>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
};

export default CartPage;
