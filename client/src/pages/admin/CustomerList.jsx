import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { getCustomers, getOrders } from '../../services/firebaseService';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomersData() {
      try {
        const [custData, ordersData] = await Promise.all([
          getCustomers(),
          getOrders('all')
        ]);

        const customerList = (custData || []).map(c => {
          const userOrders = (ordersData || []).filter(o => o.shipping_phone === c.phone || o.shipping_name?.toLowerCase() === c.name?.toLowerCase());
          const totalSpent = userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

          return {
            ...c,
            order_count: userOrders.length,
            total_spent: totalSpent
          };
        });

        setCustomers(customerList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomersData();
  }, []);

  return (
    <AdminLayout title="Customer Management">
      <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : customers.length === 0 ? (
          <p style={{ color: '#8B7B6B', fontSize: '13px', textAlign: 'center', padding: '24px' }}>No customer accounts registered yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Total Orders</th><th>Total Spent</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || 'N/A'}</td>
                  <td>{c.order_count}</td>
                  <td style={{ fontWeight: 600, color: '#C17817' }}>₹{c.total_spent}</td>
                  <td style={{ fontSize: '12px', color: '#8B7B6B' }}>{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
