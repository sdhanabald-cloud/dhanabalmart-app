import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw, Plus, Minus, Check, Store } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isBuyer, refreshCartCount } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        setErrorMsg('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    const nextVal = quantity + delta;
    if (nextVal >= 1 && (!product || nextVal <= product.stockQuantity)) {
      setQuantity(nextVal);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login/buyer');
      return;
    }
    if (!isBuyer) {
      setErrorMsg('Only buyers can add products to cart');
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id, quantity);
      await refreshCartCount();
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to add item to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (user && isBuyer) {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Product Details...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-gold)' }}>Product Not Found</h2>
        <p style={{ color: 'var(--text-dim)', margin: '1rem 0 2rem' }}>The product you are looking for does not exist or has been retired.</p>
        <Link to="/products" className="btn btn-gold">Back to Catalog</Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0 || product.status === 'OUT_OF_STOCK';

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      {/* Back button */}
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3.5rem' }}>
        {/* Product Image Section */}
        <div>
          <div className="dm-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'}
              alt={product.name}
              style={{ width: '100%', height: '480px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div>
          {/* Category & Status */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
            {product.category && (
              <span className="badge badge-gold">{product.category.name}</span>
            )}
            <span className={`badge ${isOutOfStock ? 'badge-danger' : 'badge-olive'}`}>
              {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} Available in Stock`}
            </span>
          </div>

          {/* Title */}
          <h1 className="gold-heading" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', lineHeight: '1.25', marginBottom: '1rem' }}>
            {product.name}
          </h1>

          {/* Seller Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: 'rgba(232, 201, 207, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(232, 201, 207, 0.2)', marginBottom: '1.5rem' }}>
            <Store size={18} color="var(--color-gold)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)' }}>Sold & Shipped by:</span>
            <strong style={{ color: 'var(--color-gold)', fontSize: '0.9rem' }}>
              {product.seller?.storeName || 'DhanabalMart Official'}
            </strong>
          </div>

          {/* Price */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-light-pink)' }}>Inclusive of all taxes</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
              ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--color-light-pink)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Product Story & Details
            </h4>
            <p style={{ color: 'var(--text-dim)', lineHeight: '1.8', fontSize: '1rem' }}>
              {product.description}
            </p>
          </div>

          {/* Quantity and Actions */}
          {!isOutOfStock ? (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: '600', color: 'var(--color-light-pink)', fontSize: '0.9rem' }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '0.5rem 0.8rem', cursor: 'pointer' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ padding: '0.5rem 1rem', fontWeight: '700', minWidth: '40px', textAlign: 'center', color: 'var(--color-gold)' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockQuantity}
                    style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '0.5rem 0.8rem', cursor: 'pointer' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`btn ${added ? 'btn-olive' : 'btn-gold'}`}
                  style={{ flex: '1 1 200px', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
                >
                  {added ? <Check size={18} /> : <ShoppingCart size={18} />}
                  <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn btn-brown"
                  style={{ flex: '1 1 200px', padding: '0.85rem 1.5rem', fontSize: '1rem' }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ) : (
            <div className="dm-card" style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderColor: '#ef4444', marginBottom: '2rem' }}>
              <div style={{ color: '#fca5a5', fontWeight: '700' }}>Currently Out of Stock</div>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>This product is presently unavailable. Check back soon for inventory restocks.</p>
            </div>
          )}

          {errorMsg && (
            <div style={{ color: '#fca5a5', backgroundColor: 'rgba(220, 38, 38, 0.2)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Guarantees Box */}
          <div style={{ borderTop: '1px solid rgba(232, 201, 207, 0.15)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-light-pink)' }}>
              <ShieldCheck size={18} color="var(--color-gold)" /> Verified authenticity guarantee with official artisan mark
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-light-pink)' }}>
              <Truck size={18} color="var(--color-gold)" /> Express pan-India insured shipping within 48-72 hours
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-light-pink)' }}>
              <RotateCcw size={18} color="var(--color-gold)" /> 7-day hassle-free marketplace return policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
