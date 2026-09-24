import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../services/api';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { user, isBuyer, refreshCartCount } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login/buyer');
      return;
    }
    fetchCart();
  }, [user]);

  const handleUpdateQuantity = async (itemId, currentQty, delta) => {
    const nextQty = currentQty + delta;
    if (nextQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      setUpdating(true);
      const res = await updateCartItem(itemId, nextQty);
      setCart(res.data);
      await refreshCartCount();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdating(true);
      const res = await removeFromCart(itemId);
      setCart(res.data);
      await refreshCartCount();
    } catch (err) {
      alert('Failed to remove item');
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to empty your shopping cart?')) return;
    try {
      setUpdating(true);
      await clearCart();
      setCart({ ...cart, items: [] });
      await refreshCartCount();
    } catch (err) {
      alert('Failed to clear cart');
    } finally {
      setUpdating(false);
    }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    return sum + (Number(item.priceAtAddition) * item.quantity);
  }, 0);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Loading Shopping Cart...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Page Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>Review & Purchase</span>
        <h1 className="gold-heading" style={{ fontSize: '2.5rem' }}>Your Shopping Bag</h1>
      </div>

      {items.length === 0 ? (
        <div className="dm-card" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
          <ShoppingBag size={56} style={{ color: 'var(--color-gold)', marginBottom: '1.25rem', opacity: 0.6 }} />
          <h2 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-dim)', maxWidth: '480px', margin: '0 auto 2rem' }}>
            Looks like you haven't added any authentic goods to your bag yet. Explore our handcrafted silks and spices.
          </p>
          <Link to="/products" className="btn btn-gold">
            Browse All Products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Items List */}
          <div style={{ flex: '1 1 65%' }}>
            <div className="dm-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(232, 201, 207, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', color: 'var(--color-gold)' }}>{items.length} Product(s) Selected</span>
                <button
                  onClick={handleClearCart}
                  disabled={updating}
                  style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <Trash2 size={14} /> Clear Cart
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '1.25rem 1.5rem',
                      borderBottom: '1px solid rgba(232, 201, 207, 0.08)',
                      gap: '1.25rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'}
                      alt={item.product?.name}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                    />

                    {/* Details */}
                    <div style={{ flex: '1 1 200px' }}>
                      <Link to={`/products/${item.product?.id}`} style={{ textDecoration: 'none', color: '#FFF' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                          {item.product?.name}
                        </h4>
                      </Link>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-light-pink)' }}>
                        Seller: <span style={{ color: 'var(--color-gold)' }}>{item.product?.seller?.storeName}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: '700', marginTop: '0.25rem' }}>
                        ₹{Number(item.priceAtAddition).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Quantity Picker */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                        disabled={updating}
                        style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '0.4rem 0.6rem', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '0.4rem 0.8rem', fontWeight: '700', color: 'var(--color-gold)', minWidth: '35px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        disabled={updating}
                        style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '0.4rem 0.6rem', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Subtotal</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                        ₹{(Number(item.priceAtAddition) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={updating}
                      title="Remove product"
                      style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '0.4rem' }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ flex: '1 1 35%' }}>
            <div className="dm-card-glass" style={{ padding: '2rem' }}>
              <h3 style={{ color: 'var(--color-gold)', fontSize: '1.3rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(232, 201, 207, 0.15)', paddingBottom: '0.75rem' }}>
                Order Summary
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-light-pink)' }}>
                  <span>Items Subtotal:</span>
                  <span style={{ fontWeight: '600', color: '#FFF' }}>
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-light-pink)' }}>
                  <span>Estimated Taxes (GST):</span>
                  <span style={{ color: '#bbf7d0' }}>Included in Price</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-light-pink)' }}>
                  <span>Shipping & Delivery:</span>
                  <span style={{ color: 'var(--color-gold)', fontWeight: '700' }}>FREE</span>
                </div>

                <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.3)', paddingTop: '1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFF' }}>Total Payable:</span>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn btn-gold"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem', marginBottom: '1rem' }}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--color-light-pink)', fontSize: '0.8rem', textAlign: 'center' }}>
                <ShieldCheck size={16} color="var(--color-gold)" /> 100% Encrypted & Secure Checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
