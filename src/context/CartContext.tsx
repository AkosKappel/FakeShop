import { createContext, useReducer, ReactNode, useEffect } from 'react';
import {
  CartItem,
  CartState,
  CartContextProps,
  CartAction,
} from '../types/Cart.interface';
import { addProductDiscountPrice } from '../utils/dataFetch';

const initialCart: CartState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
};

export const CartContext = createContext<CartContextProps>({
  cart: initialCart,
  dispatch: () => null,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

const calculateTotalPrice = (items: CartItem[]) => {
  return items.reduce(
    (total, item) => total + item.discountPrice * item.quantity,
    0
  );
};

const calculateTotalQuantity = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

const findItemIndex = (items: CartItem[], id: number) => {
  return items.findIndex((item) => item.id === id);
};

const cartReducer = (cart: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = findItemIndex(cart.items, action.payload.id);

      const updatedItems =
        existingItemIndex === -1
          ? [...cart.items, action.payload]
          : [...cart.items];

      if (existingItemIndex !== -1) {
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
      }

      return {
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
        totalQuantity: calculateTotalQuantity(updatedItems),
      };
    }

    case 'REMOVE_ITEM': {
      const existingItemIndex = findItemIndex(cart.items, action.payload.id);

      if (existingItemIndex === -1) {
        return cart;
      }

      const updatedItems = [...cart.items];
      updatedItems[existingItemIndex].quantity -= action.payload.quantity;

      if (updatedItems[existingItemIndex].quantity <= 0) {
        updatedItems.splice(existingItemIndex, 1);
      }

      return {
        items: updatedItems,
        totalPrice: calculateTotalPrice(updatedItems),
        totalQuantity: calculateTotalQuantity(updatedItems),
      };
    }

    case 'CLEAR_CART':
      return initialCart;

    case 'LOAD_CART':
      return action.payload;

    default:
      return cart;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);

      // Recalculate discounts (might have changed since last visit)
      const today = new Date().toISOString().slice(0, 10);
      parsedCart.items.forEach((item: CartItem) => {
        addProductDiscountPrice(item, today);
      });
      // Recalculate totals
      parsedCart.totalPrice = calculateTotalPrice(parsedCart.items);
      parsedCart.totalQuantity = calculateTotalQuantity(parsedCart.items);

      dispatch({ type: 'LOAD_CART', payload: parsedCart });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: item,
    });
  };

  const removeFromCart = (itemId: number, quantity: number = 1) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id: itemId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const cartContextValue = {
    cart,
    dispatch,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
