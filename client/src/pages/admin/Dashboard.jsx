import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, 
  ShoppingBag, 
  Clock, 
  Package, 
  AlertTriangle, 
  Layers, 
  Star, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { getOrders, getProducts } from '../../services/firebaseService';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [ordersData, prodsData] = await Promise.all([
          getOrders('all'),
          getProducts()
        ]);
        setOrders(ordersData || []);
        setProducts(prodsData || []);
      } catch (err) {
        console.error('Dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div className="loader"><div className="spinner"></div></div></AdminLayout>;

  // Calculations
  const validOrders = orders.filter(o => o.order_status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.order_status === 'pending').length;
  const activeProducts = products.length;
  
  let lowStockAlerts = 0;
  let totalUnits = 0;
  products.forEach(p => {
    if (p.variants) {
      p.variants.forEach(v => {
        totalUnits += (Number(v.stock) || 0);
        if ((Number(v.stock) || 0) <= (Number(v.low_stock_threshold) || 5)) lowStockAlerts++;
      });
    }
  });

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout title="Store Dashboard">
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
          color: #C17817;
          margin-top: 4px;
        }
        .stat-lbl {
          font-size: 11px;
          font-weight: 700;
          color: #8B7B6B;
          text-transform: uppercase;
        }
        @media (max-width: 1024px) {
          .stat-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 640px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* Stats row */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-lbl">Total Revenue</div>
          <div className="stat-val">₹{totalRevenue}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Total Orders</div>
          <div className="stat-val">{totalOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Pending Orders</div>
          <div className="stat-val" style={{ color: pendingOrders > 0 ? '#C44B3F' : '#4A7C59' }}>{pendingOrders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Active Products</div>
          <div className="stat-val">{activeProducts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Low Stock Alerts</div>
          <div className="stat-val" style={{ color: lowStockAlerts > 0 ? '#C44B3F' : '#4A7C59' }}>{lowStockAlerts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Total Stock Units</div>
          <div className="stat-val">{totalUnits}</div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '24px' }}>
        {/* Recent Orders */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Recent Customer Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '12px', color: '#C17817', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p style={{ color: '#8B7B6B', fontSize: '13px', textAlign: 'center', padding: '24px' }}>No orders placed yet</p>
          ) : (
            <table className="table">
              <thead>
                <tr><th>Order Reference</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600, color: '#C17817' }}>#{o.order_number}</td>
                    <td>{o.shipping_name}</td>
                    <td style={{ fontWeight: 600 }}>₹{o.total}</td>
                    <td>
                      <span className={`badge badge-${o.order_status === 'delivered' ? 'success' : o.order_status === 'cancelled' ? 'danger' : 'primary'}`}>
                        {o.order_status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/orders/${o.id}`} style={{ color: '#C17817', fontWeight: 600, fontSize: '12px' }}>
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Top Selling Products */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Honey Products Catalog</h3>
            <Link to="/admin/products" style={{ fontSize: '12px', color: '#C17817', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
              <span>Manage Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <table className="table">
            <thead>
              <tr><th>Product</th><th>Category</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {products.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.category_name}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={13} fill="#D4A24E" color="#D4A24E" />
                      <span>{p.rating || '5.0'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
