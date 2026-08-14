import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Star } from 'lucide-react';
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
      addToast('Product deleted from Firestore', 'success');
      fetchProducts();
    } catch (err) {
      addToast('Error deleting product', 'error');
    }
  };

  return (
    <AdminLayout title="Honey Products Catalog">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8B7B6B' }} />
        </div>

        <Link to="/admin/products/new" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} />
          <span>ADD NEW HONEY PRODUCT</span>
        </Link>
      </div>

      <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : products.length === 0 ? (
          <p style={{ color: '#8B7B6B', fontSize: '13px', textAlign: 'center', padding: '24px' }}>No products found matching your filter.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Honey Product</th>
                <th>Category</th>
                <th>Variants & Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={p.images?.[0]?.url || '/images/product-natural-honey.png'} 
                        alt={p.name} 
                        style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #E5E0D8' }} 
                      />
                      <span style={{ fontWeight: 600, color: '#2C1810' }}>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category_name}</td>
                  <td>
                    {p.variants ? p.variants.map(v => (
                      <span key={v.id || v.weight} style={{ display: 'inline-block', background: '#FFF8ED', padding: '3px 8px', borderRadius: '4px', border: '1px solid #F0D48A', marginRight: '6px', fontSize: '11px', marginBottom: '3px' }}>
                        {v.weight}: ₹{v.price} (Stock: {v.stock})
                      </span>
                    )) : 'No variants'}
                  </td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Star size={13} fill="#D4A24E" color="#D4A24E" />
                      <span>{p.rating || 5.0} ({p.review_count || 0})</span>
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <Link 
                        to={`/admin/products/${p.id}/edit`} 
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '12px' }}
                      >
                        <Edit size={13} />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#C44B3F', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', fontSize: '12px' }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
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
