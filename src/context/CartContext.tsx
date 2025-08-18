import { createContext, useContext, useReducer, ReactNode, useEffect, useState, useRef } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import toast from 'react-hot-toast';

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
  loading: boolean;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => Promise<void>;
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
  | { type: 'SET_CART'; items: Product[] }
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
    case 'SET_CART':
      return { ...state, items: action.items };
    case 'ADD_TO_CART': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.product.id);
      const quantityToAdd = action.product.quantity || 1;

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        const existingItem = newItems[existingItemIndex];
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: (existingItem.quantity || 0) + quantityToAdd,
        };
        return { ...state, items: newItems };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.product, quantity: quantityToAdd }],
        };
      }
    }
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

const GUEST_CART_KEY = 'breathin_guest_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null, isCartOpen: false, shippingProvince: '', shippingCost: 0 });
  const [loading, setLoading] = useState(true);
  const previousUserId = useRef(user?.id);

  // Load cart from DB for logged-in users, or from localStorage for guests
  const loadCart = async () => {
    setLoading(true);
    if (user) {
      const { data, error } = await supabase
        .from('user_carts')
        .select('quantity, products(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user cart:', error);
      } else {
        const cartItems = data.map((item: any) => ({
          id: item.products.id,
          name: item.products.name,
          price: item.products.price,
          image: item.products.images[0],
          quantity: item.quantity,
        }));
        dispatch({ type: 'SET_CART', items: cartItems });
      }
    } else {
      try {
        const storedCart = localStorage.getItem(GUEST_CART_KEY);
        if (storedCart) {
          dispatch({ type: 'SET_CART', items: JSON.parse(storedCart) });
        } else {
          dispatch({ type: 'SET_CART', items: [] });
        }
      } catch (error) {
        console.error("Failed to parse guest cart from localStorage", error);
        dispatch({ type: 'SET_CART', items: [] });
      }
    }
    setLoading(false);
  };

  // Effect to handle user logging in/out and merging carts
  useEffect(() => {
    const handleAuthChange = async () => {
      const currentUserId = user?.id;
      // User logged in
      if (currentUserId && !previousUserId.current) {
        setLoading(true);
        const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]');
        if (guestCart.length > 0) {
          const itemsToUpsert = guestCart.map((item: Product) => ({
            user_id: currentUserId,
            product_id: item.id,
            quantity: item.quantity || 1,
          }));
          await supabase.from('user_carts').upsert(itemsToUpsert, { onConflict: 'user_id,product_id' });
          localStorage.removeItem(GUEST_CART_KEY);
        }
        await loadCart();
      } 
      // User logged out
      else if (!currentUserId && previousUserId.current) {
        dispatch({ type: 'CLEAR_CART' });
      }
      previousUserId.current = currentUserId;
    };

    if (!authLoading) {
      handleAuthChange();
    }
  }, [user, authLoading]);

  // Initial cart load
  useEffect(() => {
    if (!authLoading) {
      loadCart();
    }
  }, [authLoading]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!user && !authLoading) {
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(state.items));
      } catch (error) {
        console.error("Failed to save guest cart to localStorage", error);
      }
    }
  }, [state.items, user, authLoading]);

  const addToCart = async (product: Product) => {
    const quantityToAdd = product.quantity || 1;
    if (user) {
      const { data: existingItem, error: fetchError } = await supabase
        .from('user_carts')
        .select('quantity')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // Ignore 'not found' error
        console.error('Error checking cart item:', fetchError);
        toast.error('Could not add item to cart.');
        return;
      }

      const { error } = await supabase.from('user_carts').upsert({
        user_id: user.id,
        product_id: product.id,
        quantity: (existingItem?.quantity || 0) + quantityToAdd,
      });

      if (!error) {
        await loadCart();
        toast.success(`${product.name} added to cart!`);
      } else {
        toast.error('Could not add item to cart.');
      }
    } else {
      dispatch({ type: 'ADD_TO_CART', product });
      toast.success(`${product.name} added to cart!`);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (user) {
      if (quantity > 0) {
        const { error } = await supabase.from('user_carts').update({ quantity }).match({ user_id: user.id, product_id: productId });
        if (!error) await loadCart();
      } else {
        await removeFromCart(productId);
      }
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      const { error } = await supabase.from('user_carts').delete().match({ user_id: user.id, product_id: productId });
      if (!error) await loadCart();
    } else {
      dispatch({ type: 'REMOVE_FROM_CART', productId });
    }
  };

  const clearCart = async () => {
    if (user) {
      const { error } = await supabase.from('user_carts').delete().eq('user_id', user.id);
      if (error) {
        console.error('Error clearing database cart:', error);
        toast.error('Could not clear cart items.');
      }
      // Always clear local state
      dispatch({ type: 'CLEAR_CART' });
    } else {
      // For guests, just clear local state
      dispatch({ type: 'CLEAR_CART' });
    }
  };

  const getCartTotal = () => state.items.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const getCartCount = () => state.items.reduce((count, item) => count + (item.quantity || 1), 0);
  const getDiscount = () => {
    const subtotal = getCartTotal();
    if (!state.coupon || subtotal === 0) return 0;
    let discount = state.coupon.discount_type === 'percentage'
      ? subtotal * (state.coupon.discount_value / 100)
      : state.coupon.discount_value;
    return Math.min(discount, subtotal);
  };
  const setShippingProvince = (province: string) => {
    const subtotalAfterDiscount = getCartTotal() - getDiscount();
    
    const freeShippingThreshold = Number(settings?.shipping_free_threshold || 2500);
    const costPunjab = Number(settings?.shipping_cost_punjab || 200);
    const costOther = Number(settings?.shipping_cost_other || 300);

    let cost = 0;
    if (subtotalAfterDiscount < freeShippingThreshold && subtotalAfterDiscount > 0) {
      cost = province === 'Punjab' ? costPunjab : costOther;
    }
    dispatch({ type: 'SET_SHIPPING', province, cost });
  };
  const getFinalTotal = () => getCartTotal() - getDiscount() + state.shippingCost;
  const applyCoupon = (coupon: Coupon) => dispatch({ type: 'APPLY_COUPON', coupon });
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  return (
    <CartContext.Provider value={{
      state, loading, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal,
      getCartCount, applyCoupon, removeCoupon, getDiscount, getFinalTotal, openCart, closeCart, setShippingProvince,
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