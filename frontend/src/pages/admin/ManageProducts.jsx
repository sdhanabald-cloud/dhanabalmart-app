import React, { useEffect, useState } from 'react';
import { getAdminProducts, deleteProduct } from '../../services/api';
import { Package, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminProducts();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the platform?`)) {
      return;
    }

    try {
      await deleteProduct(id);
      setMsg({ text: `Product "${name}" deleted from marketplace`, type: 'success' });
      setProducts(products.filter(p => p.id !== id));
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    } catch (err) {
      setMsg({ text: err.response?.data?.error || 'Failed to delete product', type: 'error' });
      setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Marketplace Catalog...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-olive" style={{ marginBottom: '0.4rem' }}>Catalog Moderation</span>
        <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
          All Marketplace Listings ({products.length})
        </h1>
        <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
          Supervise active and inactive goods across all registered merchants.
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
                <th>Product</th>
                <th>Seller Store</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Moderation</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                        alt={p.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                      <div>
                        <div style={{ fontWeight: '700', color: '#FFF' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: #{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: 'var(--color-gold)', fontWeight: '600' }}>
                      {p.seller?.storeName}
                    </span>
                  </td>
                  <td>{p.category?.name}</td>
                  <td style={{ fontWeight: '700' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td>{p.stockQuantity} pcs</td>
                  <td>
                    <span className={`badge ${p.stockQuantity > 0 ? 'badge-olive' : 'badge-danger'}`}>
                      {p.stockQuantity <= 0 ? 'OUT_OF_STOCK' : p.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="btn btn-sm"
                      style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #ef4444', color: '#fca5a5' }}
                      title="Delete Product from Platform"
                    >
                      <Trash2 size={14} /> Remove
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

export default ManageProducts;
