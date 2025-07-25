import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user on app load
  useEffect(() => {
    api.get('/auth/me')
      .then(res => {
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const syncCartToBackend = async (cart) => {
    for (const item of cart) {
      await api.post('/v1/cart/add_item', {
        product_id: item.product.id,
        quantity: item.quantity
      });
    }
  };

  const login = async (email, password, localCart = []) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    if (localCart.length > 0) {
      await syncCartToBackend(localCart);
      localStorage.removeItem('cart_items');
    }
  };

  const logout = async () => {
    await api.delete('/auth/logout');
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);