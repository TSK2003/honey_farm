import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    short_description: '',
    description: '',
    ingredients: '100% Pure Natural Honey',
    storage_info: 'Store in a cool, dry place away from direct sunlight.',
    shipping_info: 'Shipped in secure packaging across India.',
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: false,
    status: 'active'
  });

  const [variants, setVariants] = useState([
    { weight: '250g', sku: '', price: 199, mrp: 249, stock: 50, low_stock_threshold: 5 },
    { weight: '500g', sku: '', price: 379, mrp: 449, stock: 40, low_stock_threshold: 5 },
    { weight: '1kg', sku: '', price: 699, mrp: 849, stock: 30, low_stock_threshold: 5 }
  ]);

  const [imageUrl, setImageUrl] = useState('/images/product-natural-honey.png');

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
        if (!formData.category_id && data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProduct() {
    try {
      const res = await fetch(`/api/products/admin/${id}`, {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      setFormData({
        name: data.name,
        slug: data.slug,
        category_id: data.category_id || '',
        short_description: data.short_description || '',
        description: data.description || '',
        ingredients: data.ingredients || '',
        storage_info: data.storage_info || '',
        shipping_info: data.shipping_info || '',
        is_featured: Boolean(data.is_featured),
        is_best_seller: Boolean(data.is_best_seller),
        is_new_arrival: Boolean(data.is_new_arrival),
        status: data.status || 'active'
      });
      if (data.variants && data.variants.length > 0) setVariants(data.variants);
      if (data.images && data.images.length > 0) setImageUrl(data.images[0].url);
    } catch (err) {
      addToast('Error loading product', 'error');
    } finally {
      setLoading(false);
    }
  }

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData({ ...formData, name, slug: isEdit ? formData.slug : slug });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        variants,
        images: [{ url: imageUrl, is_primary: 1 }]
      };

      const url = isEdit ? `/api/products/${id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      addToast(isEdit ? 'Product updated successfully' : 'Product created successfully', 'success');
      navigate('/admin/products');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) return <AdminLayout title="Product Form"><div className="loader"><div className="spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title={isEdit ? 'Edit Honey Product' : 'Add New Honey Product'}>
      <form onSubmit={handleSave} style={{ maxWidth: '900px' }}>
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Basic Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input type="text" className="form-input" value={formData.name} onChange={handleNameChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Slug *</label>
              <input type="text" className="form-input" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input type="text" className="form-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Description</label>
            <input type="text" className="form-input" value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Full Description</label>
            <textarea className="form-textarea" rows="4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
          </div>
        </div>

        {/* Variants Section */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Weight Variants & Stock</h3>

          {variants.map((v, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
              <div>
                <label className="form-label">Weight</label>
                <input type="text" className="form-input" value={v.weight} onChange={(e) => handleVariantChange(i, 'weight', e.target.value)} />
              </div>
              <div>
                <label className="form-label">SKU</label>
                <input type="text" className="form-input" value={v.sku || ''} onChange={(e) => handleVariantChange(i, 'sku', e.target.value)} placeholder="Auto-generated" />
              </div>
              <div>
                <label className="form-label">Selling Price (₹)</label>
                <input type="number" className="form-input" value={v.price} onChange={(e) => handleVariantChange(i, 'price', parseFloat(e.target.value))} />
              </div>
              <div>
                <label className="form-label">MRP (₹)</label>
                <input type="number" className="form-input" value={v.mrp} onChange={(e) => handleVariantChange(i, 'mrp', parseFloat(e.target.value))} />
              </div>
              <div>
                <label className="form-label">Stock Units</label>
                <input type="number" className="form-input" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', parseInt(e.target.value))} />
              </div>
            </div>
          ))}
        </div>

        {/* Options */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({...formData, is_featured: e.target.checked})} />
              Featured Product
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.is_best_seller} onChange={(e) => setFormData({...formData, is_best_seller: e.target.checked})} />
              Best Seller
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.is_new_arrival} onChange={(e) => setFormData({...formData, is_new_arrival: e.target.checked})} />
              New Arrival
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button type="submit" className="btn btn-primary btn-lg">
            {isEdit ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-ghost btn-lg">
            CANCEL
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
