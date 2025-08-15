import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface Coupon {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
}

interface CartState {
  items: Product[];
  coupon: Coupon | null;
  isCartOpen: boolean;
  shippingProvince: string;
  shippingCost: number;
}

interface CartContextType {
  state: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getDiscount: () => number;
  getFinalTotal: () => number;
  openCart: () => void;
  closeCart: () => void;
  setShippingProvince: (province: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction = 
  | { type: 'ADD_TO_CART'; product: Product }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'APPLY_COUPON'; coupon: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_SHIPPING'; province: string; cost: number };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.product.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.product.id
              ? { ...item, quantity: (item.quantity || 1) + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.productId),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items
          .map(item =>
            item.id === action.productId
              ? { ...item, quantity: action.quantity }
              : item
          )
          .filter(item => item.quantity && item.quantity > 0),
      };
    case 'CLEAR_CART':
      return { ...state, items: [], coupon: null, shippingProvince: '', shippingCost: 0 };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.coupon };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    case 'OPEN_CART':
      return { ...state, isCartOpen: true };
    case 'CLOSE_CART':
      return { ...state, isCartOpen: false };
    case 'SET_SHIPPING':
      return { ...state, shippingProvince: action.province, shippingCost: action.cost };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null, isCartOpen: false, shippingProvince: '', shippingCost: 0 }, (initialState) => {
    try {
      const storedCart = localStorage.getItem('breathin_cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        return { ...parsed, isCartOpen: false, shippingProvince: '', shippingCost: 0 };
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
    return initialState;
  });

  useEffect(() => {
    try {
      localStorage.setItem('breathin_cart', JSON.stringify({ ...state, isCartOpen: false }));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [state]);

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  const getDiscount = () => {
    const subtotal = getCartTotal();
    if (!state.coupon || subtotal === 0) return 0;
    let discount = 0;
    if (state.coupon.discount_type === 'percentage') {
      discount = subtotal * (state.coupon.discount_value / 100);
    } else if (state.coupon.discount_type === 'fixed') {
      discount = state.coupon.discount_value;
    }
    return Math.min(discount, subtotal);
  };

  const setShippingProvince = (province: string) => {
    const subtotalAfterDiscount = getCartTotal() - getDiscount();
    let cost = 0;
    if (subtotalAfterDiscount < 2500 && subtotalAfterDiscount > 0) {
      cost = province === 'Punjab' ? 200 : 300;
    }
    dispatch({ type: 'SET_SHIPPING', province, cost });
  };

  const addToCart = (product: Product) => dispatch({ type: 'ADD_TO_CART', product });
  const removeFromCart = (productId: string) => dispatch({ type: 'REMOVE_FROM_CART', productId });
  const updateQuantity = (productId: string, quantity: number) => dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const applyCoupon = (coupon: Coupon) => dispatch({ type: 'APPLY_COUPON', coupon });
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  const getFinalTotal = () => {
    return getCartTotal() - getDiscount() + state.shippingCost;
  };

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      applyCoupon,
      removeCoupon,
      getDiscount,
      getFinalTotal,
      openCart,
      closeCart,
      setShippingProvince,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}