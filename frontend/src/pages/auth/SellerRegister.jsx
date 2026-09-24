import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, Mail, KeyRound, Phone, MapPin, FileText, AlertCircle, ArrowRight } from 'lucide-react';

const SellerRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    storeName: '',
    businessAddress: '',
    taxId: '',
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
        role: 'SELLER',
      });
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="dm-card-glass" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="badge badge-brown" style={{ marginBottom: '0.5rem' }}>Merchant Onboarding</span>
          <h1 className="gold-heading" style={{ fontSize: '2rem' }}>Register As A Seller</h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
            List your artisan handlooms, spices, crafts, and connect with patrons.
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
              <label className="form-label">Representative Name *</label>
              <input
                type="text"
                name="fullName"
                required
                className="form-input"
                placeholder="e.g. S. Ramanathan"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone *</label>
              <input
                type="tel"
                name="phone"
                required
                className="form-input"
                placeholder="+91 98765 12345"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Login Email *</label>
              <input
                type="email"
                name="email"
                required
                className="form-input"
                placeholder="merchant@domain.com"
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

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Store / Enterprise Name *</label>
              <input
                type="text"
                name="storeName"
                required
                className="form-input"
                placeholder="e.g. Thanjavur Heritage Weavers"
                value={formData.storeName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tax ID / GSTIN / Registration No.</label>
              <input
                type="text"
                name="taxId"
                className="form-input"
                placeholder="GSTIN33AAAAA0000A1Z5"
                value={formData.taxId}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Business / Warehouse Address *</label>
            <textarea
              name="businessAddress"
              required
              rows="3"
              className="form-textarea"
              placeholder="Full workshop or store address, State & PIN"
              value={formData.businessAddress}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-brown"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginBottom: '1.25rem' }}
          >
            <span>{loading ? 'Creating Store...' : 'Register Merchant Store'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-light-pink)' }}>
          Already registered as a seller?{' '}
          <Link to="/login/seller" style={{ color: 'var(--color-gold)', fontWeight: '700' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerRegister;
