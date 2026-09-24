import React, { useEffect, useState } from 'react';
import { getAdminBuyers, updateUserStatus } from '../../services/api';
import { Users, ShieldAlert, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';

const ManageBuyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const res = await getAdminBuyers();
      setBuyers(res.data);
    } catch (err) {
      console.error('Failed to load buyers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    try {
      setUpdatingId(userId);
      await updateUserStatus(userId, nextStatus);
      setMsg({ text: `User status changed to ${nextStatus}`, type: 'success' });
      setBuyers(buyers.map(b => b.user.id === userId ? { ...b, user: { ...b.user, status: nextStatus } } : b));
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to update user status', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Buyers Directory...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-olive" style={{ marginBottom: '0.4rem' }}>Patron Management</span>
        <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
          Registered Marketplace Buyers ({buyers.length})
        </h1>
        <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
          Monitor buyer account status, activity, and doorstep delivery addresses.
        </p>
      </div>

      {msg.text && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          backgroundColor: msg.type === 'success' ? 'rgba(128, 128, 0, 0.2)' : 'rgba(220, 38, 38, 0.2)',
          border: `1px solid ${msg.type === 'success' ? 'var(--color-olive)' : '#ef4444'}`,
          color: msg.type === 'success' ? '#bbf7d0' : '#fca5a5'
        }}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="dm-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="dm-table">
            <thead>
              <tr>
                <th>Buyer Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Delivery Location</th>
                <th>Account Status</th>
                <th>Access Control</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: '700', color: '#FFF' }}>{b.user?.fullName}</td>
                  <td>{b.user?.email}</td>
                  <td>{b.user?.phone || 'N/A'}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{b.city || 'Standard City'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.shippingAddress}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${b.user?.status === 'ACTIVE' ? 'badge-olive' : 'badge-danger'}`}>
                      {b.user?.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleStatus(b.user.id, b.user?.status)}
                      disabled={updatingId === b.user.id}
                      className={`btn btn-sm ${b.user?.status === 'ACTIVE' ? '' : 'btn-olive'}`}
                      style={{
                        backgroundColor: b.user?.status === 'ACTIVE' ? 'rgba(220, 38, 38, 0.2)' : undefined,
                        border: b.user?.status === 'ACTIVE' ? '1px solid #ef4444' : undefined,
                        color: b.user?.status === 'ACTIVE' ? '#fca5a5' : undefined,
                      }}
                    >
                      {b.user?.status === 'ACTIVE' ? (
                        <>
                          <ShieldAlert size={14} /> Block Account
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={14} /> Reactivate
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBuyers;
