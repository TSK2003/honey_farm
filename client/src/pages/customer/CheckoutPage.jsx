import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/firebaseService';

export default function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { customer } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address_line: '',
    city: 'Tirunelveli',
    district: 'Tirunelveli',
    state: 'Tamil Nadu',
    pincode: '627001',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);

  const shippingCharge = cartSubtotal >= 500 ? 0 : 50;
  const grandTotal = cartSubtotal + shippingCharge;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address_line || !formData.city || !formData.pincode) {
      addToast('Please fill in all required shipping fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        variant_id: item.variant_id,
        product_name: item.name,
        variant_weight: item.weight,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));

      const newOrder = await createOrder({
        items: orderItems,
        shipping: formData,
        subtotal: cartSubtotal,
        shipping_charge: shippingCharge,
        total: grandTotal,
        notes: formData.notes
      });

      clearCart();
      addToast('Order placed successfully!', 'success');
      navigate(`/order-success/${newOrder.order_number}`);
    } catch (err) {
      addToast(err.message || 'Error placing order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return <div className="container section"><div className="empty-state"><h3>Your cart is empty</h3></div></div>;
  }

  return (
    <div className="checkout-page section">
      <style>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
        }
        .checkout-form-box {
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .form-section-title {
          font-size: 16px;
          font-weight: 700;
          color: #2C1810;
          margin-bottom: 16px;
          border-bottom: 1px solid #E5E0D8;
          padding-bottom: 8px;
        }
        .payment-option {
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }
        .payment-option.active {
          border-color: #C17817;
          background: #FFF8ED;
        }
        @media (max-width: 850px) {
          .checkout-layout { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>Checkout</h2>

        <form onSubmit={handleSubmitOrder}>
          <div className="checkout-layout">
            {/* Left: Address & Payment */}
            <div>
              {/* Shipping Details */}
              <div className="checkout-form-box">
                <div className="form-section-title">Shipping Address</div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <textarea name="address_line" className="form-textarea" rows="2" value={formData.address_line} onChange={handleChange} required placeholder="House No, Street, Area"></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input type="text" name="city" className="form-input" value={formData.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">District</label>
                    <input type="text" name="district" className="form-input" value={formData.district} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input type="text" name="state" className="form-input" value={formData.state} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode *</label>
                    <input type="text" name="pincode" className="form-input" value={formData.pincode} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-form-box">
                <div className="form-section-title">Payment Method</div>

                <div 
                  className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('COD')}
                >
                  <input type="radio" checked={paymentMethod === 'COD'} onChange={() => {}} />
                  <div>
                    <div style={{ fontWeight: 600 }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '12px', color: '#5C4A3A' }}>Pay cash when your natural honey is delivered</div>
                  </div>
                </div>

                <div className="payment-option" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                  <input type="radio" disabled />
                  <div>
                    <div style={{ fontWeight: 600 }}>Online Payment (UPI, Cards, NetBanking)</div>
                    <div style={{ fontSize: '12px', color: '#C17817', fontWeight: 600 }}>Coming Soon</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="checkout-form-box">
                <div className="form-section-title">Your Honey Order</div>

                <div style={{ marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
                  {cart.map(item => (
                    <div key={item.variant_id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <span>{item.name} ({item.weight}) × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-row" style={{ borderTop: '1px solid #E5E0D8', paddingTop: '12px' }}>
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span>
                </div>

                <div className="summary-row" style={{ borderTop: '1px solid #E5E0D8', paddingTop: '12px', fontSize: '18px', fontWeight: 700 }}>
                  <span>Total Payable</span>
                  <span style={{ color: '#C17817' }}>₹{grandTotal}</span>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    style={{ width: '100%' }}
                    disabled={submitting}
                  >
                    {submitting ? 'Placing Order...' : 'PLACE ORDER NOW'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
