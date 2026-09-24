import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@dhanabalmart.com');
  const [password, setPassword] = useState('Admin@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password, role: 'ADMIN' });
      if (res.role === 'ROLE_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        setError('Unauthorized: Account does not possess Administrator privileges');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '5rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="dm-card-glass" style={{ width: '100%', maxWidth: '460px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(128, 128, 0, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#bbf7d0',
            marginBottom: '1rem',
            border: '1px solid var(--color-olive)'
          }}>
            <Shield size={28} />
          </div>
          <span className="badge badge-olive" style={{ marginBottom: '0.5rem' }}>Platform Control</span>
          <h1 className="gold-heading" style={{ fontSize: '1.8rem' }}>Admin Portal Login</h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.875rem' }}>
            Authorized DhanabalMart administrative personnel only.
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)' }} />
              <input
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Secure Password</label>
            <div style={{ position: 'relative' }}>
              <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gold)' }} />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold"
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginBottom: '1.5rem' }}
          >
            <span>{loading ? 'Authenticating...' : 'Access Admin Dashboard'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div style={{ padding: '0.85rem', backgroundColor: 'rgba(232, 201, 207, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(232, 201, 207, 0.2)', fontSize: '0.8rem' }}>
          <div style={{ color: 'var(--color-gold)', fontWeight: '700', marginBottom: '0.35rem' }}>Demo Admin Credentials:</div>
          <div style={{ color: 'var(--text-dim)' }}>Email: <code style={{ color: '#FFF' }}>admin@dhanabalmart.com</code></div>
          <div style={{ color: 'var(--text-dim)' }}>Password: <code style={{ color: '#FFF' }}>Admin@123</code></div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" style={{ color: 'var(--color-gold)', fontSize: '0.85rem', textDecoration: 'none' }}>
            &larr; Switch to another portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
