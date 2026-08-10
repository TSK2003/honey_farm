import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getProducts, deleteProduct } from '../../services/firebaseService';

export default function ProductList() {
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
      const data = await getProducts({ search });
      if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      addToast('Product deleted', 'success');
      fetchProducts();
    } catch (err) {
      addToast('Error deleting product', 'error');
    }
  };

  return (
    <AdminLayout title="Products Catalog">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: '300px' }}
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link to="/admin/products/new" className="btn btn-primary">
          + ADD NEW HONEY PRODUCT
        </Link>
      </div>

      <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <p style={{ color: '#8B7B6B', fontSize: '13px' }}>No products found matching your filter.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Variants & Price</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.category_name}</td>
                  <td>
                    {p.variants ? p.variants.map(v => (
                      <span key={v.id || v.weight} style={{ display: 'inline-block', background: '#FFF8ED', padding: '2px 8px', borderRadius: '4px', border: '1px solid #F0D48A', marginRight: '6px', fontSize: '11px' }}>
                        {v.weight}: ₹{v.price} (Stock: {v.stock})
                      </span>
                    )) : 'No variants'}
                  </td>
                  <td>⭐ {p.rating || 5.0} ({p.review_count || 0})</td>
                  <td>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Link to={`/admin/products/${p.id}/edit`} style={{ color: '#C17817', fontWeight: 600, fontSize: '12px' }}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{ color: '#C44B3F', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
