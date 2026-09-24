import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ShoppingCart, User, Shield, Store, LogOut, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout, cartCount, isAdmin, isSeller, isBuyer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: 'var(--color-peacock-dark)',
      borderBottom: 'var(--gold-border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '75px' }}>
        {/* Brand Logo with Metallic Gold Styling */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'var(--gold-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-peacock-dark)',
            fontWeight: '900',
            fontSize: '1.4rem',
            fontFamily: 'var(--font-serif)',
            boxShadow: '0 2px 10px rgba(212, 175, 55, 0.4)'
          }}>
            D
          </div>
          <div>
            <span className="brand-font gold-text" style={{ fontSize: '1.65rem', fontWeight: '800' }}>
              DhanabalMart
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--color-light-pink)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '-4px' }}>
              Grand Marketplace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link to="/" style={{
            color: isActive('/') ? 'var(--color-gold)' : 'var(--text-primary)',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            borderBottom: isActive('/') ? '2px solid var(--color-gold)' : '2px solid transparent',
            paddingBottom: '4px'
          }}>
            Home
          </Link>
          <Link to="/products" style={{
            color: isActive('/products') ? 'var(--color-gold)' : 'var(--text-primary)',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            borderBottom: isActive('/products') ? '2px solid var(--color-gold)' : '2px solid transparent',
            paddingBottom: '4px'
          }}>
            Browse Catalog
          </Link>
          <Link to="/about" style={{
            color: isActive('/about') ? 'var(--color-gold)' : 'var(--text-primary)',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            borderBottom: isActive('/about') ? '2px solid var(--color-gold)' : '2px solid transparent',
            paddingBottom: '4px'
          }}>
            About
          </Link>
        </div>

        {/* Right Section: Actions & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Buyer Cart Icon */}
          {(!user || isBuyer) && (
            <Link to="/cart" style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(232, 201, 207, 0.1)',
              color: 'var(--color-gold)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              textDecoration: 'none'
            }}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: 'var(--color-brown)',
                  color: '#FFF',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--color-gold)'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* User Logged In Portal Menu */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="btn btn-outline"
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
              >
                {isAdmin && <Shield size={16} />}
                {isSeller && <Store size={16} />}
                {isBuyer && <User size={16} />}
                <span>{user.fullName || user.email.split('@')[0]}</span>
                <ChevronDown size={14} />
              </button>

              {portalDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '230px',
                  backgroundColor: 'var(--color-peacock-card)',
                  border: 'var(--gold-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
                  padding: '0.5rem 0',
                  zIndex: 1100
                }}>
                  <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid rgba(232, 201, 207, 0.15)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: '700', textTransform: 'uppercase' }}>
                      {user.role.replace('ROLE_', '')} PORTAL
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>

                  {isAdmin && (
                    <>
                      <Link to="/admin/dashboard" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Dashboard</Link>
                      <Link to="/admin/buyers" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Manage Buyers</Link>
                      <Link to="/admin/sellers" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Manage Sellers</Link>
                      <Link to="/admin/products" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Manage Products</Link>
                      <Link to="/admin/orders" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Manage Orders</Link>
                      <Link to="/admin/reports" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Reports & Stats</Link>
                      <Link to="/admin/profile" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Admin Profile</Link>
                    </>
                  )}

                  {isSeller && (
                    <>
                      <Link to="/seller/dashboard" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Seller Dashboard</Link>
                      <Link to="/seller/products" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>My Products</Link>
                      <Link to="/seller/products/add" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>+ Add Product</Link>
                      <Link to="/seller/orders" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Customer Orders</Link>
                      <Link to="/seller/profile" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Seller Profile</Link>
                    </>
                  )}

                  {isBuyer && (
                    <>
                      <Link to="/buyer/dashboard" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Buyer Dashboard</Link>
                      <Link to="/buyer/orders" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>My Orders</Link>
                      <Link to="/cart" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>My Cart ({cartCount})</Link>
                      <Link to="/buyer/profile" onClick={() => setPortalDropdownOpen(false)} style={dropdownLinkStyle}>Buyer Profile</Link>
                    </>
                  )}

                  <div style={{ borderTop: '1px solid rgba(232, 201, 207, 0.15)', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        ...dropdownLinkStyle,
                        width: '100%',
                        textAlign: 'left',
                        background: 'none',
                        border: 'none',
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                      }}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login Selection Button */
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-gold" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

const dropdownLinkStyle = {
  display: 'block',
  padding: '0.5rem 1rem',
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  transition: 'background-color 0.2s',
};

export default Navbar;
