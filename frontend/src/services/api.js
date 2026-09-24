import axios from 'axios';

const api = axios.create({
  baseURL: '', // Uses Vite proxy in development, direct relative path in production
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dhanabal_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config.url || '';
      // Only clear token if an authenticated endpoint fails (not on login failure)
      if (!url.includes('/api/auth/login')) {
        localStorage.removeItem('dhanabal_token');
        localStorage.removeItem('dhanabal_user');
      }
    }
    return Promise.reject(error);
  }
);

// Health Check
export const checkHealth = () => api.get('/health');

// Auth API
export const loginUser = (credentials) => api.post('/api/auth/login', credentials);
export const registerUser = (userData) => api.post('/api/auth/register', userData);
export const getProfile = () => api.get('/api/auth/me');
export const updateProfile = (data) => api.put('/api/auth/profile', data);
export const logoutUser = () => api.post('/api/auth/logout');

// Catalog API
export const getCategories = () => api.get('/api/categories');
export const getProducts = (params) => api.get('/api/products', { params });
export const getProductById = (id) => api.get(`/api/products/${id}`);

// Seller Products API
export const getSellerProducts = () => api.get('/api/products/seller/me');
export const createProduct = (productData) => api.post('/api/products', productData);
export const updateProduct = (id, productData) => api.put(`/api/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

// Cart API
export const getCart = () => api.get('/api/cart');
export const addToCart = (productId, quantity = 1) => api.post('/api/cart', { productId, quantity });
export const updateCartItem = (itemId, quantity) => api.put(`/api/cart/items/${itemId}`, { quantity });
export const removeFromCart = (itemId) => api.delete(`/api/cart/items/${itemId}`);
export const clearCart = () => api.delete('/api/cart');

// Orders API
export const checkout = (checkoutData) => api.post('/api/orders', checkoutData);
export const getOrders = () => api.get('/api/orders');
export const getOrderById = (id) => api.get(`/api/orders/${id}`);
export const getSellerOrders = () => api.get('/api/orders/seller/me');
export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}/status`, { status });

// Admin API
export const getAdminUsers = () => api.get('/api/admin/users');
export const getAdminSellers = () => api.get('/api/admin/sellers');
export const getAdminBuyers = () => api.get('/api/admin/buyers');
export const updateSellerApproval = (id, approvalStatus) => api.put(`/api/admin/sellers/${id}`, { approvalStatus });
export const updateUserStatus = (id, status) => api.put(`/api/admin/users/${id}/status`, { status });
export const getAdminOrders = () => api.get('/api/admin/orders');
export const getAdminStats = () => api.get('/api/admin/stats');
export const getAdminProducts = () => api.get('/api/admin/products');

export default api;
