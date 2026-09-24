import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCart, checkout, getProfile } from '../../services/api';
import { CreditCard, Smartphone, Building, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, refreshCartCount } = useAuth();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Shipping details state
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');

  useEffect(() => {
    const initCheckout = async () => {
      try {
        setLoading(true);
        const [cartRes, profileRes] = await Promise.all([
          getCart(),
          getProfile()
        ]);

        if (!cartRes.data?.items || cartRes.data.items.length === 0) {
          navigate('/cart');
          return;
        }

        setCart(cartRes.data);
        if (profileRes.data) {
          // Pre-populate shipping address if exists
          const buyer = profileRes.data;
          setShippingAddress('Flat 402, Peacock Heights, Adyar, Chennai - 600020');
        }
      } catch (err) {
        console.error('Error loading checkout:', err);
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (Number(item.priceAtAddition) * item.quantity), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setError('Please provide a complete shipping address');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const res = await checkout({
        shippingAddress: shippingAddress.trim(),
        paymentMethod: paymentMethod,
      });

      await refreshCartCount();
      navigate('/orders/confirmation', { state: { order: res.data } });
    } catch (err) {
      setError(err.response?.data?.error || 'Order placement failed. Please verify stock.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--color-gold)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)' }}>Preparing Checkout...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>Final Step</span>
        <h1 className="gold-heading" style={{ fontSize: '2.5rem' }}>Express Checkout</h1>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {/* Left Column: Delivery Address & Payment Method */}
          <div style={{ flex: '1 1 60%' }}>
            {/* Delivery Address Card */}
            <div className="dm-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                1. Delivery & Shipping Address
              </h3>

              <div className="form-group">
                <label className="form-label">Complete Shipping Address *</label>
                <textarea
                  required
                  rows="3"
                  className="form-textarea"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Apartment / Door No, Street Name, City, State, PIN Code"
                />
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Shipments are insured and delivered in tamper-evident security packaging.
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="dm-card">
              <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', marginBottom: '1.25rem' }}>
                2. Select Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {/* Credit / Debit Card */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: paymentMethod === 'CARD' ? 'rgba(212, 175, 55, 0.15)' : 'var(--color-peacock-dark)',
                  border: paymentMethod === 'CARD' ? '1px solid var(--color-gold)' : '1px solid rgba(232, 201, 207, 0.2)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                  />
                  <CreditCard size={22} color="var(--color-gold)" />
                  <div>
                    <div style={{ fontWeight: '700', color: '#FFF' }}>Credit / Debit Card (Visa, MasterCard, RuPay)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Simulated 256-bit SSL encrypted transaction</div>
                  </div>
                </label>

                {/* Instant UPI */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: paymentMethod === 'UPI' ? 'rgba(212, 175, 55, 0.15)' : 'var(--color-peacock-dark)',
                  border: paymentMethod === 'UPI' ? '1px solid var(--color-gold)' : '1px solid rgba(232, 201, 207, 0.2)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                  />
                  <Smartphone size={22} color="var(--color-gold)" />
                  <div>
                    <div style={{ fontWeight: '700', color: '#FFF' }}>UPI (GooglePay / PhonePe / BHIM)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Instant UPI ID QR payment simulation</div>
                  </div>
                </label>

                {/* Net Banking */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: paymentMethod === 'NET_BANKING' ? 'rgba(212, 175, 55, 0.15)' : 'var(--color-peacock-dark)',
                  border: paymentMethod === 'NET_BANKING' ? '1px solid var(--color-gold)' : '1px solid rgba(232, 201, 207, 0.2)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="NET_BANKING"
                    checked={paymentMethod === 'NET_BANKING'}
                    onChange={() => setPaymentMethod('NET_BANKING')}
                  />
                  <Building size={22} color="var(--color-gold)" />
                  <div>
                    <div style={{ fontWeight: '700', color: '#FFF' }}>Net Banking</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>All major Indian scheduled banks supported</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review Sidebar */}
          <div style={{ flex: '1 1 40%' }}>
            <div className="dm-card-glass" style={{ padding: '2rem' }}>
              <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(232, 201, 207, 0.15)', paddingBottom: '0.75rem' }}>
                Purchase Summary ({items.length} items)
              </h3>

              {/* Items Mini List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', color: 'var(--color-gold)' }}>{item.quantity}x</span>
                      <span style={{ color: '#FFF', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product?.name}
                      </span>
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--color-gold)' }}>
                      ₹{(Number(item.priceAtAddition) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div style={{ borderTop: '1px solid rgba(232, 201, 207, 0.15)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-light-pink)' }}>
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-light-pink)' }}>
                  <span>Shipping:</span>
                  <span style={{ color: 'var(--color-gold)' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(212, 175, 55, 0.3)', paddingTop: '0.75rem' }}>
                  <span style={{ fontWeight: '700', color: '#FFF' }}>Grand Total:</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>
                    ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-gold"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1.1rem', marginBottom: '1rem' }}
              >
                <span>{submitting ? 'Confirming Order...' : 'Authorize & Place Order'}</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--color-light-pink)', fontSize: '0.8rem', textAlign: 'center' }}>
                <ShieldCheck size={16} color="var(--color-gold)" /> DhanabalMart 100% Purchase Guarantee
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
