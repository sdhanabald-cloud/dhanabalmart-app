import React, { useEffect, useState } from 'react';
import { getSellerOrders, updateOrderStatus } from '../../services/api';
import { Package, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const SellerOrders = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getSellerOrders();
      setOrderItems(res.data);
    } catch (err) {
      console.error('Failed to load seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await updateOrderStatus(orderId, newStatus);
      setMsg({ text: `Order status updated to ${newStatus}`, type: 'success' });
      // Refresh list
      const res = await getSellerOrders();
      setOrderItems(res.data);
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to update order status', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Customer Orders...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-brown" style={{ marginBottom: '0.4rem' }}>Fulfillment Queue</span>
        <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
          Customer Orders Received ({orderItems.length})
        </h1>
        <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
          Update fulfillment statuses as items are packaged, dispatched, and delivered.
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

      {orderItems.length === 0 ? (
        <div className="dm-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Package size={50} style={{ color: 'var(--color-gold)', opacity: 0.6, marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>No Orders Yet</h3>
          <p style={{ color: 'var(--text-dim)' }}>
            When patrons purchase your handcrafted products, orders will appear here for fulfillment.
          </p>
        </div>
      ) : (
        <div className="dm-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="dm-table">
              <thead>
                <tr>
                  <th>Product Sold</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Payout</th>
                  <th>Update Order Status</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                          alt={item.product?.name}
                          style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: '#FFF' }}>{item.product?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Item #{item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: '600' }}>{item.quantity} pcs</td>
                    <td>₹{Number(item.unitPrice).toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: '800', color: 'var(--color-gold)' }}>
                      ₹{Number(item.totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      {/* Status Update Dropdown for the parent order */}
                      <select
                        disabled={updatingId === item.id}
                        defaultValue="PROCESSING"
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className="form-select"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '150px' }}
                      >
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
