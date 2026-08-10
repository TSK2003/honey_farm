import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getCategories, getProductById, saveProduct } from '../../services/firebaseService';

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    category_name: '',
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
    { id: 'var-1', weight: '250g', sku: 'KHF-HNY-250', price: 199, mrp: 249, stock: 50, low_stock_threshold: 5 },
    { id: 'var-2', weight: '500g', sku: 'KHF-HNY-500', price: 379, mrp: 449, stock: 40, low_stock_threshold: 5 },
    { id: 'var-3', weight: '1kg', sku: 'KHF-HNY-1000', price: 699, mrp: 849, stock: 30, low_stock_threshold: 5 }
  ]);

  const [imageUrl, setImageUrl] = useState('/images/product-natural-honey.png');

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  async function fetchCategories() {
    try {
      const data = await getCategories();
      if (Array.isArray(data)) {
        setCategories(data);
        if (!formData.category_id && data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data[0].id, category_name: data[0].name }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProduct() {
    try {
      const prod = await getProductById(id);
      if (prod) {
        setFormData({
          name: prod.name || '',
          slug: prod.slug || '',
          category_id: prod.category_id || '',
          category_name: prod.category_name || '',
          short_description: prod.short_description || '',
          description: prod.description || '',
          ingredients: prod.ingredients || '100% Pure Natural Honey',
          storage_info: prod.storage_info || '',
          shipping_info: prod.shipping_info || '',
          is_featured: prod.is_featured || false,
          is_best_seller: prod.is_best_seller || false,
          is_new_arrival: prod.is_new_arrival || false,
          status: prod.status || 'active'
        });
        if (prod.variants && prod.variants.length > 0) setVariants(prod.variants);
        if (prod.images && prod.images.length > 0) setImageUrl(prod.images[0].url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleVariantChange = (index, field, value) => {
    const next = [...variants];
    next[index][field] = value;
    setVariants(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const selectedCat = categories.find(c => c.id === formData.category_id);

    const payload = {
      ...formData,
      slug,
      category_name: selectedCat ? selectedCat.name : formData.category_name || 'Natural Honey',
      variants,
      images: [{ url: imageUrl, is_primary: true }]
    };

    try {
      await saveProduct(payload, isEdit ? id : null);
      addToast(isEdit ? 'Product updated successfully!' : 'Honey product added successfully!', 'success');
      navigate('/admin/products');
    } catch (err) {
      addToast('Error saving product: ' + err.message, 'error');
    }
  };

  if (loading) return <AdminLayout title={isEdit ? "Edit Product" : "New Honey Product"}><div className="loader"><div className="spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title={isEdit ? "Edit Honey Product" : "Add New Honey Product"}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '800px' }}>
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Basic Details</h3>

          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Slug</label>
              <input
                type="text"
                className="form-input"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Auto-generated"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Short Summary</label>
            <input
              type="text"
              className="form-input"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Description</label>
            <textarea
              className="form-input"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Image Asset URL</label>
            <input
              type="text"
              className="form-input"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>

        {/* Variants & Pricing */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Net Weight Variants, Prices & Inventory</h3>

          {variants.map((v, i) => (
            <div key={i} style={{ padding: '16px', background: '#FFF8ED', borderRadius: '6px', border: '1px solid #F0D48A', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#C17817', marginBottom: '12px' }}>Variant {i + 1}: {v.weight}</h4>
              <div className="grid grid-4" style={{ gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600 }}>Weight</label>
                  <input
                    type="text"
                    className="form-input"
                    value={v.weight}
                    onChange={(e) => handleVariantChange(i, 'weight', e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600 }}>Price (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={v.price}
                    onChange={(e) => handleVariantChange(i, 'price', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600 }}>MRP (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={v.mrp}
                    onChange={(e) => handleVariantChange(i, 'mrp', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600 }}>Stock Count</label>
                  <input
                    type="number"
                    className="form-input"
                    value={v.stock}
                    onChange={(e) => handleVariantChange(i, 'stock', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {isEdit ? "SAVE PRODUCT CHANGES" : "CREATE HONEY PRODUCT"}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-outline">
            CANCEL
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
