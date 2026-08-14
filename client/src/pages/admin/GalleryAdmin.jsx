import React, { useEffect, useState, useRef } from 'react';
import { Camera, Plus, UploadCloud, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getGalleryImages, saveGalleryItem } from '../../services/firebaseService';

export default function GalleryAdmin() {
  const { addToast } = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newImage, setNewImage] = useState({ title: '', image: '/images/hero-honey.png' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    try {
      const data = await getGalleryImages();
      if (Array.isArray(data)) setImages(data);
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
        setNewImage({ ...newImage, image: event.target.result });
        addToast(`Photo "${file.name}" loaded!`, 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!newImage.title || !newImage.image) return;
    try {
      await saveGalleryItem(newImage);
      addToast('Gallery visual added to Firestore!', 'success');
      setNewImage({ title: '', image: '/images/hero-honey.png' });
      fetchGallery();
    } catch (err) {
      addToast('Error adding gallery image', 'error');
    }
  };

  return (
    <AdminLayout title="Gallery Management">
      <div className="grid grid-2" style={{ gap: '24px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#2C1810' }}>
            <Plus size={18} color="#C17817" />
            <span>Add Honey Gallery Photo</span>
          </h3>
          <form onSubmit={handleAddImage}>
            <div className="form-group">
              <label className="form-label">Photo Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={newImage.title} 
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })} 
                placeholder="e.g. Raw Honeycomb Extraction"
                required 
              />
            </div>

            {/* Direct File Upload */}
            <div className="form-group">
              <label className="form-label">Upload Image File</label>
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
                  <span>UPLOAD PHOTO FILE</span>
                </button>
                {newImage.image && (
                  <img src={newImage.image} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E8DFD3' }} />
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
              <Camera size={16} />
              <span>SAVE TO GALLERY</span>
            </button>
          </form>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#2C1810' }}>Existing Photos</h3>
          {loading ? (
            <div className="loader"><div className="spinner"></div></div>
          ) : (
            <div className="grid grid-3" style={{ gap: '12px' }}>
              {images.map(img => (
                <div key={img.id} style={{ background: 'white', border: '1px solid #E8DFD3', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={img.image} alt={img.title} style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                  <div style={{ padding: '8px', fontSize: '12px', fontWeight: 600, color: '#2C1810' }}>{img.title}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
