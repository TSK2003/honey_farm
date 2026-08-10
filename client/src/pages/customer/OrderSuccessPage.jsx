import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="order-success-page section">
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#2C1810', marginBottom: '8px' }}>Thank You for Your Order!</h1>
        <p style={{ color: '#5C4A3A', fontSize: '16px', marginBottom: '24px' }}>
          Your order of pure natural honey from Kamala Honey Farm has been placed successfully.
        </p>

        {order && (
          <div style={{ background: '#FFF8ED', border: '1px solid #F0D48A', borderRadius: '8px', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 600 }}>
              <span>Order Number:</span>
              <span style={{ color: '#C17817' }}>{order.order_number}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Amount Payable (COD):</span>
              <span>₹{order.total}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Order Status:</span>
              <span style={{ color: '#4A7C59', fontWeight: 600 }}>Pending Confirmation</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/account/orders" className="btn btn-primary">VIEW MY ORDERS</Link>
          <Link to="/shop" className="btn btn-outline">CONTINUE SHOPPING</Link>
        </div>
      </div>
    </div>
  );
}
