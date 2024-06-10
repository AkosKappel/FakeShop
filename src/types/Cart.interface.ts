import { Product } from '../types/Product.interface';

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

export interface CartContextProps {
  cart: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };
