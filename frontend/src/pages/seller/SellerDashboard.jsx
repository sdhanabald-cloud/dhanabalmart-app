import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSellerProducts, getSellerOrders } from '../../services/api';
import { Store, Plus, Package, ShoppingCart, DollarSign, ArrowRight, AlertTriangle } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        const [prodRes, ordRes] = await Promise.all([
          getSellerProducts(),
          getSellerOrders()
        ]);
        setProducts(prodRes.data);
        setOrders(ordRes.data);
      } catch (err) {
        console.error('Failed to load seller dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, []);

  const totalRevenue = orders.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  const lowStockCount = products.filter(p => p.stockQuantity <= 5).length;

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-brown" style={{ marginBottom: '0.4rem' }}>Merchant Workspace</span>
          <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
            {user?.storeName || 'Artisan Merchant Store'}
          </h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
            Manager: {user?.fullName} • Merchant Email: {user?.email}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/seller/products/add" className="btn btn-gold btn-sm">
            <Plus size={16} /> Add New Product
          </Link>
          <Link to="/seller/profile" className="btn btn-outline btn-sm">
            Store Profile
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4" style={{ gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)', fontWeight: '600' }}>Active Listings</span>
            <Package size={20} color="var(--color-gold)" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
            {products.length}
          </div>
          <Link to="/seller/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-gold)', fontSize: '0.8rem', marginTop: '0.5rem', textDecoration: 'none' }}>
            Manage Catalog <ArrowRight size={12} />
          </Link>
        </div>

        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)', fontWeight: '600' }}>Customer Orders</span>
            <ShoppingCart size={20} color="#bbf7d0" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#bbf7d0', fontFamily: 'var(--font-serif)' }}>
            {orders.length}
          </div>
          <Link to="/seller/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-gold)', fontSize: '0.8rem', marginTop: '0.5rem', textDecoration: 'none' }}>
            Fulfill Orders <ArrowRight size={12} />
          </Link>
        </div>

        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)', fontWeight: '600' }}>Total Sales</span>
            <DollarSign size={20} color="var(--color-gold)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
            ₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', display: 'block' }}>
            Gross fulfilled volume
          </span>
        </div>

        <div className="dm-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)', fontWeight: '600' }}>Low Stock Alerts</span>
            <AlertTriangle size={20} color={lowStockCount > 0 ? '#fca5a5' : '#bbf7d0'} />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: lowStockCount > 0 ? '#fca5a5' : '#bbf7d0', fontFamily: 'var(--font-serif)' }}>
            {lowStockCount}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', display: 'block' }}>
            Items with ≤ 5 units
          </span>
        </div>
      </div>

      {/* Quick Catalog Preview */}
      <div className="dm-card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>Your Published Products</h3>
          <Link to="/seller/products" className="btn btn-outline btn-sm">View All ({products.length})</Link>
        </div>

        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
            No products listed yet. Click "+ Add New Product" to list your first item.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="dm-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                          alt={p.name}
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                        <span style={{ fontWeight: '600' }}>{p.name}</span>
                      </div>
                    </td>
                    <td>{p.category?.name}</td>
                    <td style={{ fontWeight: '700', color: 'var(--color-gold)' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td>{p.stockQuantity} units</td>
                    <td>
                      <span className={`badge ${p.stockQuantity > 0 ? 'badge-olive' : 'badge-danger'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/seller/products/edit/${p.id}`} className="btn btn-outline btn-sm">
                        Edit
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

export default SellerDashboard;
