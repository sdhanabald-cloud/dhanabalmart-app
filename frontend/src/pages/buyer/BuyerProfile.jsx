import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/api';
import { User, Mail, Phone, MapPin, CheckCircle, AlertCircle, Save } from 'lucide-react';

const BuyerProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    shippingAddress: '',
    city: '',
    postalCode: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        setFormData({
          fullName: res.data.fullName || '',
          phone: res.data.phone || '',
          shippingAddress: 'Flat 402, Peacock Heights, Jubilee Hills',
          city: 'Hyderabad',
          postalCode: '500033',
        });
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updateProfile(formData);
      setSuccess('Profile and default shipping address updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Profile...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem', display: 'flex', justifyContent: 'center' }}>
      <div className="dm-card-glass" style={{ width: '100%', maxWidth: '640px', padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-pink" style={{ marginBottom: '0.4rem' }}>Account Preferences</span>
          <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>Buyer Profile</h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
            Update your contact information and default doorstep delivery details.
          </p>
        </div>

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(128, 128, 0, 0.2)', border: '1px solid var(--color-olive)', color: '#bbf7d0', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address (Read-Only)</label>
            <input
              type="email"
              disabled
              className="form-input"
              value={user?.email || ''}
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Shipping Address</label>
            <textarea
              name="shippingAddress"
              rows="3"
              className="form-textarea"
              value={formData.shippingAddress}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Postal / PIN Code</label>
              <input
                type="text"
                name="postalCode"
                className="form-input"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-gold"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyerProfile;
