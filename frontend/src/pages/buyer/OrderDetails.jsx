import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../../services/api';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle } from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Order Details...</h2>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: '#f87171' }}>Order Not Found</h2>
        <p style={{ color: 'var(--text-dim)', margin: '1rem 0 2rem' }}>{error || 'Unable to locate order.'}</p>
        <Link to="/buyer/orders" className="btn btn-gold">Back to My Orders</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <Link to="/buyer/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Back to Orders History
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>Official Invoice</span>
          <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
            Order {order.orderNumber}
          </h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div>
          <span className={`badge ${
            order.orderStatus === 'DELIVERED' ? 'badge-olive' :
            order.orderStatus === 'SHIPPED' ? 'badge-gold' :
            order.orderStatus === 'PROCESSING' ? 'badge-pink' : 'badge-brown'
          }`} style={{ fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
            Status: {order.orderStatus}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Items List Card */}
        <div style={{ flex: '1 1 65%' }}>
          <div className="dm-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(232, 201, 207, 0.15)', fontWeight: '700', color: 'var(--color-gold)' }}>
              Ordered Items ({order.items?.length || 0})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {order.items?.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(232, 201, 207, 0.08)', gap: '1.25rem' }}>
                  <img
                    src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'}
                    alt={item.product?.name}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ flex: '1 1 200px' }}>
                    <div style={{ fontWeight: '700', fontSize: '1rem', color: '#FFF' }}>{item.product?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-light-pink)', marginTop: '0.2rem' }}>
                      Sold by: <span style={{ color: 'var(--color-gold)' }}>{item.seller?.storeName}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                      ₹{Number(item.unitPrice).toLocaleString('en-IN')} x {item.quantity}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                      ₹{Number(item.totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(212, 175, 55, 0.25)' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-light-pink)' }}>Grand Total Paid: </span>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', marginLeft: '0.5rem' }}>
                  ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div style={{ flex: '1 1 35%' }}>
          <div className="dm-card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} /> Delivery Address
            </h3>
            <p style={{ color: '#FFF', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {order.shippingAddress}
            </p>
          </div>

          <div className="dm-card">
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} /> Payment Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-light-pink)' }}>Status:</span>
                <span className="badge badge-olive">{order.paymentStatus}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-light-pink)' }}>Amount:</span>
                <span style={{ fontWeight: '700', color: 'var(--color-gold)' }}>₹{Number(order.totalAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
