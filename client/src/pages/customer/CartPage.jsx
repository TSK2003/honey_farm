import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const { addToast } = useToast();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const shippingCharge = cartSubtotal >= 500 || cartSubtotal === 0 ? 0 : 50;
  const grandTotal = Math.max(0, cartSubtotal + shippingCharge - discount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('khf_customer_token')}`
        },
        body: JSON.stringify({ code: couponCode.trim(), subtotal: cartSubtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Invalid coupon', 'error');
        return;
      }
      setDiscount(data.discount);
      setAppliedCoupon(data.coupon);
      addToast('Coupon applied successfully!', 'success');
    } catch (err) {
      addToast('Error applying coupon', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h3>Your Honey Cart is Empty</h3>
          <p>Explore our natural honey collections and add items to your cart.</p>
          <Link to="/shop" className="btn btn-primary">
            SHOP HONEY NOW
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page section">
      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
        }
        .cart-table {
          width: 100%;
          border-collapse: collapse;
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
        }
        .cart-table th {
          background: #FBF8F3;
          padding: 12px 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
        }
        .cart-table td {
          padding: 16px;
          border-top: 1px solid #E5E0D8;
          vertical-align: middle;
        }
        .cart-item-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 4px;
        }
        .order-summary-box {
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          padding: 24px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
        }
        @media (max-width: 850px) {
          .cart-layout { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>Shopping Cart</h2>

        <div className="cart-layout">
          {/* Cart Items */}
          <div>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Weight</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.variant_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={item.image} alt={item.name} className="cart-item-img" />
                        <div>
                          <Link to={`/product/${item.slug}`} style={{ fontWeight: 600, color: '#2C1810' }}>
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td>{item.weight}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <div className="qty-picker">
                        <button className="qty-btn" onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}>-</button>
                        <span className="qty-val">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</td>
                    <td>
                      <button 
                        onClick={() => removeFromCart(item.variant_id)}
                        style={{ color: '#C44B3F', fontSize: '13px', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Box */}
          <div>
            <div className="order-summary-box">
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid #E5E0D8', paddingBottom: '12px' }}>Order Summary</h3>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} style={{ marginBottom: '20px', display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ textTransform: 'uppercase' }}
                />
                <button type="submit" className="btn btn-outline btn-sm">Apply</button>
              </form>

              {appliedCoupon && (
                <div style={{ background: '#E8F5E9', color: '#4A7C59', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', marginBottom: '16px' }}>
                  ✓ Coupon "{appliedCoupon.code}" applied!
                </div>
              )}

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCharge === 0 ? <strong style={{ color: '#4A7C59' }}>FREE</strong> : `₹${shippingCharge}`}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row" style={{ color: '#4A7C59' }}>
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="summary-row" style={{ borderTop: '1px solid #E5E0D8', paddingTop: '12px', marginTop: '12px', fontSize: '18px', fontWeight: 700 }}>
                <span>Total</span>
                <span style={{ color: '#C17817' }}>₹{grandTotal}</span>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button 
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    if (!customer) {
                      addToast('Please login to proceed to checkout', 'info');
                      navigate('/login?redirect=checkout');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
