import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile, getCart } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dhanabal_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('dhanabal_token') || null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshCartCount = async () => {
    if (!token || user?.role !== 'ROLE_BUYER') {
      setCartCount(0);
      return;
    }
    try {
      const res = await getCart();
      if (res.data && res.data.items) {
        const count = res.data.items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(count);
      }
    } catch (err) {
      // Cart might not exist or empty
      setCartCount(0);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('dhanabal_token');
      if (savedToken) {
        try {
          const res = await getProfile();
          setUser(res.data);
          localStorage.setItem('dhanabal_user', JSON.stringify(res.data));
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  useEffect(() => {
    if (user && user.role === 'ROLE_BUYER') {
      refreshCartCount();
    }
  }, [user]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    const authData = res.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('dhanabal_token', authData.token);
    localStorage.setItem('dhanabal_user', JSON.stringify(authData));
    return authData;
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    const authData = res.data;
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('dhanabal_token', authData.token);
    localStorage.setItem('dhanabal_user', JSON.stringify(authData));
    return authData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCartCount(0);
    localStorage.removeItem('dhanabal_token');
    localStorage.removeItem('dhanabal_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isSeller = user?.role === 'ROLE_SELLER';
  const isBuyer = user?.role === 'ROLE_BUYER';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        cartCount,
        refreshCartCount,
        login,
        register,
        logout,
        isAdmin,
        isSeller,
        isBuyer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
