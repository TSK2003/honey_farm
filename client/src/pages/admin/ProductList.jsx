import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ProductList() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [search]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/admin/list/all?search=${encodeURIComponent(search)}`, {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      if (res.ok) {
        addToast('Product deleted', 'success');
        fetchProducts();
      }
    } catch (err) {
      addToast('Error deleting product', 'error');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}/duplicate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      if (res.ok) {
        addToast('Product duplicated', 'success');
        fetchProducts();
      }
    } catch (err) {
      addToast('Error duplicating product', 'error');
    }
  };

  return (
    <AdminLayout title="Product Management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <input 
          type="text"
          className="form-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <Link to="/admin/products/new" className="btn btn-primary">
          + ADD NEW PRODUCT
        </Link>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <div className="table-container" style={{ background: 'white' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Variants</th>
                <th>Starting Price</th>
                <th>Total Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const primaryImg = p.images && p.images.length > 0 ? p.images[0].url : '/images/product-natural-honey.png';
                const totalStock = p.variants ? p.variants.reduce((s, v) => s + v.stock, 0) : 0;
                const minPrice = p.variants && p.variants.length > 0 ? Math.min(...p.variants.map(v => v.price)) : 0;

                return (
                  <tr key={p.id}>
                    <td>
                      <img src={primaryImg} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.category_name || 'Uncategorized'}</td>
                    <td>{p.variants?.map(v => v.weight).join(', ')}</td>
                    <td>₹{minPrice}</td>
                    <td>
                      <span className={`badge badge-${totalStock > 10 ? 'success' : totalStock > 0 ? 'warning' : 'danger'}`}>
                        {totalStock} units
                      </span>
                    </td>
                    <td><span className="badge badge-primary">{p.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/admin/products/${p.id}/edit`} className="btn btn-sm btn-outline">Edit</Link>
                        <button onClick={() => handleDuplicate(p.id)} className="btn btn-sm btn-ghost">Copy</button>
                        <button onClick={() => handleDelete(p.id)} className="btn btn-sm btn-danger">Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
