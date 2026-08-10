import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <style>{`
        .footer {
          background: #2C1810;
          color: #FBF8F3;
          padding: 60px 0 24px;
          font-size: 14px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-brand img {
          height: 50px;
          margin-bottom: 16px;
          filter: brightness(0) invert(1);
        }
        .footer-brand p {
          color: #A69686;
          line-height: 1.6;
          margin-bottom: 16px;
          max-width: 320px;
        }
        .footer-title {
          font-size: 15px;
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links a {
          color: #A69686;
          transition: color 150ms ease;
        }
        .footer-links a:hover {
          color: #D4A24E;
        }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #A69686;
          margin-bottom: 12px;
        }
        .footer-contact-item svg {
          color: #D4A24E;
          flex-shrink: 0;
          margin-top: 3px;
        }
        .footer-bottom {
          border-top: 1px solid #4A3A2C;
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #8B7B6B;
          font-size: 13px;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 30px;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <img src="/images/logo.png" alt="Kamala Honey Farm" />
            <p>
              Kamala Honey Farm produces pure, unprocessed, naturally harvested honey directly from our bee farms in Tirunelveli, Tamil Nadu.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Quick Links</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop Honey</Link>
              <Link to="/about">About Us</Link>
              <Link to="/farm">Our Farm</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          {/* Customer Care / Policies */}
          <div>
            <h4 className="footer-title">Customer Care</h4>
            <div className="footer-links">
              <Link to="/account/orders">Track Orders</Link>
              <Link to="/account/wishlist">Wishlist</Link>
              <Link to="/login">Account Login</Link>
              <a href="#shipping">Shipping Policy</a>
              <a href="#returns">Returns & Refunds</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="footer-title">Get in Touch</h4>
            <div className="footer-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>Kamala Honey Farm, Tirunelveli, Tamil Nadu, India</span>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
              </svg>
              <span>+91 7708510872</span>
            </div>
            <div className="footer-contact-item">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <a 
                href="https://www.instagram.com/kamala_honey_farm_tirunelveli" 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: '#D4A24E' }}
              >
                @kamala_honey_farm_tirunelveli
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Kamala Honey Farm. All rights reserved. Natural Honey Farm, Tirunelveli.</div>
          <div>
            <Link to="/admin/login" style={{ color: '#8B7B6B' }}>Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
