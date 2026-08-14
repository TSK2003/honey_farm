import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ShieldCheck, ArrowRight, Award, CheckCircle2, Lock } from 'lucide-react';
import { InstagramIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="site-footer">
      <style>{`
        .site-footer {
          background-color: #2C1810;
          color: #E8DFD3;
          padding-top: 60px;
          border-top: 1px solid #4A3A2C;
          font-size: 14px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 40px;
          margin-bottom: 48px;
        }
        .footer-logo {
          height: 48px;
          width: auto;
          margin-bottom: 16px;
          background: #FFFFFF;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .footer-brand-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 800;
          color: #FFFFFF;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .footer-tagline {
          font-size: 12px;
          color: #D4A24E;
          margin-bottom: 16px;
          font-weight: 600;
        }
        .footer-desc {
          color: #A69686;
          line-height: 1.6;
          margin-bottom: 20px;
          max-width: 320px;
        }
        .footer-heading {
          font-family: var(--font-heading);
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-links a {
          color: #A69686;
          text-decoration: none;
          transition: all 150ms ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .footer-links a:hover {
          color: #D4A24E;
          transform: translateX(3px);
        }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
          color: #A69686;
        }
        .footer-contact-item svg {
          color: #D4A24E;
          flex-shrink: 0;
          margin-top: 3px;
        }
        .footer-bottom {
          background-color: #1E100A;
          padding: 24px 0;
          border-top: 1px solid #3F2A20;
          font-size: 12px;
          color: #8B7B6B;
        }
        .footer-bottom-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .trust-pill-group {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .trust-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.06);
          padding: 4px 10px;
          border-radius: 4px;
          color: #E8DFD3;
          font-size: 11px;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 550px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <img src="/images/logo.png" alt="Honey Bee Farm Logo" className="footer-logo" />
            <div className="footer-brand-title">HONEY BEE FARM</div>
            <div className="footer-tagline">100% Pure Natural Apiary Honey</div>
            <p className="footer-desc">
              Direct from the lush floral apiaries of Tirunelveli, Tamil Nadu. We produce raw, unpasteurized, natural honey with complete commitment to bee welfare and natural purity.
            </p>
            <div className="trust-pill-group">
              <span className="trust-pill"><ShieldCheck size={14} color="#D4A24E" /> 100% Raw & Pure</span>
              <span className="trust-pill"><Award size={14} color="#D4A24E" /> Tirunelveli Origin</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-heading">Shop Honey</div>
            <ul className="footer-links">
              <li><Link to="/shop?category=raw-honey">Raw Honey</Link></li>
              <li><Link to="/shop?category=comb-honey">Natural Honey Comb</Link></li>
              <li><Link to="/shop?category=premium-reserve">Premium Reserve</Link></li>
              <li><Link to="/shop?category=gift-boxes">Honey Gift Boxes</Link></li>
              <li><Link to="/shop?category=forest-honey">Wild Forest Honey</Link></li>
            </ul>
          </div>

          {/* Farm Exploration */}
          <div>
            <div className="footer-heading">Our Farm</div>
            <ul className="footer-links">
              <li><Link to="/farm">Beekeeping Process</Link></li>
              <li><Link to="/gallery">Honey Gallery</Link></li>
              <li><Link to="/about">Our Story & Mission</Link></li>
              <li><Link to="/contact">Contact Farm</Link></li>
              <li><Link to="/admin/login">Farm Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <div className="footer-heading">Farm Contact</div>
            <div className="footer-contact-item">
              <MapPin size={18} />
              <span>Honey Bee Farm Apiaries, Tirunelveli, Tamil Nadu, India</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={18} />
              <span>+91 7708510872</span>
            </div>
            <div className="footer-contact-item">
              <InstagramIcon size={18} />
              <a 
                href="https://www.instagram.com/honey_bee_farm_tirunelveli" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: '#D4A24E', textDecoration: 'underline' }}
              >
                @honey_bee_farm_tirunelveli
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Security */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-flex">
            <div>
              © {new Date().getFullYear()} Honey Bee Farm. All Rights Reserved. Pure Natural Honey from Tirunelveli.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={12} /> Secure Checkout & Insured Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
