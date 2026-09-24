import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders, getCart } from '../services/api';
import { ShoppingBag, ShoppingCart, Clock, User, Package, ArrowRight, ShieldCheck } from 'lucide-react';

const BuyerDashboard = () => {
  const { user, cartCount } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [ordersRes, cartRes] = await Promise.all([
          getOrders(),
          getCart().catch(() => ({ data: null }))
        ]);
        setRecentOrders(ordersRes.data.slice(0, 3));
        setCart(cartRes.data);
      } catch (err) {
        console.error('Failed to load buyer dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 5rem' }}>
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-pink" style={{ marginBottom: '0.4rem' }}>Buyer Portal</span>
          <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
            Welcome back, {user?.fullName}!
          </h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.95rem' }}>
            Account: {user?.email} • Buyer ID: #{user?.id}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/products" className="btn btn-gold btn-sm">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
          <Link to="/buyer/profile" className="btn btn-outline btn-sm">
            <User size={16} /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem', fontWeight: '600' }}>Active Cart Items</span>
            <div style={{ color: 'var(--color-gold)', backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '0.5rem', borderRadius: '50%' }}>
              <ShoppingCart size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
            {cartCount}
          </div>
          <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-gold)', fontSize: '0.85rem', marginTop: '0.5rem', textDecoration: 'none' }}>
            View Shopping Cart <ArrowRight size={14} />
          </Link>
        </div>

        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem', fontWeight: '600' }}>Total Orders Placed</span>
            <div style={{ color: '#bbf7d0', backgroundColor: 'rgba(128, 128, 0, 0.2)', padding: '0.5rem', borderRadius: '50%' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#bbf7d0', fontFamily: 'var(--font-serif)' }}>
            {recentOrders.length > 0 ? recentOrders.length : 0}
          </div>
          <Link to="/buyer/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-gold)', fontSize: '0.85rem', marginTop: '0.5rem', textDecoration: 'none' }}>
            View Order History <ArrowRight size={14} />
          </Link>
        </div>

        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem', fontWeight: '600' }}>Buyer Protection</span>
            <div style={{ color: '#fed7aa', backgroundColor: 'rgba(162, 85, 36, 0.2)', padding: '0.5rem', borderRadius: '50%' }}>
              <ShieldCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-gold)' }}>
            100% Guaranteed
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem' }}>
            Insured shipment and verified master artisans.
          </p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="dm-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.3rem' }}>Recent Order Activity</h3>
            <p style={{ color: 'var(--color-light-pink)', fontSize: '0.85rem' }}>Track your latest purchases and deliveries</p>
          </div>
          <Link to="/buyer/orders" className="btn btn-outline btn-sm">
            All Orders ({recentOrders.length})
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-dim)' }}>
            <Package size={40} style={{ color: 'var(--color-gold)', marginBottom: '0.75rem', opacity: 0.6 }} />
            <div>You haven't placed any orders yet.</div>
            <Link to="/products" className="btn btn-gold btn-sm" style={{ marginTop: '1rem' }}>
              Explore Products Now
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="dm-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Placed On</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: '700', color: 'var(--color-gold)' }}>{order.orderNumber}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: '700' }}>₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <span className={`badge ${
                        order.orderStatus === 'DELIVERED' ? 'badge-olive' :
                        order.orderStatus === 'SHIPPED' ? 'badge-gold' :
                        order.orderStatus === 'PROCESSING' ? 'badge-pink' : 'badge-brown'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td><span className="badge badge-olive">{order.paymentStatus}</span></td>
                    <td>
                      <Link to={`/buyer/orders/${order.id}`} className="btn btn-outline btn-sm" style={{ padding: '0.3rem 0.7rem' }}>
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
