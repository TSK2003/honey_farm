import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { getAdminToken } = useAuth();
  const [salesReport, setSalesReport] = useState(null);
  const [productReport, setProductReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      const headers = { 'Authorization': `Bearer ${getAdminToken()}` };
      try {
        const [salesRes, prodRes, invRes, orderRes] = await Promise.all([
          fetch('/api/reports/sales', { headers }),
          fetch('/api/reports/products', { headers }),
          fetch('/api/reports/inventory', { headers }),
          fetch('/api/orders/admin/all?limit=5', { headers })
        ]);

        const salesData = await salesRes.json();
        const prodData = await prodRes.json();
        const invData = await invRes.json();
        const orderData = await orderRes.json();

        setSalesReport(salesData);
        setProductReport(prodData);
        setInventoryReport(invData);
        if (orderData.orders) setRecentOrders(orderData.orders);
      } catch (err) {
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div className="loader"><div className="spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      <style>{`
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        .stat-card {
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          padding: 16px;
        }
        .stat-val {
          font-size: 24px;
          font-weight: 700;
          color: #2C1810;
          margin-top: 4px;
        }
        .stat-lbl {
          font-size: 11px;
          color: #8B7B6B;
          text-transform: uppercase;
          font-weight: 600;
        }
        @media (max-width: 1200px) {
          .stat-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* Stats row */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-lbl">Total Revenue</div>
          <div className="stat-val" style={{ color: '#C17817' }}>₹{salesReport?.total_revenue || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Total Orders</div>
          <div className="stat-val">{salesReport?.total_orders || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Pending Orders</div>
          <div className="stat-val" style={{ color: '#E65100' }}>
            {salesReport?.status_breakdown?.find(s => s.order_status === 'pending')?.count || 0}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Active Products</div>
          <div className="stat-val">{productReport?.active_products || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Low Stock Alerts</div>
          <div className="stat-val" style={{ color: '#C44B3F' }}>{inventoryReport?.low_stock?.length || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Total Units</div>
          <div className="stat-val">{inventoryReport?.total_stock_units || 0}</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-2" style={{ gap: '24px' }}>
        {/* Recent Orders */}
        <div className="card">
          <div className="card-body" style={{ borderBottom: '1px solid #E5E0D8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Recent Customer Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '12px', color: '#C17817', fontWeight: 600 }}>View All →</Link>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td>
                      <Link to={`/admin/orders/${o.id}`} style={{ fontWeight: 600, color: '#C17817' }}>
                        {o.order_number}
                      </Link>
                    </td>
                    <td>{o.customer_name || o.shipping_name}</td>
                    <td>₹{o.total}</td>
                    <td><span className="badge badge-primary">{o.order_status}</span></td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', color: '#8B7B6B' }}>No orders placed yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="card">
          <div className="card-body" style={{ borderBottom: '1px solid #E5E0D8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Top Selling Honey Products</h3>
            <Link to="/admin/products" style={{ fontSize: '12px', color: '#C17817', fontWeight: 600 }}>Manage Products →</Link>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {productReport?.best_sellers?.map((bs, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{bs.product_name}</td>
                    <td>{bs.units_sold}</td>
                    <td>₹{bs.revenue}</td>
                  </tr>
                ))}
                {(!productReport?.best_sellers || productReport.best_sellers.length === 0) && (
                  <tr><td colSpan="3" style={{ textAlign: 'center', color: '#8B7B6B' }}>No sales data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
