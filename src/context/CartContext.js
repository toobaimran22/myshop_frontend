import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const LOCAL_STORAGE_KEY = 'cart_items';

const getCartFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setCartToLocalStorage = (cart) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
};

const getCartFromBackend = async () => {
  try {
    const res = await api.get('/v1/cart');
    const data = res.data;
    if (data.cart_items) {
      return data.cart_items.map(item => ({
        product: item.product,
        quantity: item.quantity
      }));
    }
    return [];
  } catch {
    return [];
  }
};

const clearLocalStorageCart = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCart(getCartFromLocalStorage());
      } else {
        const backendCart = await getCartFromBackend();
        setCart(backendCart);
        clearLocalStorageCart();
      }
    };
    loadCart();
  }, [user]);

  
  useEffect(() => {
    if (!user) {
      setCartToLocalStorage(cart);
    }
  }, [cart, user]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (user) {
      // Sync with backend
      await api.post('/v1/cart/add_item', {
        product_id: product.id,
        quantity,
      }, { withCredentials: true });
      // Optionally, refresh cart from backend
      const backendCart = await getCartFromBackend();
      setCart(backendCart);
    } else {
      setCart((prevCart) => {
        const existing = prevCart.find((item) => item.product.id === product.id);
        if (existing) {
          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          return [...prevCart, { product, quantity }];
        }
      });
    }
  };

  // Update item quantity
  const updateCartItem = async (productId, quantity) => {
    if (user) {
      await api.put('/v1/cart/update_item', {
        product_id: productId,
        quantity,
      });
      const backendCart = await getCartFromBackend();
      setCart(backendCart);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (user) {
      await api.delete(`/v1/cart/remove_item`, { data: { product_id: productId } });
      const backendCart = await getCartFromBackend();
      setCart(backendCart);
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateCartItem, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}; 