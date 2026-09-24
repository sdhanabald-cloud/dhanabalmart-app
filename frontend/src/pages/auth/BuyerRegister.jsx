import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, KeyRound, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

const BuyerRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register({
        ...formData,
        role: 'BUYER',
      });
      navigate('/buyer/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="dm-card-glass" style={{ width: '100%', maxWidth: '580px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-pink" style={{ marginBottom: '0.5rem' }}>Join DhanabalMart</span>
          <h1 className="gold-heading" style={{ fontSize: '2rem' }}>Create Buyer Account</h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
            Enjoy handcrafted treasures and fast, tracked deliveries.
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                className="form-input"
                placeholder="e.g. Radhika Menon"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                className="form-input"
                placeholder="radhika@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password * (min 6 chars)</label>
              <input
                type="password"
                name="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Shipping / Delivery Address *</label>
            <input
              type="text"
              name="shippingAddress"
              required
              className="form-input"
              placeholder="Door No, Street Name, Apartment"
              value={formData.shippingAddress}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1.75rem' }}>
            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                required
                className="form-input"
                placeholder="e.g. Chennai"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Postal / PIN Code *</label>
              <input
                type="text"
                name="postalCode"
                required
                className="form-input"
                placeholder="600001"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.25rem' }}
          >
            <span>{loading ? 'Creating Account...' : 'Complete Buyer Registration'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-light-pink)' }}>
          Already have an account?{' '}
          <Link to="/login/buyer" style={{ color: 'var(--color-gold)', fontWeight: '700' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerRegister;
