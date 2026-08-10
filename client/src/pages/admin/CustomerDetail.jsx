import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

export default function CustomerDetail() {
  const { id } = useParams();
  const { getAdminToken } = useAuth();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await fetch(`/api/customers/${id}`, {
          headers: { 'Authorization': `Bearer ${getAdminToken()}` }
        });
        const data = await res.json();
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
  if (!customer) return <AdminLayout title="Customer Detail">Customer not found</AdminLayout>;

  return (
    <AdminLayout title={`Customer: ${customer.name}`}>
      <div style={{ marginBottom: '16px' }}>
        <Link to="/admin/customers" style={{ color: '#C17817', fontSize: '13px', fontWeight: 600 }}>← Back to Customers</Link>
      </div>

      <div className="grid grid-2" style={{ gap: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Customer Info</h3>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
          <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
          <p><strong>Total Orders:</strong> {customer.order_count}</p>
          <p><strong>Total Spending:</strong> ₹{customer.total_spent}</p>
        </div>

        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Order History</h3>
          {customer.orders?.map(o => (
            <div key={o.id} style={{ borderBottom: '1px solid #E5E0D8', padding: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
              <span>Order #{o.order_number} ({o.order_status})</span>
              <strong style={{ color: '#C17817' }}>₹{o.total}</strong>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
