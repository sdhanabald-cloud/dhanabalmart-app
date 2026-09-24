import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSellerProducts, deleteProduct } from '../../services/api';
import { Plus, Edit, Trash2, Package, AlertCircle, CheckCircle } from 'lucide-react';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getSellerProducts();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from DhanabalMart?`)) {
      return;
    }

    try {
      await deleteProduct(id);
      setMsg({ text: `Product "${name}" deleted successfully`, type: 'success' });
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
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Seller Catalog...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-brown" style={{ marginBottom: '0.4rem' }}>Inventory Control</span>
          <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>
            My Products Catalog ({products.length})
          </h1>
        </div>

        <Link to="/seller/products/add" className="btn btn-gold">
          <Plus size={18} /> Add New Product
        </Link>
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

      {products.length === 0 ? (
        <div className="dm-card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Package size={50} style={{ color: 'var(--color-gold)', opacity: 0.6, marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>No Products Listed</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '1.5rem' }}>You haven't listed any items in your store yet.</p>
          <Link to="/seller/products/add" className="btn btn-gold btn-sm">
            <Plus size={16} /> Publish Your First Product
          </Link>
        </div>
      ) : (
        <div className="dm-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="dm-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th>Category</th>
                  <th>Unit Price</th>
                  <th>Stock Available</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                          alt={p.name}
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', color: '#FFF' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: #{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.category?.name}</td>
                    <td style={{ fontWeight: '700', color: 'var(--color-gold)' }}>₹{Number(p.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <span style={{ fontWeight: '700', color: p.stockQuantity <= 5 ? '#fca5a5' : '#FFF' }}>
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        p.status === 'ACTIVE' && p.stockQuantity > 0 ? 'badge-olive' :
                        p.status === 'OUT_OF_STOCK' || p.stockQuantity <= 0 ? 'badge-danger' : 'badge-pink'
                      }`}>
                        {p.stockQuantity <= 0 ? 'OUT_OF_STOCK' : p.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link to={`/seller/products/edit/${p.id}`} className="btn btn-outline btn-sm" title="Edit Product">
                          <Edit size={14} /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="btn btn-sm"
                          style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #ef4444', color: '#fca5a5' }}
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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

export default ManageProducts;
