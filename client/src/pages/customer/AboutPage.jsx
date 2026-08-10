import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="about-page">
      <style>{`
        .about-hero {
          background: linear-gradient(rgba(44, 24, 16, 0.7), rgba(44, 24, 16, 0.7)), url('/images/farm-beekeeping.png');
          background-size: cover;
          background-position: center;
          color: white;
          padding: 80px 0;
          text-align: center;
        }
      `}</style>
      <div className="about-hero">
        <div className="container">
          <span className="section-label" style={{ color: '#D4A24E' }}>ABOUT US</span>
          <h1 style={{ fontSize: '42px', fontWeight: 700, marginBottom: '16px' }}>Kamala Honey Farm</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '16px', color: '#E5E0D8' }}>
            Nurturing bee colonies and producing authentic, raw natural honey in Tirunelveli, Tamil Nadu.
          </p>
        </div>
      </div>

      <div className="container section">
        <div className="grid grid-2" style={{ alignItems: 'center' }}>
          <div>
            <span className="section-label">OUR MISSION</span>
            <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Pure Honey, Direct From Nature</h2>
            <p style={{ color: '#5C4A3A', lineHeight: '1.7', marginBottom: '16px' }}>
              At Kamala Honey Farm, our journey began with a simple vision: to bring pure, unprocessed, farm-fresh honey directly from the apiaries of Tirunelveli to households across India.
            </p>
            <p style={{ color: '#5C4A3A', lineHeight: '1.7' }}>
              We refrain from ultra-filtration, heating, or adding synthetic sugars. Every bottle of Kamala Honey contains the natural pollen, floral aroma, and beneficial enzymes crafted by nature's hardworking bees.
            </p>
          </div>
          <div>
            <img src="/images/hero-honey.png" alt="Pure Kamala Honey" style={{ borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
