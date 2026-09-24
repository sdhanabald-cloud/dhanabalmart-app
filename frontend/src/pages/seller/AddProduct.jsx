import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCategories, createProduct } from '../../services/api';
import { ArrowLeft, PlusCircle, AlertCircle, CheckCircle } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: res.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

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
    if (Number(formData.stockQuantity) < 0) {
      setError('Stock quantity cannot be negative');
      return;
    }

    try {
      setLoading(true);
      await createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        categoryId: parseInt(formData.categoryId, 10),
      });
      navigate('/seller/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem', maxWidth: '800px' }}>
      <Link to="/seller/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Back to My Products
      </Link>

      <div className="dm-card-glass" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-brown" style={{ marginBottom: '0.4rem' }}>Catalog Management</span>
          <h1 className="gold-heading" style={{ fontSize: '2.2rem' }}>Add New Product</h1>
          <p style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>
            Publish a handcrafted listing directly to the DhanabalMart public marketplace.
          </p>
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
              placeholder="e.g. Pure Zari Mulberry Silk Saree"
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
                <option value="ACTIVE">ACTIVE (Available in Store)</option>
                <option value="INACTIVE">INACTIVE (Hidden Draft)</option>
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
                placeholder="2499.00"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Stock Quantity *</label>
              <input
                type="number"
                min="0"
                name="stockQuantity"
                required
                className="form-input"
                placeholder="15"
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
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Product Story & Specifications *</label>
            <textarea
              name="description"
              required
              rows="4"
              className="form-textarea"
              placeholder="Describe materials, weave type, authenticity marks, and care instructions..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-gold"
            style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          >
            <PlusCircle size={18} />
            <span>{loading ? 'Publishing Product...' : 'Publish Product to DhanabalMart'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
