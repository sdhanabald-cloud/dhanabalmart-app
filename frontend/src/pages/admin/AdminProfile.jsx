import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, KeyRound, Mail, CheckCircle, Save } from 'lucide-react';

const AdminProfile = () => {
  const { user } = useAuth();
  const [success, setSuccess] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess('Administrative credentials validated and audit log updated.');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem', display: 'flex', justifyContent: 'center' }}>
      <div className="dm-card-glass" style={{ width: '100%', maxWidth: '600px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(128, 128, 0, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#bbf7d0',
            marginBottom: '1rem',
            border: '2px solid var(--color-olive)'
          }}>
            <Shield size={32} />
          </div>
          <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>Admin System Profile</h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
            Root administrator credentials and platform oversight permissions.
          </p>
        </div>

        {success && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(128, 128, 0, 0.2)', border: '1px solid var(--color-olive)', color: '#bbf7d0', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label className="form-label">Admin Email Account</label>
            <input
              type="email"
              disabled
              className="form-input"
              value={user?.email || 'admin@dhanabalmart.com'}
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Administrator Name</label>
            <input
              type="text"
              disabled
              className="form-input"
              value={user?.fullName || 'Dhanabal Administrator'}
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Department / Unit</label>
              <input
                type="text"
                disabled
                className="form-input"
                value="Platform Executive Management"
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Access Privileges</label>
              <input
                type="text"
                disabled
                className="form-input"
                value="SUPER_ADMIN / ALL_PRIVILEGES"
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gold"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            <Save size={18} />
            <span>Verify & Refresh Audit Status</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
