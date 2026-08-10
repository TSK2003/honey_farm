import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getProducts, updateInventoryStock } from '../../services/firebaseService';

export default function InventoryPage() {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [stockVal, setStockVal] = useState(0);

  useEffect(() => {
    fetchInventory();
  }, [search]);

  async function fetchInventory() {
    setLoading(true);
    try {
      const data = await getProducts({ search });
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStock = async (productId, variantId) => {
    try {
      await updateInventoryStock(productId, variantId, stockVal);
      addToast('Stock level updated successfully!', 'success');
      setEditingKey(null);
      fetchInventory();
    } catch (err) {
      addToast('Error updating stock', 'error');
    }
  };

  const inventoryRows = [];
  products.forEach(p => {
    if (p.variants) {
      p.variants.forEach(v => {
        inventoryRows.push({
          productId: p.id,
          productName: p.name,
          variantId: v.id || v.weight,
          weight: v.weight,
          sku: v.sku || `KHF-${p.id.slice(0, 4)}-${v.weight}`,
          stock: v.stock || 0,
          price: v.price || 0,
          lowThreshold: v.low_stock_threshold || 5
        });
      });
    }
  });

  return (
    <AdminLayout title="Inventory & Stock Control">
      <div style={{ marginBottom: '24px' }}>
        <input 
          type="text" 
          className="form-input" 
          style={{ maxWidth: '360px' }}
          placeholder="Filter stock by product name or SKU..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : inventoryRows.length === 0 ? (
          <p style={{ color: '#8B7B6B', fontSize: '13px' }}>No inventory items found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Honey Product</th>
                <th>Net Weight Variant</th>
                <th>SKU Code</th>
                <th>Price</th>
                <th>Current Stock Units</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryRows.map((row) => {
                const rowKey = `${row.productId}_${row.variantId}`;
                const isEditing = editingKey === rowKey;
                const isLow = row.stock <= row.lowThreshold;

                return (
                  <tr key={rowKey}>
                    <td style={{ fontWeight: 600 }}>{row.productName}</td>
                    <td><span className="badge badge-primary">{row.weight}</span></td>
                    <td style={{ color: '#8B7B6B', fontSize: '12px' }}>{row.sku}</td>
                    <td>₹{row.price}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: '80px', padding: '4px 8px' }}
                          value={stockVal}
                          onChange={(e) => setStockVal(e.target.value)}
                        />
                      ) : (
                        <span style={{ fontWeight: 700, color: isLow ? '#C44B3F' : '#2C1810' }}>
                          {row.stock} units
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${isLow ? 'badge-danger' : 'badge-success'}`}>
                        {isLow ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleUpdateStock(row.productId, row.variantId)}
                            className="btn btn-primary"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingKey(null)}
                            className="btn btn-outline"
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingKey(rowKey);
                            setStockVal(row.stock);
                          }}
                          style={{ color: '#C17817', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                        >
                          Update Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
