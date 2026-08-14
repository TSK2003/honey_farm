import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, ShoppingBag, Phone, Mail, Calendar, IndianRupee, MapPin, Eye, ExternalLink } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { getCustomerById } from '../../services/firebaseService';

export default function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const data = await getCustomerById(id);
        setCustomer(data);
      } catch (err) {
        console.error('Error fetching customer details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id]);

  if (loading) return <AdminLayout title="Customer Detail"><div className="loader"><div className="spinner"></div></div></AdminLayout>;
  
  if (!customer) return (
    <AdminLayout title="Customer Detail">
      <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E8DFD3' }}>
        <User size={40} color="#C17817" style={{ marginBottom: '12px', opacity: 0.5 }} />
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2C1810', marginBottom: '8px' }}>Customer Profile Not Found</h3>
        <p style={{ color: '#5C4A3A', fontSize: '13px', marginBottom: '20px' }}>Could not locate customer with identifier "{id}"</p>
        <Link to="/admin/customers" className="btn btn-primary">Back to Customers</Link>
      </div>
    </AdminLayout>
  );

  const avgOrderValue = customer.order_count > 0 ? Math.round(customer.total_spent / customer.order_count) : 0;

  return (
    <AdminLayout title={`Customer: ${customer.name}`}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/customers" style={{ color: '#C17817', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <ArrowLeft size={16} />
          <span>Back to All Customers</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-3" style={{ gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Total Orders</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#2C1810', marginTop: '6px' }}>{customer.order_count || 0}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Lifetime purchases placed</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Lifetime Spend</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#C17817', marginTop: '6px' }}>₹{customer.total_spent || 0}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Total revenue from customer</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '10px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Average Order Value</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#4A7C59', marginTop: '6px' }}>₹{avgOrderValue}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Average spent per order</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '24px' }}>
        {/* Customer Profile Box */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '10px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#2C1810', borderBottom: '1px solid #E8DFD3', paddingBottom: '10px' }}>
            <User size={18} color="#C17817" />
            <span>Profile Information</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Customer Full Name</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#2C1810', marginTop: '2px' }}>{customer.name}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</div>
              <div style={{ fontSize: '14px', color: '#5C4A3A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#8B7B6B" />
                <span>{customer.email || 'N/A'}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Mobile Phone Number</div>
              <div style={{ fontSize: '14px', color: '#5C4A3A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#8B7B6B" />
                <span>{customer.phone || 'N/A'}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Customer Since</div>
              <div style={{ fontSize: '13px', color: '#5C4A3A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#8B7B6B" />
                <span>{customer.created_at ? new Date(customer.created_at).toLocaleString() : 'N/A'}</span>
              </div>
            </div>

            {customer.orders && customer.orders.length > 0 && customer.orders[0].shipping_address && (
              <div>
                <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700 }}>Default Shipping Address</div>
                <div style={{ fontSize: '13px', color: '#5C4A3A', marginTop: '4px', lineHeight: '1.4', background: '#FFF8ED', padding: '10px', borderRadius: '6px', border: '1px solid #F0D48A' }}>
                  <MapPin size={14} color="#C17817" style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-top' }} />
                  {customer.orders[0].shipping_address}, {customer.orders[0].shipping_city}, {customer.orders[0].shipping_state} - {customer.orders[0].shipping_pincode}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order History Box */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '10px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: '#2C1810', borderBottom: '1px solid #E8DFD3', paddingBottom: '10px' }}>
            <ShoppingBag size={18} color="#C17817" />
            <span>Order History ({customer.orders?.length || 0})</span>
          </h3>

          {customer.orders && customer.orders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {customer.orders.map(o => (
                <div key={o.id} style={{ border: '1px solid #E8DFD3', borderRadius: '8px', padding: '14px', background: '#FAFAFA' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: '#C17817', fontSize: '14px' }}>#{o.order_number}</span>
                      <span style={{ fontSize: '11px', color: '#8B7B6B', marginLeft: '8px' }}>
                        {o.created_at ? new Date(o.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <span className={`badge badge-${o.order_status === 'delivered' ? 'success' : o.order_status === 'cancelled' ? 'danger' : 'primary'}`}>
                      {o.order_status?.toUpperCase()}
                    </span>
                  </div>

                  {o.items && o.items.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#5C4A3A', marginBottom: '8px', background: '#FFFFFF', padding: '6px 10px', borderRadius: '4px', border: '1px solid #E8DFD3' }}>
                      {o.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>• {it.product_name} ({it.variant_weight}) × {it.quantity}</span>
                          <span style={{ fontWeight: 600 }}>₹{it.total}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', borderTop: '1px solid #E8DFD3', paddingTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#8B7B6B' }}>Payment: {o.payment_method || 'COD'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 700, color: '#2C1810', fontSize: '14px' }}>₹{o.total}</span>
                      <Link to={`/admin/orders/${o.id}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', fontSize: '11px' }}>
                        <span>Manage</span>
                        <ExternalLink size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: '#8B7B6B' }}>
              <p style={{ fontSize: '13px' }}>No orders placed under this customer account yet.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

