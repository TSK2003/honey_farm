import React, { useEffect, useState, useRef } from 'react';
import { Image, Plus, UploadCloud, Trash2, FolderOpen } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getBanners, saveBanner, deleteBanner } from '../../services/firebaseService';

export default function BannerList() {
  const { addToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', image: '/images/product-honey-dry-fruits.png' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const data = await getBanners();
      if (Array.isArray(data)) setBanners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Please select a valid image file', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewBanner({ ...newBanner, image: event.target.result });
        addToast(`Banner image "${file.name}" loaded!`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.title || !newBanner.image) return;
    try {
      await saveBanner(newBanner);
      addToast('Banner saved to Firestore!', 'success');
      setNewBanner({ title: '', subtitle: '', image: '/images/product-honey-dry-fruits.png' });
      fetchBanners();
    } catch (err) {
      addToast('Error adding banner', 'error');
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await deleteBanner(id);
      addToast('Banner deleted successfully', 'success');
      fetchBanners();
    } catch (err) {
      addToast('Error deleting banner', 'error');
    }
  };

  return (
    <AdminLayout title="Homepage Banners">
      <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#2C1810' }}>
            <Plus size={18} color="#C17817" />
            <span>Add Promotional Banner</span>
          </h3>
          <form onSubmit={handleAddBanner}>
            <div className="form-group">
              <label className="form-label">Banner Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={newBanner.title} 
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })} 
                placeholder="e.g. 100% Pure Raw Honey & Dry Fruits Honey"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Banner Subtitle</label>
              <input 
                type="text" 
                className="form-input" 
                value={newBanner.subtitle} 
                onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })} 
                placeholder="e.g. Harvested directly from our Tirunelveli apiaries"
              />
            </div>

            {/* Direct File Upload */}
            <div className="form-group">
              <label className="form-label">Banner Image File</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleFileUpload} 
              />
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <UploadCloud size={14} />
                  <span>UPLOAD BANNER IMAGE</span>
                </button>
                {newBanner.image && (
                  <img src={newBanner.image} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E8DFD3' }} />
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
              <Plus size={16} />
              <span>SAVE BANNER</span>
            </button>
          </form>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#2C1810' }}>Active Banners</h3>
          {loading ? (
            <div className="loader"><div className="spinner"></div></div>
          ) : banners.length === 0 ? (
            <p style={{ color: '#8B7B6B' }}>No banners configured yet.</p>
          ) : (
            banners.map((b, i) => (
              <div key={b.id || i} style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #E8DFD3', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <img src={b.image} alt={b.title} style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E8DFD3' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#2C1810' }}>{b.title}</div>
                    <div style={{ fontSize: '12px', color: '#8B7B6B' }}>{b.subtitle}</div>
                  </div>
                </div>
                {b.id && (
                  <button 
                    onClick={() => handleDeleteBanner(b.id)} 
                    className="btn btn-ghost btn-sm"
                    style={{ color: '#C44B3F', padding: '6px', flexShrink: 0 }}
                    title="Delete banner"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

