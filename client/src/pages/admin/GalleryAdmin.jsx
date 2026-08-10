import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function GalleryAdmin() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    try {
      const res = await fetch('/api/gallery/admin/all', {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setImages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout title="Gallery Management">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Honey Gallery Visuals</h3>
        <p style={{ fontSize: '13px', color: '#5C4A3A', marginBottom: '20px' }}>
          All uploaded gallery images must strictly relate to honey, honeycombs, and beekeeping.
        </p>

        <div className="grid grid-4">
          {images.map(img => (
            <div key={img.id} style={{ border: '1px solid #E5E0D8', borderRadius: '6px', overflow: 'hidden' }}>
              <img src={img.image} alt={img.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
              <div style={{ padding: '8px', fontSize: '12px', fontWeight: 600 }}>{img.title || 'Honey Image'}</div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
