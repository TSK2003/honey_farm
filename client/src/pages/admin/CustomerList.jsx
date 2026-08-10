import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

export default function CustomerList() {
  const { getAdminToken } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch('/api/customers', {
          headers: { 'Authorization': `Bearer ${getAdminToken()}` }
        });
        const data = await res.json();
        if (data.customers) setCustomers(data.customers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  return (
    <AdminLayout title="Customer Management">
      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <div className="table-container" style={{ background: 'white' }}>
          <table className="table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Joined</th><th>Action</th></tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || 'N/A'}</td>
                  <td>{c.order_count}</td>
                  <td style={{ fontWeight: 600 }}>₹{c.total_spent}</td>
                  <td style={{ fontSize: '12px', color: '#8B7B6B' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td><Link to={`/admin/customers/${c.id}`} className="btn btn-sm btn-outline">View Profile</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
