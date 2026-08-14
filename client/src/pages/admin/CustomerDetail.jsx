import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, ShoppingBag } from 'lucide-react';
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id]);

  if (loading) return <AdminLayout title="Customer Detail"><div className="loader"><div className="spinner"></div></div></AdminLayout>;
  if (!customer) return (
    <AdminLayout title="Customer Detail">
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Customer account not found</p>
        <Link to="/admin/customers" className="btn btn-primary" style={{ marginTop: '12px' }}>Back to Customers</Link>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title={`Customer: ${customer.name}`}>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/admin/customers" style={{ color: '#C17817', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
          <ArrowLeft size={16} />
          <span>Back to Customers</span>
        </Link>
      </div>

      <div className="grid grid-2" style={{ gap: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <User size={18} color="#C17817" />
            <span>Customer Profile</span>
          </h3>
          <p style={{ marginBottom: '8px' }}><strong>Full Name:</strong> {customer.name}</p>
          <p style={{ marginBottom: '8px' }}><strong>Email Address:</strong> {customer.email}</p>
          <p style={{ marginBottom: '8px' }}><strong>Mobile Phone:</strong> {customer.phone || 'N/A'}</p>
          <p style={{ marginBottom: '8px' }}><strong>Total Orders Placed:</strong> {customer.order_count}</p>
          <p style={{ marginBottom: '8px' }}><strong>Lifetime Spending:</strong> <strong style={{ color: '#C17817' }}>₹{customer.total_spent}</strong></p>
        </div>

        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShoppingBag size={18} color="#C17817" />
            <span>Order History</span>
          </h3>
          {customer.orders && customer.orders.length > 0 ? (
            customer.orders.map(o => (
              <div key={o.id} style={{ borderBottom: '1px solid #E5E0D8', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#2C1810' }}>Order #{o.order_number}</div>
                  <div style={{ fontSize: '11px', color: '#8B7B6B' }}>Stage: {o.order_status?.toUpperCase()}</div>
                </div>
                <strong style={{ color: '#C17817' }}>₹{o.total}</strong>
              </div>
            ))
          ) : (
            <p style={{ color: '#8B7B6B', fontSize: '13px' }}>No orders placed under this customer phone/name.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
