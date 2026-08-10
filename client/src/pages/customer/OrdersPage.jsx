import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders/my-orders', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('khf_customer_token')}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;

  return (
    <div className="orders-page section">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>My Orders</h2>

        {orders.length === 0 ? (
          <div className="empty-state">
            <h3>No Orders Placed Yet</h3>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: '16px' }}>Shop Honey</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '6px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #E5E0D8', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '15px' }}>{order.order_number}</span>
                    <span style={{ color: '#8B7B6B', fontSize: '12px', marginLeft: '12px' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className={`badge badge-${order.order_status === 'delivered' ? 'success' : 'warning'}`}>
                      {order.order_status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#5C4A3A' }}>{order.items?.length || 0} Item(s)</div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#2C1810' }}>Total: ₹{order.total}</div>
                  </div>
                  <Link to={`/account/orders/${order.id}`} className="btn btn-outline btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
