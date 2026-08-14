import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  UploadCloud, 
  Image as ImageIcon, 
  CheckCircle2, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getCategories, getProductById, saveProduct } from '../../services/firebaseService';

const PRESET_FARM_IMAGES = [
  { label: 'Dry Fruits Honey', url: '/images/product-honey-dry-fruits.png' },
  { label: 'Wild Kattu Nellikai', url: '/images/product-honey-kattu-nellikai.png' },
  { label: 'Honey Dates', url: '/images/product-honey-dates.png' },
  { label: 'Hill Garlic & Ginger', url: '/images/product-honey-ginger-garlic.png' },
  { label: 'Natural Raw Honey', url: '/images/product-natural-honey.png' },
  { label: 'Honey Comb', url: '/images/product-honeycomb.png' },
  { label: 'Reserve Honey', url: '/images/product-premium-honey.png' },
  { label: 'Gift Pack', url: '/images/product-gift-pack.png' },
  { label: 'Forest Honey', url: '/images/product-forest-honey.png' }
];

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

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
    { id: 'var-1', weight: '250g', sku: 'HBF-HNY-250', price: 199, mrp: 249, stock: 50, low_stock_threshold: 5 },
    { id: 'var-2', weight: '500g', sku: 'HBF-HNY-500', price: 379, mrp: 449, stock: 40, low_stock_threshold: 5 },
    { id: 'var-3', weight: '1kg', sku: 'HBF-HNY-1000', price: 699, mrp: 849, stock: 30, low_stock_threshold: 5 }
  ]);

  const [imageUrl, setImageUrl] = useState('/images/product-honey-dry-fruits.png');

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

  const handleAddVariant = () => {
    const nextId = `var-${Date.now()}`;
    setVariants([...variants, { id: nextId, weight: '100g', sku: `HBF-NEW-${variants.length + 1}`, price: 99, mrp: 149, stock: 20, low_stock_threshold: 5 }]);
  };

  const handleRemoveVariant = (index) => {
    if (variants.length <= 1) {
      addToast('Product must have at least one weight variant', 'warning');
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  // ==========================================
  // FILE UPLOAD HANDLER (DIRECT IMAGE UPLOAD)
  // ==========================================
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      addToast('Image size exceeds 8MB. Please choose a smaller image.', 'error');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target.result;
      setImageUrl(base64Data);
      addToast(`Image "${file.name}" loaded successfully!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      addToast('Product name is required', 'error');
      return;
    }
    if (!imageUrl) {
      addToast('Please upload a product image', 'warning');
      return;
    }

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
      <form onSubmit={handleSubmit} style={{ maxWidth: '820px' }}>
        
        {/* Basic Product Details */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', marginBottom: '24px', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#2C1810' }}>1. Basic Product Details</h3>

          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Honey Soaked Dry Fruits & Nuts"
              required
            />
          </div>

          <div className="grid grid-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category_id}
                onChange={(e) => {
                  const cat = categories.find(c => c.id === e.target.value);
                  setFormData({ ...formData, category_id: e.target.value, category_name: cat ? cat.name : '' });
                }}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">URL Slug (Auto-generated if empty)</label>
              <input
                type="text"
                className="form-input"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. honey-soaked-dry-fruits"
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
              placeholder="e.g. Almonds, cashews, walnuts & figs soaked in 100% pure raw honey."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Description</label>
            <textarea
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the honey harvest, aroma, tasting notes, and benefits..."
            ></textarea>
          </div>
        </div>

        {/* 2. DIRECT IMAGE UPLOAD SECTION */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', marginBottom: '24px', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: '#2C1810', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={20} color="#C17817" />
            <span>2. Product Image File Upload</span>
          </h3>
          <p style={{ fontSize: '13px', color: '#5C4A3A', marginBottom: '18px' }}>
            Upload a high-resolution product image directly from your device.
          </p>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/jpg, image/webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div className="grid grid-2" style={{ gap: '20px', alignItems: 'center' }}>
            {/* Drag and Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed #C17817' : '2px dashed #D4A24E',
                background: isDragging ? '#FFF8ED' : '#FAF7F2',
                borderRadius: '12px',
                padding: '32px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
            >
              <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '50%', background: '#FFFFFF', color: '#C17817', marginBottom: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                <UploadCloud size={28} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#2C1810', marginBottom: '4px' }}>
                Click to Browse or Drag Image Here
              </div>
              <div style={{ fontSize: '12px', color: '#8B7B6B' }}>
                Supports PNG, JPG, JPEG, WEBP (Max 8MB)
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <FolderOpen size={14} />
                <span>CHOOSE IMAGE FILE</span>
              </button>
            </div>

            {/* Live Image Preview */}
            <div style={{ border: '1px solid #E8DFD3', borderRadius: '12px', padding: '16px', background: '#FFFFFF', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#C17817', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Live Product Preview
              </div>
              {imageUrl ? (
                <div>
                  <img
                    src={imageUrl}
                    alt="Product Preview"
                    style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '10px', margin: '0 auto 12px', border: '2px solid #F0D48A', display: 'block', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  {fileName && (
                    <div style={{ fontSize: '12px', color: '#2C1810', fontWeight: 600, marginBottom: '8px' }}>
                      File: {fileName}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '11.5px', padding: '4px 10px' }}
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div style={{ padding: '30px 10px', color: '#8B7B6B' }}>
                  <ImageIcon size={36} style={{ opacity: 0.4, margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '12px' }}>No image uploaded yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Farm Presets Selection */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #E8DFD3', paddingTop: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#5C4A3A', marginBottom: '10px' }}>
              Or choose from Honey Bee Farm Presets:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRESET_FARM_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setImageUrl(preset.url);
                    setFileName(preset.label);
                    addToast(`Selected ${preset.label} image`, 'info');
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: imageUrl === preset.url ? '1.5px solid #C17817' : '1px solid #E8DFD3',
                    background: imageUrl === preset.url ? '#FFF8ED' : '#FFFFFF',
                    color: imageUrl === preset.url ? '#C17817' : '#5C4A3A',
                    fontSize: '12px',
                    fontWeight: imageUrl === preset.url ? 700 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {imageUrl === preset.url && <CheckCircle2 size={12} />}
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Variants & Pricing */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', marginBottom: '24px', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2C1810' }}>3. Weight Variants, Prices & Inventory</h3>
            <button 
              type="button" 
              onClick={handleAddVariant} 
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Plus size={14} />
              <span>Add Variant</span>
            </button>
          </div>

          {variants.map((v, i) => (
            <div key={i} style={{ padding: '16px', background: '#FFF8ED', borderRadius: '8px', border: '1px solid #F0D48A', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#C17817' }}>Variant {i + 1}: {v.weight}</h4>
                {variants.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => handleRemoveVariant(i)}
                    style={{ color: '#C44B3F', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                  >
                    <Trash2 size={14} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
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
                  <label style={{ fontSize: '11px', fontWeight: 600 }}>Stock Units</label>
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

        {/* 4. Product Flags */}
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', marginBottom: '24px', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#2C1810' }}>4. Display Badges</h3>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              />
              <span>Featured on Homepage</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.is_best_seller}
                onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
              />
              <span>Best Seller Badge</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.is_new_arrival}
                onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
              />
              <span>New Arrival Badge</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px' }}>
            <Save size={16} />
            <span>{isEdit ? "SAVE PRODUCT CHANGES" : "CREATE HONEY PRODUCT"}</span>
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-outline">
            CANCEL
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
