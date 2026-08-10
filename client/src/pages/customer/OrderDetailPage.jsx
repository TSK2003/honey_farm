import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/my-orders/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('khf_customer_token')}` }
        });
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!order) return <div className="container section">Order not found</div>;

  return (
    <div className="order-detail-page section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link to="/account/orders" style={{ color: '#C17817', fontSize: '13px', fontWeight: 600 }}>← Back to All Orders</Link>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '6px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #E5E0D8', paddingBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700 }}>Order #{order.order_number}</h2>
              <div style={{ color: '#8B7B6B', fontSize: '12px' }}>Placed on {new Date(order.created_at).toLocaleString()}</div>
            </div>
            <div>
              <span className="badge badge-primary" style={{ fontSize: '13px', padding: '4px 12px' }}>
                Status: {order.order_status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Visual 7-Stage Order Tracking Progress Bar */}
          {(() => {
            const stages = [
              { key: 'pending', label: '1. Pending' },
              { key: 'confirmed', label: '2. Confirmed' },
              { key: 'processing', label: '3. Processing' },
              { key: 'packed', label: '4. Packed' },
              { key: 'shipped', label: '5. Shipped' },
              { key: 'out_for_delivery', label: '6. Out for Delivery' },
              { key: 'delivered', label: '7. Delivered' }
            ];

            const currentIdx = stages.findIndex(s => s.key === order.order_status);

            return (
              <div style={{ marginBottom: '24px', background: '#FFF8ED', border: '1px solid #F0D48A', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#C17817', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  📍 Order Tracking Stages Roadmap
                </h4>
                
                {order.order_status === 'cancelled' ? (
                  <div style={{ color: '#C44B3F', fontWeight: 600, textAlign: 'center', padding: '12px' }}>
                    ✕ Order Cancelled (Stock Restored)
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                    {stages.map((stg, i) => {
                      const isPassed = currentIdx >= i;
                      const isCurrent = currentIdx === i;
                      return (
                        <div key={stg.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: isCurrent ? '#C17817' : isPassed ? '#4A7C59' : '#E5E0D8',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '4px',
                            boxShadow: isCurrent ? '0 0 0 3px rgba(193, 120, 23, 0.2)' : 'none'
                          }}>
                            {isPassed ? '✓' : i + 1}
                          </div>
                          <div style={{
                            fontSize: '10px',
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? '#C17817' : isPassed ? '#2C1810' : '#8B7B6B',
                            lineHeight: '1.2'
                          }}>
                            {stg.label.replace(/^\d+\.\s*/, '')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Shipping Address */}
          <div style={{ marginBottom: '24px', background: '#FBF8F3', padding: '16px', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Shipping Address</h4>
            <div>{order.shipping_name} ({order.shipping_phone})</div>
            <div style={{ color: '#5C4A3A', fontSize: '13px' }}>
              {order.shipping_address}, {order.shipping_city}, {order.shipping_district}, {order.shipping_state} - {order.shipping_pincode}
            </div>
          </div>

          {/* Order Items */}
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Items Ordered</h4>
          <div style={{ marginBottom: '24px' }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E0D8' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                  <div style={{ fontSize: '12px', color: '#8B7B6B' }}>Weight: {item.variant_weight} | Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 600 }}>₹{item.total}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: '1px solid #E5E0D8', paddingTop: '16px' }}>
            <div className="summary-row"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
            <div className="summary-row"><span>Shipping</span><span>₹{order.shipping_charge}</span></div>
            {order.discount > 0 && <div className="summary-row" style={{ color: '#4A7C59' }}><span>Discount</span><span>-₹{order.discount}</span></div>}
            <div className="summary-row" style={{ fontSize: '18px', fontWeight: 700, marginTop: '8px' }}>
              <span>Total Paid ({order.payment_method})</span>
              <span style={{ color: '#C17817' }}>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
