import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Eye, ArrowRight } from 'lucide-react';
import { getOrders } from '../../services/firebaseService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await getOrders('all');
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
        <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>My Honey Orders</h2>

        {orders.length === 0 ? (
          <div className="empty-state" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', background: '#FFF8ED', color: '#C17817', marginBottom: '16px' }}>
              <Package size={40} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#2C1810', marginBottom: '8px' }}>No Orders Placed Yet</h3>
            <p style={{ color: '#5C4A3A', maxWidth: '360px', margin: '0 auto 20px' }}>You haven't placed any honey orders yet.</p>
            <Link to="/shop" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingBag size={18} />
              <span>Shop Honey Now</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '6px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #E5E0D8', paddingBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#C17817' }}>#{order.order_number}</span>
                    <span style={{ color: '#8B7B6B', fontSize: '12px', marginLeft: '12px' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className={`badge badge-${order.order_status === 'delivered' ? 'success' : order.order_status === 'cancelled' ? 'danger' : 'primary'}`}>
                      {order.order_status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#5C4A3A' }}>{order.items?.length || 0} Item(s)</div>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#2C1810', marginTop: '2px' }}>Total: ₹{order.total}</div>
                  </div>
                  <Link to={`/account/orders/${order.id}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Eye size={14} />
                    <span>View & Track Order</span>
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
