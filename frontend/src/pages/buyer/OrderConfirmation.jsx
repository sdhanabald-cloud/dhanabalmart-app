import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, ShoppingBag } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return <Navigate to="/buyer/orders" replace />;
  }

  return (
    <div className="container" style={{ padding: '5rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="dm-card-glass" style={{ width: '100%', maxWidth: '640px', padding: '3rem', textAlign: 'center' }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'rgba(128, 128, 0, 0.25)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#bbf7d0',
          marginBottom: '1.5rem',
          border: '2px solid var(--color-olive)'
        }}>
          <CheckCircle2 size={42} />
        </div>

        <span className="badge badge-olive" style={{ marginBottom: '0.75rem' }}>Payment Successful</span>
        <h1 className="gold-heading" style={{ fontSize: '2.4rem', marginBottom: '0.75rem' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: 'var(--color-light-pink)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          Thank you for patronizing DhanabalMart mastercraftsmen and farmers. We have received your order and dispatched fulfillment instructions to the respective sellers.
        </p>

        {/* Order Details Summary Box */}
        <div className="dm-card" style={{ textAlign: 'left', marginBottom: '2.5rem', backgroundColor: 'var(--color-peacock-dark)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(232, 201, 207, 0.15)', paddingBottom: '0.75rem' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.85rem' }}>Order Tracking Number</span>
            <strong style={{ color: 'var(--color-gold)', fontFamily: 'monospace', fontSize: '1rem' }}>{order.orderNumber}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.85rem' }}>Total Amount Paid</span>
            <strong style={{ color: '#FFF' }}>₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.85rem' }}>Order Status</span>
            <span className="badge badge-gold">{order.orderStatus}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.85rem' }}>Delivering to:</span>
            <span style={{ color: '#FFF', fontSize: '0.85rem', maxWidth: '280px', textAlign: 'right' }}>{order.shippingAddress}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/buyer/orders" className="btn btn-gold">
            <Package size={18} /> View My Orders
          </Link>
          <Link to="/products" className="btn btn-outline">
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
