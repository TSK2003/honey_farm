import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { getOrders } from '../../services/firebaseService';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  async function fetchOrders() {
    setLoading(true);
    try {
      let data = await getOrders(statusFilter);
      if (search) {
        const q = search.toLowerCase();
        data = data.filter(o => 
          (o.order_number && o.order_number.toLowerCase().includes(q)) ||
          (o.shipping_name && o.shipping_name.toLowerCase().includes(q)) ||
          (o.shipping_phone && o.shipping_phone.toLowerCase().includes(q))
        );
      }
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout title="Order Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search Order ID, Name, Phone..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B7B6B' }} />
          </div>

          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '170px' }}>
            <option value="all">All Order Stages</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <div className="table-container" style={{ background: 'white' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items Count</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Stage Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600, color: '#C17817' }}>#{o.order_number}</td>
                  <td>{o.customer_name || o.shipping_name}</td>
                  <td>{o.shipping_phone}</td>
                  <td>{o.items?.length || 1} item(s)</td>
                  <td style={{ fontWeight: 700 }}>₹{o.total}</td>
                  <td><span className="badge badge-gray">{o.payment_method || 'COD'}</span></td>
                  <td>
                    <span className={`badge badge-${o.order_status === 'delivered' ? 'success' : o.order_status === 'cancelled' ? 'danger' : 'primary'}`}>
                      {o.order_status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#8B7B6B' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/orders/${o.id}`} className="btn btn-sm btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={13} />
                      <span>Manage</span>
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '24px', color: '#8B7B6B' }}>No customer orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
