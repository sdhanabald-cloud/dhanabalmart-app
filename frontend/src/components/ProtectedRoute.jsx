import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>
          Loading DhanabalMart Portal...
        </div>
      </div>
    );
  }

  if (!user) {
    // Determine the most appropriate login portal to redirect to
    if (allowedRoles && allowedRoles.includes('ROLE_ADMIN')) {
      return <Navigate to="/login/admin" state={{ from: location }} replace />;
    } else if (allowedRoles && allowedRoles.includes('ROLE_SELLER')) {
      return <Navigate to="/login/seller" state={{ from: location }} replace />;
    } else {
      return <Navigate to="/login/buyer" state={{ from: location }} replace />;
    }
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized user to their respective authorized home/dashboard
    if (user.role === 'ROLE_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'ROLE_SELLER') {
      return <Navigate to="/seller/dashboard" replace />;
    } else {
      return <Navigate to="/buyer/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
