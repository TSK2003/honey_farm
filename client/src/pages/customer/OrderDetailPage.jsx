import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Settings, 
  Package, 
  Truck, 
  MapPin, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { getOrderById } from '../../services/firebaseService';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const data = await getOrderById(id);
        if (data) setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!order) return (
    <div className="container section">
      <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Order not found</h3>
        <Link to="/account/orders" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Orders</Link>
      </div>
    </div>
  );

  return (
    <div className="order-detail-page section">
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Link to="/account/orders" style={{ color: '#C17817', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            <span>Back to All Orders</span>
          </Link>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '8px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #E5E0D8', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#2C1810' }}>Order #{order.order_number}</h2>
              <div style={{ color: '#8B7B6B', fontSize: '12px', marginTop: '2px' }}>Placed on {new Date(order.created_at).toLocaleString()}</div>
            </div>
            <div>
              <span className={`badge badge-${order.order_status === 'delivered' ? 'success' : order.order_status === 'cancelled' ? 'danger' : 'primary'}`} style={{ fontSize: '13px', padding: '6px 14px' }}>
                Status: {order.order_status?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Visual 7-Stage Order Tracking Progress Bar */}
          {(() => {
            const stages = [
              { key: 'pending', label: 'Pending', Icon: Clock },
              { key: 'confirmed', label: 'Confirmed', Icon: CheckCircle2 },
              { key: 'processing', label: 'Processing', Icon: Settings },
              { key: 'packed', label: 'Packed', Icon: Package },
              { key: 'shipped', label: 'Shipped', Icon: Truck },
              { key: 'out_for_delivery', label: 'Out for Delivery', Icon: MapPin },
              { key: 'delivered', label: 'Delivered', Icon: Sparkles }
            ];

            const currentIdx = stages.findIndex(s => s.key === order.order_status);

            return (
              <div style={{ marginBottom: '28px', background: '#FFF8ED', border: '1px solid #F0D48A', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#C17817', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} />
                  <span>Order Tracking Stages Roadmap</span>
                </h4>
                
                {order.order_status === 'cancelled' ? (
                  <div style={{ color: '#C44B3F', fontWeight: 600, textAlign: 'center', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <AlertCircle size={18} />
                    <span>Order Cancelled</span>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                    {stages.map((stg, i) => {
                      const isPassed = currentIdx >= i;
                      const isCurrent = currentIdx === i;
                      const StageIcon = stg.Icon;
                      return (
                        <div key={stg.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: isCurrent ? '#C17817' : isPassed ? '#4A7C59' : '#E5E0D8',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '6px',
                            boxShadow: isCurrent ? '0 0 0 3px rgba(193, 120, 23, 0.2)' : 'none',
                            transition: 'all 150ms ease'
                          }}>
                            <StageIcon size={16} />
                          </div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: isCurrent ? 700 : 500,
                            color: isCurrent ? '#C17817' : isPassed ? '#2C1810' : '#8B7B6B',
                            lineHeight: '1.2'
                          }}>
                            {stg.label}
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
          <div style={{ marginBottom: '24px', background: '#FBF8F3', padding: '16px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#2C1810' }}>Delivery Address</h4>
            <div style={{ fontWeight: 600 }}>{order.shipping_name} ({order.shipping_phone})</div>
            <div style={{ color: '#5C4A3A', fontSize: '13px', marginTop: '4px' }}>
              {order.shipping_address}, {order.shipping_city}, {order.shipping_district}, {order.shipping_state} - {order.shipping_pincode}
            </div>
          </div>

          {/* Order Items */}
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Items in this Order</h4>
          <div style={{ marginBottom: '24px' }}>
            {order.items?.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E5E0D8' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#2C1810' }}>{item.product_name}</div>
                  <div style={{ fontSize: '12px', color: '#8B7B6B' }}>Weight: {item.variant_weight} | Quantity: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 600 }}>₹{item.total}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: '1px solid #E5E0D8', paddingTop: '16px' }}>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span>Shipping Charge</span><span>₹{order.shipping_charge}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#4A7C59' }}>
                <span>Discount Applied</span><span>-₹{order.discount}</span>
              </div>
            )}
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, marginTop: '12px', borderTop: '1px solid #E5E0D8', paddingTop: '12px' }}>
              <span>Grand Total ({order.payment_method})</span>
              <span style={{ color: '#C17817' }}>₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
