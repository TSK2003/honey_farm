import React, { useEffect, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { getOrders } from '../../services/firebaseService';

export default function OrderSuccessPage() {
  const location = useLocation();
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order && orderNumber) {
      async function fetchOrder() {
        try {
          const allOrders = await getOrders('all');
          const found = allOrders.find(o => o.order_number === orderNumber || o.id === orderNumber);
          if (found) {
            setOrder(found);
          } else {
            setOrder({ order_number: orderNumber, total: 0, order_status: 'pending' });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      fetchOrder();
    }
  }, [orderNumber]);

  return (
    <div className="order-success-page section">
      <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#2C1810', marginBottom: '8px' }}>Thank You for Your Order!</h1>
        <p style={{ color: '#5C4A3A', fontSize: '16px', marginBottom: '24px' }}>
          Your order of pure natural honey from Kamala Honey Farm has been placed successfully.
        </p>

        {order ? (
          <div style={{ background: '#FFF8ED', border: '1px solid #F0D48A', borderRadius: '8px', padding: '24px', marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontWeight: 600 }}>
              <span>Order Number:</span>
              <span style={{ color: '#C17817' }}>#{order.order_number}</span>
            </div>
            {order.total > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span>Amount Payable (COD):</span>
                <span>₹{order.total}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Order Status:</span>
              <span style={{ color: '#4A7C59', fontWeight: 600 }}>{order.order_status?.toUpperCase() || 'CONFIRMED'}</span>
            </div>
          </div>
        ) : (
          <div style={{ background: '#FFF8ED', border: '1px solid #F0D48A', borderRadius: '8px', padding: '24px', marginBottom: '32px', textAlign: 'center' }}>
            <span style={{ color: '#C17817', fontWeight: 600 }}>Order Confirmation Submitted to Farm</span>
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
