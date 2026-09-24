import React, { useEffect, useState } from 'react';
import { getAdminSellers, updateSellerApproval } from '../../services/api';
import { Store, Check, X, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const res = await getAdminSellers();
      setSellers(res.data);
    } catch (err) {
      console.error('Failed to load sellers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleStatusChange = async (sellerId, newStatus) => {
    try {
      setUpdatingId(sellerId);
      await updateSellerApproval(sellerId, newStatus);
      setMsg({ text: `Seller status updated to ${newStatus}`, type: 'success' });
      // Update local state
      setSellers(sellers.map(s => s.id === sellerId ? { ...s, approvalStatus: newStatus } : s));
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to update seller status', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Merchant Directory...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-olive" style={{ marginBottom: '0.4rem' }}>Merchant Governance</span>
        <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
          Manage Sellers & Merchant Approvals ({sellers.length})
        </h1>
        <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
          Inspect business credentials, GSTIN registration, and approve or reject seller onboarding.
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
                <th>Store & Merchant Details</th>
                <th>Representative</th>
                <th>Contact</th>
                <th>Tax ID (GSTIN)</th>
                <th>Approval Status</th>
                <th>Decision Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--color-gold)' }}>{s.storeName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.businessAddress}
                      </div>
                    </div>
                  </td>
                  <td>{s.user?.fullName}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{s.user?.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{s.user?.phone}</div>
                  </td>
                  <td>
                    <code style={{ fontSize: '0.8rem', color: '#FFF' }}>{s.taxId || 'N/A'}</code>
                  </td>
                  <td>
                    <span className={`badge ${
                      s.approvalStatus === 'APPROVED' ? 'badge-olive' :
                      s.approvalStatus === 'REJECTED' ? 'badge-danger' : 'badge-pink'
                    }`}>
                      {s.approvalStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {s.approvalStatus !== 'APPROVED' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'APPROVED')}
                          disabled={updatingId === s.id}
                          className="btn btn-sm btn-olive"
                          title="Approve Seller"
                        >
                          <Check size={14} /> Approve
                        </button>
                      )}
                      {s.approvalStatus !== 'REJECTED' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'REJECTED')}
                          disabled={updatingId === s.id}
                          className="btn btn-sm"
                          style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #ef4444', color: '#fca5a5' }}
                          title="Reject Seller"
                        >
                          <X size={14} /> Reject
                        </button>
                      )}
                      {s.approvalStatus !== 'PENDING' && (
                        <button
                          onClick={() => handleStatusChange(s.id, 'PENDING')}
                          disabled={updatingId === s.id}
                          className="btn btn-sm btn-outline"
                          title="Set Pending"
                        >
                          <Clock size={14} /> Hold
                        </button>
                      )}
                    </div>
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

export default ManageSellers;
