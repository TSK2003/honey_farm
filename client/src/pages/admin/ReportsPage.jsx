import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

export default function ReportsPage() {
  const { getAdminToken } = useAuth();
  const [salesReport, setSalesReport] = useState(null);
  const [productReport, setProductReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      const headers = { 'Authorization': `Bearer ${getAdminToken()}` };
      try {
        const [s, p, i] = await Promise.all([
          fetch('/api/reports/sales', { headers }).then(r => r.json()),
          fetch('/api/reports/products', { headers }).then(r => r.json()),
          fetch('/api/reports/inventory', { headers }).then(r => r.json())
        ]);
        setSalesReport(s);
        setProductReport(p);
        setInventoryReport(i);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) return <AdminLayout title="Business Reports"><div className="loader"><div className="spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Business & Performance Analytics">
      {/* Overview Cards */}
      <div className="grid grid-3" style={{ gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <div style={{ fontSize: '12px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 600 }}>Total Sales Revenue</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#C17817', marginTop: '8px' }}>₹{salesReport?.total_revenue || 0}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Across {salesReport?.total_orders || 0} orders</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <div style={{ fontSize: '12px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 600 }}>Average Order Value</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#2C1810', marginTop: '8px' }}>₹{salesReport?.avg_order_value || 0}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Per customer transaction</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <div style={{ fontSize: '12px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 600 }}>Inventory Health</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#4A7C59', marginTop: '8px' }}>{inventoryReport?.total_stock_units || 0}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Total honey units in stock</div>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-body" style={{ borderBottom: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Best-Selling Honey Products</h3>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr><th>Rank</th><th>Product Name</th><th>Units Sold</th><th>Total Revenue Generated</th></tr>
            </thead>
            <tbody>
              {productReport?.best_sellers?.map((bs, i) => (
                <tr key={i}>
                  <td><strong>#{i + 1}</strong></td>
                  <td style={{ fontWeight: 600 }}>{bs.product_name}</td>
                  <td>{bs.units_sold} units</td>
                  <td style={{ fontWeight: 600, color: '#C17817' }}>₹{bs.revenue}</td>
                </tr>
              ))}
              {(!productReport?.best_sellers || productReport.best_sellers.length === 0) && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No sales data available yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="card">
        <div className="card-body" style={{ borderBottom: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#C44B3F' }}>Low Stock & Replenishment Alerts</h3>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr><th>Product</th><th>Variant</th><th>Current Stock</th><th>Threshold</th><th>Status</th></tr>
            </thead>
            <tbody>
              {inventoryReport?.low_stock?.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                  <td>{item.weight}</td>
                  <td style={{ fontWeight: 700, color: '#C44B3F' }}>{item.stock} units</td>
                  <td>{item.low_stock_threshold} units</td>
                  <td><span className="badge badge-danger">REORDER NEEDED</span></td>
                </tr>
              ))}
              {(!inventoryReport?.low_stock || inventoryReport.low_stock.length === 0) && (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: '#4A7C59', padding: '20px' }}>✓ All stock levels healthy</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
