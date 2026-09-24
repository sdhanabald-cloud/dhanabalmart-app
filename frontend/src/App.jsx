import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import LoginSelect from './pages/LoginSelect';

// Auth Pages
import AdminLogin from './pages/auth/AdminLogin';
import SellerLogin from './pages/auth/SellerLogin';
import BuyerLogin from './pages/auth/BuyerLogin';
import BuyerRegister from './pages/auth/BuyerRegister';
import SellerRegister from './pages/auth/SellerRegister';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBuyers from './pages/admin/ManageBuyers';
import ManageSellers from './pages/admin/ManageSellers';
import AdminManageProducts from './pages/admin/ManageProducts';
import ManageOrders from './pages/admin/ManageOrders';
import Reports from './pages/admin/Reports';
import AdminProfile from './pages/admin/AdminProfile';

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard';
import AddProduct from './pages/seller/AddProduct';
import EditProduct from './pages/seller/EditProduct';
import SellerManageProducts from './pages/seller/ManageProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerProfile from './pages/seller/SellerProfile';

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import CartPage from './pages/buyer/CartPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import OrderConfirmation from './pages/buyer/OrderConfirmation';
import MyOrders from './pages/buyer/MyOrders';
import OrderDetails from './pages/buyer/OrderDetails';
import BuyerProfile from './pages/buyer/BuyerProfile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flexGrow: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/login" element={<LoginSelect />} />

              {/* Three Distinct Login Modules */}
              <Route path="/login/admin" element={<AdminLogin />} />
              <Route path="/login/seller" element={<SellerLogin />} />
              <Route path="/login/buyer" element={<BuyerLogin />} />

              {/* Registration Routes */}
              <Route path="/register/buyer" element={<BuyerRegister />} />
              <Route path="/register/seller" element={<SellerRegister />} />

              {/* Admin Protected Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/buyers" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}><ManageBuyers /></ProtectedRoute>
              } />
              <Route path="/admin/sellers" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}><ManageSellers /></ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminManageProducts /></ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}><ManageOrders /></ProtectedRoute>
              } />
              <Route path="/admin/reports" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}><Reports /></ProtectedRoute>
              } />
              <Route path="/admin/profile" element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminProfile /></ProtectedRoute>
              } />

              {/* Seller Protected Routes */}
              <Route path="/seller/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER', 'ROLE_ADMIN']}><SellerDashboard /></ProtectedRoute>
              } />
              <Route path="/seller/products" element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER', 'ROLE_ADMIN']}><SellerManageProducts /></ProtectedRoute>
              } />
              <Route path="/seller/products/add" element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER', 'ROLE_ADMIN']}><AddProduct /></ProtectedRoute>
              } />
              <Route path="/seller/products/edit/:id" element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER', 'ROLE_ADMIN']}><EditProduct /></ProtectedRoute>
              } />
              <Route path="/seller/orders" element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER', 'ROLE_ADMIN']}><SellerOrders /></ProtectedRoute>
              } />
              <Route path="/seller/profile" element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER', 'ROLE_ADMIN']}><SellerProfile /></ProtectedRoute>
              } />

              {/* Buyer Protected Routes */}
              <Route path="/buyer/dashboard" element={
                <ProtectedRoute allowedRoles={['ROLE_BUYER', 'ROLE_ADMIN']}><BuyerDashboard /></ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute allowedRoles={['ROLE_BUYER', 'ROLE_ADMIN']}><CartPage /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute allowedRoles={['ROLE_BUYER', 'ROLE_ADMIN']}><CheckoutPage /></ProtectedRoute>
              } />
              <Route path="/orders/confirmation" element={
                <ProtectedRoute allowedRoles={['ROLE_BUYER', 'ROLE_ADMIN']}><OrderConfirmation /></ProtectedRoute>
              } />
              <Route path="/buyer/orders" element={
                <ProtectedRoute allowedRoles={['ROLE_BUYER', 'ROLE_ADMIN']}><MyOrders /></ProtectedRoute>
              } />
              <Route path="/buyer/orders/:id" element={
                <ProtectedRoute allowedRoles={['ROLE_BUYER', 'ROLE_ADMIN']}><OrderDetails /></ProtectedRoute>
              } />
              <Route path="/buyer/profile" element={
                <ProtectedRoute allowedRoles={['ROLE_BUYER', 'ROLE_ADMIN']}><BuyerProfile /></ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
