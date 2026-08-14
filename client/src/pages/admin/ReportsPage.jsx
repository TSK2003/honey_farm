import React, { useEffect, useState } from 'react';
import { BarChart3, IndianRupee, Package, AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { getAnalyticsReports } from '../../services/firebaseService';

export default function ReportsPage() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const data = await getAnalyticsReports();
        setReports(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) return <AdminLayout title="Business Reports"><div className="loader"><div className="spinner"></div></div></AdminLayout>;

  const salesReport = reports?.sales;
  const productReport = reports?.products;
  const inventoryReport = reports?.inventory;

  return (
    <AdminLayout title="Analytics & Business Reports">
      {/* Overview Cards */}
      <div className="grid grid-3" style={{ gap: '20px', marginBottom: '32px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total Sales Revenue</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#C17817', marginTop: '8px' }}>₹{salesReport?.total_revenue || 0}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Across {salesReport?.total_orders || 0} customer orders</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Average Order Value</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#2C1810', marginTop: '8px' }}>₹{salesReport?.avg_order_value || 0}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Per transaction average</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
          <div style={{ fontSize: '11px', color: '#8B7B6B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Inventory Health</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#4A7C59', marginTop: '8px' }}>{inventoryReport?.total_stock_units || 0}</div>
          <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '4px' }}>Total natural honey units in stock</div>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="card" style={{ marginBottom: '32px', background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '6px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={18} color="#C17817" />
            <span>Top Performing Honey Products</span>
          </h3>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr><th>Rank</th><th>Product Name</th><th>Estimated Units Sold</th><th>Total Revenue</th></tr>
            </thead>
            <tbody>
              {productReport?.best_sellers?.map((bs, i) => (
                <tr key={i}>
                  <td><strong style={{ color: '#C17817' }}>#{i + 1}</strong></td>
                  <td style={{ fontWeight: 600 }}>{bs.product_name}</td>
                  <td>{bs.units_sold} units</td>
                  <td style={{ fontWeight: 700, color: '#C17817' }}>₹{bs.revenue}</td>
                </tr>
              ))}
              {(!productReport?.best_sellers || productReport.best_sellers.length === 0) && (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#8B7B6B' }}>No sales data available yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E5E0D8', borderRadius: '6px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E0D8' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#C44B3F', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={18} />
            <span>Low Stock & Replenishment Alerts</span>
          </h3>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr><th>Honey Product</th><th>Net Weight</th><th>Current Stock</th><th>Threshold</th><th>Stock Status</th></tr>
            </thead>
            <tbody>
              {inventoryReport?.low_stock?.map((item, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                  <td><span className="badge badge-primary">{item.weight}</span></td>
                  <td style={{ fontWeight: 700, color: '#C44B3F' }}>{item.stock} units</td>
                  <td>{item.low_stock_threshold} units</td>
                  <td><span className="badge badge-danger">REORDER NEEDED</span></td>
                </tr>
              ))}
              {(!inventoryReport?.low_stock || inventoryReport.low_stock.length === 0) && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#4A7C59', padding: '20px', fontWeight: 600 }}>
                    ✓ All honey inventory stock levels are healthy
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
