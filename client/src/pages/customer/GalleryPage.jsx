import React from 'react';

export default function GalleryPage() {
  const images = [
    { src: '/images/hero-honey.png', title: 'Pure Honey Jar' },
    { src: '/images/product-honeycomb.png', title: 'Raw Honeycomb' },
    { src: '/images/farm-beekeeping.png', title: 'Beekeeper at Work' },
    { src: '/images/honey-harvesting.png', title: 'Honey Extraction' },
    { src: '/images/honey-processing.png', title: 'Gravity Filtering' },
    { src: '/images/honey-packaging.png', title: 'Packaging Jars' },
    { src: '/images/showcase-honeycomb.png', title: 'Golden Honey Cells' },
    { src: '/images/showcase-bees.png', title: 'Honey Bees' }
  ];

  return (
    <div className="gallery-page section">
      <div className="container">
        <div className="section-header">
          <span className="section-label">VISUAL SHOWCASE</span>
          <h2>Our Honey & Beekeeping Gallery</h2>
          <p>Strictly honey, honeycomb, and farm imagery from Kamala Honey Farm.</p>
        </div>

        <div className="grid grid-4">
          {images.map((img, i) => (
            <div key={i} style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #E5E0D8', background: 'white' }}>
              <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                <img src={img.src} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '12px', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
                {img.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
