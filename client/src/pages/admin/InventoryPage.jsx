import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function InventoryPage() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [stockVal, setStockVal] = useState(0);

  useEffect(() => {
    fetchInventory();
  }, [search]);

  async function fetchInventory() {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory?search=${encodeURIComponent(search)}`, {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStock = async (variantId) => {
    try {
      const res = await fetch(`/api/inventory/${variantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify({ stock: parseInt(stockVal) })
      });
      if (res.ok) {
        addToast('Stock updated', 'success');
        setEditingId(null);
        fetchInventory();
      }
    } catch (err) {
      addToast('Error updating stock', 'error');
    }
  };

  return (
    <AdminLayout title="Inventory & Stock Control">
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Filter by product name or SKU..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <div className="table-container" style={{ background: 'white' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>SKU</th>
                <th>Stock Level</th>
                <th>Low Stock Threshold</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.product_name}</td>
                  <td>{item.weight}</td>
                  <td>{item.sku || 'N/A'}</td>
                  <td>
                    {editingId === item.id ? (
                      <input 
                        type="number" 
                        className="form-input" 
                        value={stockVal} 
                        onChange={(e) => setStockVal(e.target.value)} 
                        style={{ width: '80px', padding: '4px 8px' }}
                      />
                    ) : (
                      <strong style={{ fontSize: '15px' }}>{item.stock} units</strong>
                    )}
                  </td>
                  <td>{item.low_stock_threshold} units</td>
                  <td>
                    <span className={`badge badge-${item.stock <= 0 ? 'danger' : item.stock <= item.low_stock_threshold ? 'warning' : 'success'}`}>
                      {item.stock <= 0 ? 'OUT OF STOCK' : item.stock <= item.low_stock_threshold ? 'LOW STOCK' : 'IN STOCK'}
                    </span>
                  </td>
                  <td>
                    {editingId === item.id ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleUpdateStock(item.id)} className="btn btn-sm btn-primary">Save</button>
                        <button onClick={() => setEditingId(null)} className="btn btn-sm btn-ghost">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditingId(item.id); setStockVal(item.stock); }} className="btn btn-sm btn-outline">
                        Adjust Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
