import React, { useEffect, useState } from 'react';
import { getAdminOrders } from '../../services/api';
import { Package, Calendar, ShoppingBag } from 'lucide-react';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getAdminOrders();
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load admin orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Marketplace Transactions...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-olive" style={{ marginBottom: '0.4rem' }}>Transaction Oversight</span>
        <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
          All Marketplace Orders ({orders.length})
        </h1>
        <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
          Real-time order registry across all buyers and participating sellers.
        </p>
      </div>

      <div className="dm-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="dm-table">
            <thead>
              <tr>
                <th>Order Reference</th>
                <th>Buyer</th>
                <th>Order Date</th>
                <th>Items Ordered</th>
                <th>Total Value</th>
                <th>Fulfillment Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: '700', color: 'var(--color-gold)', fontFamily: 'monospace' }}>
                    {o.orderNumber}
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '600', color: '#FFF' }}>{o.buyer?.user?.fullName || 'Customer'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{o.buyer?.user?.email}</div>
                    </div>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{o.items?.length || 0} line item(s)</td>
                  <td style={{ fontWeight: '800', color: 'var(--color-gold)' }}>
                    ₹{Number(o.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`badge ${
                      o.orderStatus === 'DELIVERED' ? 'badge-olive' :
                      o.orderStatus === 'SHIPPED' ? 'badge-gold' :
                      o.orderStatus === 'PROCESSING' ? 'badge-pink' : 'badge-brown'
                    }`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-olive">{o.paymentStatus}</span>
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

export default ManageOrders;
