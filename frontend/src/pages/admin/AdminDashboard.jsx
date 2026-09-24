import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, getAdminOrders } from '../../services/api';
import { Shield, Users, Store, Package, DollarSign, ArrowRight, CheckCircle, Clock } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
          getAdminStats(),
          getAdminOrders()
        ]);
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Admin Portal Analytics...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-olive" style={{ marginBottom: '0.4rem' }}>Executive Console</span>
          <h1 className="gold-heading" style={{ fontSize: '2.4rem' }}>Admin Platform Dashboard</h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
            System health, compliance verifications, and marketplace metrics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/sellers" className="btn btn-gold btn-sm">
            <Store size={16} /> Review Sellers
          </Link>
          <Link to="/admin/reports" className="btn btn-outline btn-sm">
            Platform Reports
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)', fontWeight: '600' }}>Platform Revenue</span>
            <DollarSign size={20} color="var(--color-gold)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: '900', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
            ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', display: 'block' }}>
            Cumulative marketplace GMV
          </span>
        </div>

        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)', fontWeight: '600' }}>Total Orders</span>
            <Package size={20} color="#bbf7d0" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#bbf7d0', fontFamily: 'var(--font-serif)' }}>
            {stats?.totalOrders || 0}
          </div>
          <Link to="/admin/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-gold)', fontSize: '0.8rem', marginTop: '0.5rem', textDecoration: 'none' }}>
            View All Orders <ArrowRight size={12} />
          </Link>
        </div>

        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)', fontWeight: '600' }}>Pending Sellers</span>
            <Clock size={20} color={stats?.pendingSellers > 0 ? '#fca5a5' : '#bbf7d0'} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: stats?.pendingSellers > 0 ? '#fca5a5' : '#bbf7d0', fontFamily: 'var(--font-serif)' }}>
            {stats?.pendingSellers || 0}
          </div>
          <Link to="/admin/sellers" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-gold)', fontSize: '0.8rem', marginTop: '0.5rem', textDecoration: 'none' }}>
            Approve Applications <ArrowRight size={12} />
          </Link>
        </div>

        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)', fontWeight: '600' }}>Registered Users</span>
            <Users size={20} color="var(--color-gold)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
            {stats?.totalUsers || 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', display: 'block' }}>
            Buyers & Sellers onboarded
          </span>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-3" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        <Link to="/admin/sellers" className="dm-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--color-gold)' }}>
            <Store size={26} />
          </div>
          <div>
            <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Manage Sellers</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Verify GSTIN and approve merchant stores</p>
          </div>
        </Link>

        <Link to="/admin/buyers" className="dm-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(232, 201, 207, 0.15)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--color-light-pink)' }}>
            <Users size={26} />
          </div>
          <div>
            <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Manage Buyers</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Review buyer accounts and shipping profiles</p>
          </div>
        </Link>

        <Link to="/admin/products" className="dm-card" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'rgba(128, 128, 0, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#bbf7d0' }}>
            <Package size={26} />
          </div>
          <div>
            <h3 style={{ color: '#FFF', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Platform Catalog</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Supervise all live marketplace listings</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="dm-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(232, 201, 207, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>Recent Marketplace Transactions</h3>
          <Link to="/admin/orders" className="btn btn-outline btn-sm">All Orders</Link>
        </div>

        <div className="table-responsive">
          <table className="dm-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Date</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Order Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: '700', color: 'var(--color-gold)', fontFamily: 'monospace' }}>{ord.orderNumber}</td>
                  <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                  <td>{ord.buyer?.user?.fullName || 'Verified Buyer'}</td>
                  <td style={{ fontWeight: '800' }}>₹{Number(ord.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <span className={`badge ${
                      ord.orderStatus === 'DELIVERED' ? 'badge-olive' :
                      ord.orderStatus === 'SHIPPED' ? 'badge-gold' :
                      ord.orderStatus === 'PROCESSING' ? 'badge-pink' : 'badge-brown'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td><span className="badge badge-olive">{ord.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
