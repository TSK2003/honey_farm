import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  Settings, 
  Package, 
  Truck, 
  MapPin, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  AlertCircle,
  XCircle,
  User,
  ShoppingBag
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getOrderById, updateOrderStage } from '../../services/firebaseService';

export default function OrderDetail() {
  const { id } = useParams();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const STAGES = [
    { key: 'pending', label: '1. Pending', Icon: Clock, desc: 'Order Placed by Customer' },
    { key: 'confirmed', label: '2. Confirmed', Icon: CheckCircle2, desc: 'Verified by Admin' },
    { key: 'processing', label: '3. Processing', Icon: Settings, desc: 'Preparing Honey Batch' },
    { key: 'packed', label: '4. Packed', Icon: Package, desc: 'Jars Sealed & Boxed' },
    { key: 'shipped', label: '5. Shipped', Icon: Truck, desc: 'Dispatched via Courier' },
    { key: 'out_for_delivery', label: '6. Out for Delivery', Icon: MapPin, desc: 'Reached Customer City' },
    { key: 'delivered', label: '7. Delivered', Icon: Sparkles, desc: 'Handed to Customer' }
  ];

  useEffect(() => {
    fetchOrder();
  }, [id]);

  async function fetchOrder() {
    try {
      const data = await getOrderById(id);
      if (data) {
        setOrder(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const updateStageTo = async (newStageKey) => {
    try {
      await updateOrderStage(id, newStageKey);
      const stageObj = STAGES.find(s => s.key === newStageKey);
      const name = stageObj ? stageObj.label : newStageKey.toUpperCase();
      addToast(`Order stage updated to: ${name}`, 'success');
      fetchOrder();
    } catch (err) {
      addToast(err.message || 'Error updating order stage', 'error');
    }
  };

  if (loading) return <AdminLayout title="Order Detail"><div className="loader"><div className="spinner"></div></div></AdminLayout>;
  if (!order) return <AdminLayout title="Order Detail">Order not found</AdminLayout>;

  const currentIdx = STAGES.findIndex(s => s.key === order.order_status);
  const nextStage = currentIdx >= 0 && currentIdx < STAGES.length - 1 ? STAGES[currentIdx + 1] : null;

  return (
    <AdminLayout title={`Manage Order #${order.order_number}`}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <Link to="/admin/orders" style={{ color: '#C17817', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <ArrowLeft size={16} />
          <span>Back to Orders List</span>
        </Link>
        <span className={`badge badge-${order.order_status === 'delivered' ? 'success' : order.order_status === 'cancelled' ? 'danger' : 'primary'}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
          Current Stage: {order.order_status === 'cancelled' ? 'CANCELLED' : STAGES[currentIdx]?.label || order.order_status?.toUpperCase()}
        </span>
      </div>

      {/* INTERACTIVE VISUAL ORDER PROGRESS ROADMAP */}
      <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '8px', border: '1px solid #E5E0D8', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #E5E0D8', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2C1810', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#C17817" />
            <span>Order Product Movement Roadmap (Click Any Stage to Set)</span>
          </h3>

          {['pending', 'confirmed'].includes(order.order_status) && (
            <button 
              onClick={() => {
                if (window.confirm('Cancel this order and mark as cancelled?')) {
                  updateStageTo('cancelled');
                }
              }}
              style={{ color: '#C44B3F', fontSize: '12px', fontWeight: 600, background: '#FFEBEE', padding: '6px 12px', borderRadius: '4px', border: '1px solid #C44B3F', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <XCircle size={14} />
              <span>Cancel Order</span>
            </button>
          )}

          {['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.order_status) && (
            <span style={{ color: '#5C4A3A', fontSize: '12px', background: '#F7F2EB', padding: '6px 12px', borderRadius: '4px', border: '1px solid #E5E0D8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={14} />
              <span>Cancellation Locked (Order In Dispatch / Delivered)</span>
            </span>
          )}
        </div>

        {order.order_status === 'cancelled' ? (
          <div style={{ background: '#FFEBEE', color: '#C44B3F', padding: '16px', borderRadius: '6px', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>Order Cancelled</span>
          </div>
        ) : (
          <div>
            {/* Interactive Stepper Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {STAGES.map((stg, i) => {
                const isCurrent = currentIdx === i;
                const isCompleted = currentIdx > i;
                const StageIcon = stg.Icon;

                return (
                  <div
                    key={stg.key}
                    onClick={() => updateStageTo(stg.key)}
                    style={{
                      background: isCurrent ? '#FFF8ED' : isCompleted ? '#E8F5E9' : '#FBF8F3',
                      border: isCurrent ? '2px solid #C17817' : isCompleted ? '1px solid #4A7C59' : '1px solid #E5E0D8',
                      borderRadius: '6px',
                      padding: '12px 8px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      position: 'relative'
                    }}
                    title={`Click to set stage to: ${stg.label}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px', color: isCurrent ? '#C17817' : isCompleted ? '#4A7C59' : '#8B7B6B' }}>
                      <StageIcon size={22} />
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: isCurrent || isCompleted ? 700 : 500, color: isCurrent ? '#C17817' : isCompleted ? '#4A7C59' : '#5C4A3A', marginBottom: '2px' }}>
                      {stg.label}
                    </div>
                    <div style={{ fontSize: '10px', color: '#8B7B6B', lineHeight: '1.2' }}>{stg.desc}</div>

                    {isCurrent && (
                      <div style={{ marginTop: '8px', background: '#C17817', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 4px', borderRadius: '3px', textTransform: 'uppercase' }}>
                        ACTIVE
                      </div>
                    )}
                    {isCompleted && (
                      <div style={{ marginTop: '8px', background: '#4A7C59', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 4px', borderRadius: '3px' }}>
                        DONE
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quick 1-Click Progression Action Button */}
            {nextStage && (
              <div style={{ background: '#FFF8ED', border: '1px solid #F0D48A', padding: '14px 20px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#5C4A3A' }}>Ready for next stage?</span>
                  <strong style={{ fontSize: '14px', color: '#2C1810' }}>Move to {nextStage.label}</strong>
                </div>
                <button 
                  onClick={() => updateStageTo(nextStage.key)}
                  className="btn btn-primary"
                  style={{ padding: '8px 20px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>ADVANCE TO {nextStage.label.toUpperCase()}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-2" style={{ gap: '24px' }}>
        {/* Left: Items & Totals */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShoppingBag size={18} />
            <span>Order Items</span>
          </h3>
          
          <table className="table" style={{ marginBottom: '24px' }}>
            <thead>
              <tr><th>Item</th><th>Weight</th><th>Qty</th><th>Total</th></tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                  <td>{item.variant_weight}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ borderTop: '1px solid #E5E0D8', paddingTop: '16px' }}>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Subtotal:</span><span>₹{order.subtotal}</span>
            </div>
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Shipping Charge:</span><span>₹{order.shipping_charge}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#4A7C59' }}>
                <span>Discount:</span><span>-₹{order.discount}</span>
              </div>
            )}
            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, marginTop: '12px', borderTop: '1px solid #E5E0D8', paddingTop: '12px' }}>
              <span>Grand Total:</span><span style={{ color: '#C17817' }}>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Right: Customer & Shipping Details */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={18} />
            <span>Customer & Shipping Info</span>
          </h3>
          <p style={{ marginBottom: '6px' }}><strong>Name:</strong> {order.shipping_name}</p>
          <p style={{ marginBottom: '6px' }}><strong>Phone:</strong> {order.shipping_phone}</p>
          <p style={{ marginBottom: '16px' }}><strong>Email:</strong> {order.shipping_email || order.customer_email || 'N/A'}</p>
          <hr style={{ margin: '16px 0', borderColor: '#E5E0D8' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Delivery Address:</h4>
          <p style={{ fontSize: '13px', color: '#5C4A3A', lineHeight: '1.5' }}>
            {order.shipping_address}, {order.shipping_city}, {order.shipping_district}, {order.shipping_state} - {order.shipping_pincode}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
