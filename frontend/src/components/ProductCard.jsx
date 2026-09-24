import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addToCart } from '../services/api';
import { ShoppingCart, Eye, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { user, isBuyer, refreshCartCount } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login/buyer');
      return;
    }

    if (!isBuyer) {
      setErrorMsg('Only registered buyers can add to cart');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    try {
      setAdding(true);
      await addToCart(product.id, 1);
      await refreshCartCount();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to add item');
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  const isOutOfStock = product.stockQuantity <= 0 || product.status === 'OUT_OF_STOCK';

  return (
    <div className="dm-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
      {/* Product Image */}
      <Link to={`/products/${product.id}`} style={{ position: 'relative', width: '100%', paddingTop: '75%', display: 'block', backgroundColor: 'var(--color-peacock-dark)' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';
          }}
        />
        {/* Category Tag */}
        {product.category && (
          <span className="badge badge-gold" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2 }}>
            {product.category.name}
          </span>
        )}
        {/* Stock Badge */}
        <span
          className={`badge ${isOutOfStock ? 'badge-danger' : 'badge-olive'}`}
          style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}
        >
          {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} In Stock`}
        </span>
      </Link>

      {/* Product Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Seller / Store Name */}
          <div style={{ fontSize: '0.75rem', color: 'var(--color-light-pink)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>Sold by:</span>
            <span style={{ color: 'var(--color-gold)', fontWeight: '600' }}>
              {product.seller?.storeName || 'DhanabalMart Verified'}
            </span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: '#FFF' }}>
            <h3 style={{
              fontSize: '1.05rem',
              fontWeight: '700',
              lineHeight: '1.4',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              minHeight: '2.8rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {product.name}
            </h3>
          </Link>

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-dim)',
            lineHeight: '1.5',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {product.description}
          </p>
        </div>

        <div>
          {/* Price and Cart Action */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', borderTop: '1px solid rgba(232, 201, 207, 0.15)', paddingTop: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-light-pink)', display: 'block' }}>Price</span>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <Link to={`/products/${product.id}`} className="btn btn-outline btn-sm" title="View Details">
                <Eye size={16} />
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || adding}
                className={`btn btn-sm ${added ? 'btn-olive' : 'btn-gold'}`}
                title="Add to Shopping Cart"
              >
                {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                <span>{added ? 'Added' : 'Add'}</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.4rem', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
