import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { validateCoupon } from '../../services/firebaseService';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const { addToast } = useToast();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [applying, setApplying] = useState(false);

  const shippingCharge = cartSubtotal >= 500 || cartSubtotal === 0 ? 0 : 50;
  const grandTotal = Math.max(0, cartSubtotal + shippingCharge - discount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    try {
      const { coupon, discount: discAmt } = await validateCoupon(couponCode.trim(), cartSubtotal);
      setDiscount(discAmt);
      setAppliedCoupon(coupon);
      addToast(`Coupon "${coupon.code}" applied! You saved ₹${discAmt}`, 'success');
    } catch (err) {
      addToast(err.message || 'Invalid coupon code', 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  if (cart.length === 0) {
    return (
      <div className="container section">
        <div className="empty-state" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: '#FFF8ED', color: '#C17817', marginBottom: '16px' }}>
            <ShoppingCart size={42} />
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#2C1810', marginBottom: '8px' }}>Your Honey Cart is Empty</h3>
          <p style={{ color: '#5C4A3A', maxWidth: '380px', margin: '0 auto 24px' }}>Explore our fresh natural honey collections and add bottles to your cart.</p>
          <Link to="/shop" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} />
            <span>EXPLORE HONEY SHOP</span>
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
          grid-template-columns: 1fr 360px;
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
          padding: 14px 16px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #2C1810;
        }
        .cart-table td {
          padding: 16px;
          border-top: 1px solid #E5E0D8;
          vertical-align: middle;
        }
        .cart-item-img {
          width: 64px;
          height: 64px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #E5E0D8;
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
        .qty-picker-small {
          display: inline-flex;
          align-items: center;
          border: 1px solid #E5E0D8;
          border-radius: 4px;
          background: #FFFFFF;
        }
        .qty-picker-small button {
          background: none;
          border: none;
          padding: 4px 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .qty-picker-small span {
          padding: 0 8px;
          font-weight: 600;
          font-size: 13px;
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
                  <th>Honey Product</th>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <img src={item.image} alt={item.name} className="cart-item-img" />
                        <div>
                          <Link to={`/product/${item.slug}`} style={{ fontWeight: 600, color: '#2C1810', textDecoration: 'none' }}>
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{item.weight}</span></td>
                    <td>₹{item.price}</td>
                    <td>
                      <div className="qty-picker-small">
                        <button type="button" onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}>
                          <Minus size={12} />
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</td>
                    <td>
                      <button 
                        type="button"
                        onClick={() => removeFromCart(item.variant_id)}
                        style={{ color: '#C44B3F', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
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
                  placeholder="Coupon (e.g. HONEY10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ textTransform: 'uppercase' }}
                  disabled={Boolean(appliedCoupon)}
                />
                {appliedCoupon ? (
                  <button type="button" onClick={handleRemoveCoupon} className="btn btn-outline btn-sm">Remove</button>
                ) : (
                  <button type="submit" className="btn btn-outline btn-sm" disabled={applying}>
                    {applying ? '...' : 'Apply'}
                  </button>
                )}
              </form>

              {appliedCoupon && (
                <div style={{ background: '#E8F5E9', color: '#4A7C59', padding: '8px 12px', borderRadius: '4px', fontSize: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>Coupon "{appliedCoupon.code}" applied successfully!</span>
                </div>
              )}

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Charge</span>
                <span>{shippingCharge === 0 ? <strong style={{ color: '#4A7C59' }}>FREE</strong> : `₹${shippingCharge}`}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row" style={{ color: '#4A7C59' }}>
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="summary-row" style={{ borderTop: '1px solid #E5E0D8', paddingTop: '12px', marginTop: '12px', fontSize: '18px', fontWeight: 700 }}>
                <span>Grand Total</span>
                <span style={{ color: '#C17817' }}>₹{grandTotal}</span>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button 
                  type="button"
                  className="btn btn-primary btn-lg" 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  onClick={() => {
                    if (!customer) {
                      addToast('Please login to proceed to checkout', 'info');
                      navigate('/login?redirect=checkout');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
