import { createContext, useReducer, useContext, ReactNode } from 'react';
import {
  CartItem,
  CartState,
  CartContextProps,
  CartAction,
} from '../types/Cart.interface';

const initialCart: CartState = {
  items: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const CartContext = createContext<CartContextProps>({
  cart: initialCart,
  dispatch: () => null,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

const cartReducer = (cart: CartState, action: CartAction): CartState => {
  const calculateTotalPrice = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalQuantity = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const findIndex = (items: CartItem[], id: number) => {
    return items.findIndex((item) => item.id === id);
  };

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = findIndex(cart.items, action.payload.id);

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
      const existingItemIndex = findIndex(cart.items, action.payload.id);

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

    default:
      return cart;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

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

export const useCart = () => useContext(CartContext);
