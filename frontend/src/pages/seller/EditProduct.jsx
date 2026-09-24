import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getCategories, updateProduct } from '../../services/api';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          getProductById(id),
          getCategories()
        ]);
        const p = prodRes.data;
        setCategories(catRes.data);
        setFormData({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          stockQuantity: p.stockQuantity || 0,
          categoryId: p.category?.id || '',
          imageUrl: p.imageUrl || '',
          status: p.status || 'ACTIVE',
        });
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(formData.price) <= 0) {
      setError('Price must be greater than zero');
      return;
    }

    try {
      setSaving(true);
      await updateProduct(id, {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        categoryId: parseInt(formData.categoryId, 10),
      });
      navigate('/seller/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Product Data...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem', maxWidth: '800px' }}>
      <Link to="/seller/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Back to My Products
      </Link>

      <div className="dm-card-glass" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-brown" style={{ marginBottom: '0.4rem' }}>Modify Listing</span>
          <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>Edit Product</h1>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Product Title / Name *</label>
            <input
              type="text"
              name="name"
              required
              className="form-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="categoryId"
                required
                className="form-select"
                value={formData.categoryId}
                onChange={handleChange}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Listing Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Price (INR ₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                name="price"
                required
                className="form-input"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Inventory Stock Quantity *</label>
              <input
                type="number"
                min="0"
                name="stockQuantity"
                required
                className="form-input"
                value={formData.stockQuantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">High-Resolution Image URL</label>
            <input
              type="url"
              name="imageUrl"
              className="form-input"
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Description & Details *</label>
            <textarea
              name="description"
              required
              rows="4"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-gold"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            <Save size={18} />
            <span>{saving ? 'Updating Product...' : 'Save Product Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
