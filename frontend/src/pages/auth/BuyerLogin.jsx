import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, KeyRound, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const BuyerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('buyer1@gmail.com');
  const [password, setPassword] = useState('Buyer@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/buyer/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ email, password, role: 'BUYER' });
      if (res.role === 'ROLE_BUYER') {
        navigate(from, { replace: true });
      } else {
        setError('Unauthorized: Please use the appropriate portal for your role');
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
            backgroundColor: 'rgba(212, 175, 55, 0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-gold)',
            marginBottom: '1rem',
            border: '1px solid var(--color-gold)'
          }}>
            <ShoppingBag size={28} />
          </div>
          <span className="badge badge-pink" style={{ marginBottom: '0.5rem' }}>Customer Portal</span>
          <h1 className="gold-heading" style={{ fontSize: '1.8rem' }}>Buyer Account Sign In</h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.875rem' }}>
            Access your shopping bag, order status, and personal wishlist.
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
            <label className="form-label">Email Address</label>
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
            <label className="form-label">Password</label>
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
            <span>{loading ? 'Signing in...' : 'Sign In to My Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div style={{ padding: '0.85rem', backgroundColor: 'rgba(232, 201, 207, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(232, 201, 207, 0.2)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
          <div style={{ color: 'var(--color-gold)', fontWeight: '700', marginBottom: '0.35rem' }}>Demo Buyer Credentials:</div>
          <div style={{ color: 'var(--text-dim)' }}>Email: <code style={{ color: '#FFF' }}>buyer1@gmail.com</code></div>
          <div style={{ color: 'var(--text-dim)' }}>Password: <code style={{ color: '#FFF' }}>Buyer@123</code></div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-light-pink)' }}>
          Don't have an account?{' '}
          <Link to="/register/buyer" style={{ color: 'var(--color-gold)', fontWeight: '700' }}>
            Create an Account
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link to="/login" style={{ color: 'var(--color-gold)', fontSize: '0.85rem', textDecoration: 'none' }}>
            &larr; Switch to another portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyerLogin;
