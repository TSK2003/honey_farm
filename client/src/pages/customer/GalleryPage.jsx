import React, { useEffect, useState } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { getGalleryImages } from '../../services/firebaseService';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const data = await getGalleryImages();
        setImages(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <div className="gallery-page section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">PHOTO GALLERY</span>
          <h2>Honey Bee Farm Visual Gallery</h2>
          <p>Authentic honey, honeycomb, and farm imagery from Honey Bee Farm in Tirunelveli.</p>
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : (
          <div className="grid grid-4" style={{ gap: '20px' }}>
            {images.map(img => (
              <div key={img.id} className="card" style={{ overflow: 'hidden' }}>
                <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                  <img 
                    src={img.image} 
                    alt={img.title || 'Honey Bee Farm Photo'} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 250ms ease' }} 
                  />
                </div>
                <div style={{ padding: '12px 16px', fontWeight: 600, fontSize: '13px', color: '#2C1810' }}>
                  {img.title || 'Honey Harvest'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
