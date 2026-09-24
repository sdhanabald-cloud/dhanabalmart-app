import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-peacock-dark)',
      borderTop: 'var(--gold-border)',
      marginTop: '5rem',
      padding: '4rem 0 2rem'
    }}>
      <div className="container">
        {/* Marketplace Guarantees */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid rgba(232, 201, 207, 0.15)',
          marginBottom: '3rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--color-gold)', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--color-gold)', fontSize: '0.95rem' }}>100% Authentic Quality</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-light-pink)' }}>Direct from verified artisan weavers & sellers</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--color-gold)', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
              <Truck size={28} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--color-gold)', fontSize: '0.95rem' }}>Express Nationwide Shipping</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-light-pink)' }}>Secure, damage-free doorstep delivery</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--color-gold)', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
              <RotateCcw size={28} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--color-gold)', fontSize: '0.95rem' }}>Seamless Returns</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-light-pink)' }}>7-day hassle-free buyer protection</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--color-gold)', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
              <Award size={28} />
            </div>
            <div>
              <div style={{ fontWeight: '700', color: 'var(--color-gold)', fontSize: '0.95rem' }}>Trusted Marketplace</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-light-pink)' }}>Strict seller verification & compliance</div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div className="brand-font gold-text" style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
              DhanabalMart
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
              The premier e-commerce marketplace dedicated to traditional crafts, heritage silks, pure spices, and organic wellness.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-gold">Docker Ready</span>
              <span className="badge badge-olive">PostgreSQL</span>
              <span className="badge badge-pink">Render</span>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', marginBottom: '1rem', fontSize: '1rem' }}>
              Marketplace
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/products" style={footerLinkStyle}>All Products</Link></li>
              <li><Link to="/products?category=pure-silk-handlooms" style={footerLinkStyle}>Pure Silk Handlooms</Link></li>
              <li><Link to="/products?category=estate-spices-groceries" style={footerLinkStyle}>Estate Spices & Groceries</Link></li>
              <li><Link to="/products?category=heritage-handcrafts-decor" style={footerLinkStyle}>Heritage Decor</Link></li>
              <li><Link to="/products?category=ayurveda-herbal-wellness" style={footerLinkStyle}>Ayurvedic Wellness</Link></li>
            </ul>
          </div>

          {/* Dedicated Portals (Direct Links to 3 Logins) */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', marginBottom: '1rem', fontSize: '1rem' }}>
              Dedicated Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/login/buyer" style={footerLinkStyle}>Buyer Portal Login</Link></li>
              <li><Link to="/register/buyer" style={footerLinkStyle}>Create Buyer Account</Link></li>
              <li><Link to="/login/seller" style={footerLinkStyle}>Seller Portal Login</Link></li>
              <li><Link to="/register/seller" style={footerLinkStyle}>Register as a Seller</Link></li>
              <li><Link to="/login/admin" style={footerLinkStyle}>Admin Portal Login</Link></li>
            </ul>
          </div>

          {/* Quick Info & Health */}
          <div>
            <h4 style={{ color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', marginBottom: '1rem', fontSize: '1rem' }}>
              System & Verification
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><a href="/health" target="_blank" rel="noreferrer" style={{ ...footerLinkStyle, color: 'var(--color-gold)' }}>API Health Check (/health)</a></li>
              <li><Link to="/about" style={footerLinkStyle}>About DhanabalMart</Link></li>
              <li><span style={{ color: 'var(--text-dim)' }}>Architecture: React + Java Spring Boot</span></li>
              <li><span style={{ color: 'var(--text-dim)' }}>Database: PostgreSQL Relational</span></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid rgba(232, 201, 207, 0.1)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-dim)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} DhanabalMart Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle = {
  color: 'var(--color-light-pink)',
  textDecoration: 'none',
  transition: 'color 0.2s',
};

export default Footer;
