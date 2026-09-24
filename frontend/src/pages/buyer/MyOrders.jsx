import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../services/api';
import { Package, Calendar, ChevronRight, Eye } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getOrders();
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Orders History...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-pink" style={{ marginBottom: '0.4rem' }}>Personal History</span>
        <h1 className="gold-heading" style={{ fontSize: '2.4rem' }}>My Orders ({orders.length})</h1>
      </div>

      {orders.length === 0 ? (
        <div className="dm-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Package size={48} style={{ color: 'var(--color-gold)', opacity: 0.6, marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>No Orders Found</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>
            You haven't placed any orders on DhanabalMart yet.
          </p>
          <Link to="/products" className="btn btn-gold btn-sm">
            Browse Marketplace Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {orders.map((order) => (
            <div key={order.id} className="dm-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(232, 201, 207, 0.15)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-light-pink)' }}>Order Reference</div>
                  <div style={{ fontWeight: '800', color: 'var(--color-gold)', fontSize: '1.1rem', fontFamily: 'monospace' }}>
                    {order.orderNumber}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  <Calendar size={15} />
                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>

                <div>
                  <span className={`badge ${
                    order.orderStatus === 'DELIVERED' ? 'badge-olive' :
                    order.orderStatus === 'SHIPPED' ? 'badge-gold' :
                    order.orderStatus === 'PROCESSING' ? 'badge-pink' : 'badge-brown'
                  }`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div>
                  <Link to={`/buyer/orders/${order.id}`} className="btn btn-outline btn-sm">
                    <Eye size={14} /> View Details
                  </Link>
                </div>
              </div>

              {/* Order Items Snapshot */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {order.items?.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <img
                        src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                        alt={item.product?.name}
                        style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                      />
                      <div>
                        <div style={{ fontWeight: '600', color: '#FFF' }}>{item.product?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-light-pink)' }}>
                          Qty: {item.quantity} • Unit: ₹{Number(item.unitPrice).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '700', color: 'var(--color-gold)' }}>
                      ₹{Number(item.totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(232, 201, 207, 0.1)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-light-pink)' }}>Total Order Value:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                  ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
