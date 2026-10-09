import { createContext } from 'react';

import type { CartContextProps, CartState } from '../types/Cart.interface';

export const initialCart: CartState = {
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
