import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Store, ShoppingBag, ArrowRight } from 'lucide-react';

const LoginSelect = () => {
  return (
    <div className="container" style={{ padding: '5rem 1.5rem 7rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 4rem' }}>
        <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>Secure Multi-Role Access</span>
        <h1 className="gold-heading" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', marginBottom: '1.25rem' }}>
          Select Your DhanabalMart Portal
        </h1>
        <p style={{ color: 'var(--color-light-pink)', fontSize: '1.1rem', lineHeight: '1.7' }}>
          Please choose your destination portal. Each module provides dedicated tools tailored for Buyers, Sellers, and Administrators.
        </p>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        {/* Buyer Portal Card */}
        <div className="dm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}>
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-gold)',
              marginBottom: '1.5rem'
            }}>
              <ShoppingBag size={30} />
            </div>

            <span className="badge badge-pink" style={{ marginBottom: '0.75rem' }}>Customer Portal</span>
            <h2 style={{ color: '#FFF', fontSize: '1.6rem', marginBottom: '1rem' }}>Buyer Account</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Browse curated silks, spices, and decor, manage shopping carts, and track your doorstep delivery orders.
            </p>
          </div>

          <div>
            <Link to="/login/buyer" className="btn btn-gold" style={{ width: '100%', marginBottom: '1rem' }}>
              <span>Buyer Sign In</span>
              <ArrowRight size={16} />
            </Link>
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-light-pink)' }}>
              New customer? <Link to="/register/buyer" style={{ color: 'var(--color-gold)', fontWeight: '600' }}>Register here</Link>
            </div>
          </div>
        </div>

        {/* Seller Portal Card */}
        <div className="dm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem', borderColor: 'var(--color-gold)' }}>
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(162, 85, 36, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fed7aa',
              marginBottom: '1.5rem'
            }}>
              <Store size={30} />
            </div>

            <span className="badge badge-brown" style={{ marginBottom: '0.75rem' }}>Merchant Hub</span>
            <h2 style={{ color: '#FFF', fontSize: '1.6rem', marginBottom: '1rem' }}>Seller Portal</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Publish artisan products, manage real-time inventory and pricing, and fulfill customer purchase orders.
            </p>
          </div>

          <div>
            <Link to="/login/seller" className="btn btn-brown" style={{ width: '100%', marginBottom: '1rem' }}>
              <span>Seller Sign In</span>
              <ArrowRight size={16} />
            </Link>
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-light-pink)' }}>
              New seller? <Link to="/register/seller" style={{ color: 'var(--color-gold)', fontWeight: '600' }}>Register store</Link>
            </div>
          </div>
        </div>

        {/* Admin Portal Card */}
        <div className="dm-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}>
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'rgba(128, 128, 0, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#bbf7d0',
              marginBottom: '1.5rem'
            }}>
              <Shield size={30} />
            </div>

            <span className="badge badge-olive" style={{ marginBottom: '0.75rem' }}>Platform Control</span>
            <h2 style={{ color: '#FFF', fontSize: '1.6rem', marginBottom: '1rem' }}>Admin Gateway</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              Oversee platform security, approve and verify merchant stores, supervise orders, and inspect marketplace metrics.
            </p>
          </div>

          <div>
            <Link to="/login/admin" className="btn btn-outline" style={{ width: '100%', marginBottom: '1rem' }}>
              <span>Admin Sign In</span>
              <ArrowRight size={16} />
            </Link>
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Restricted to authorized administrators
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSelect;
