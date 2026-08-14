import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getWishlist } from '../services/firebaseService';

export default function Header() {
  const { cartCount } = useCart();
  const { customer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateWishCount = async () => {
    try {
      const items = await getWishlist();
      setWishlistCount(items.length || 0);
    } catch (e) {}
  };

  useEffect(() => {
    updateWishCount();
    window.addEventListener('wishlist_updated', updateWishCount);
    return () => window.removeEventListener('wishlist_updated', updateWishCount);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="site-header">
      <style>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #FFFFFF;
          box-shadow: 0 2px 12px rgba(44, 24, 16, 0.06);
          border-bottom: 1px solid #E8DFD3;
        }

        /* Main Header Nav */
        .header-main {
          padding: 12px 0;
        }
        .header-grid {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* Logo Brand */
        .brand-logo-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .brand-logo-img {
          height: 46px;
          width: auto;
          object-fit: contain;
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          color: #2C1810;
          letter-spacing: 0.5px;
          line-height: 1.1;
        }
        .brand-subtitle {
          font-size: 10px;
          font-weight: 700;
          color: #C17817;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        /* Desktop Nav Links */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-link {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 600;
          color: #2C1810;
          text-decoration: none;
          transition: color 150ms ease;
          position: relative;
          padding: 4px 0;
        }
        .nav-link:hover, .nav-link.active {
          color: #C17817;
        }
        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: #C17817;
          border-radius: 2px;
        }

        /* Search Input */
        .search-form-wrap {
          flex: 1;
          max-width: 320px;
          position: relative;
        }
        .search-input-field {
          width: 100%;
          padding: 9px 38px 9px 16px;
          border: 1.5px solid #E8DFD3;
          border-radius: 20px;
          font-size: 13px;
          background: #FAF7F2;
          outline: none;
          transition: all 150ms ease;
        }
        .search-input-field:focus {
          border-color: #C17817;
          background: #FFFFFF;
          box-shadow: 0 0 0 3px rgba(193, 120, 23, 0.12);
        }
        .search-submit-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #8E7E70;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .search-submit-btn:hover {
          color: #C17817;
        }

        /* Action Icons (Wishlist, Cart, Account) */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .icon-btn {
          position: relative;
          background: #FAF7F2;
          border: 1px solid #E8DFD3;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2C1810;
          transition: all 150ms ease;
          text-decoration: none;
        }
        .icon-btn:hover {
          background: #FFF8ED;
          border-color: #C17817;
          color: #C17817;
          transform: translateY(-1px);
        }
        .badge-counter {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #C17817;
          color: white;
          font-size: 11px;
          font-weight: 700;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #FFFFFF;
        }

        .mobile-toggle-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #2C1810;
          padding: 6px;
        }

        /* Mobile Drawer */
        .mobile-drawer {
          display: none;
          padding: 16px 20px 24px;
          background: #FFFFFF;
          border-top: 1px solid #E8DFD3;
        }
        .mobile-drawer.open {
          display: block;
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 16px;
        }

        @media (max-width: 900px) {
          .desktop-nav, .search-form-wrap { display: none; }
          .mobile-toggle-btn { display: block; }
        }
      `}</style>

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          <div className="header-grid">
            {/* Mobile Hamburger */}
            <button 
              className="mobile-toggle-btn" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Brand Logo & Name */}
            <Link to="/" className="brand-logo-link">
              <img src="/images/logo.png" alt="Honey Bee Farm" className="brand-logo-img" />
              <div>
                <div className="brand-title">HONEY BEE FARM</div>
                <div className="brand-subtitle">NATURAL APIARY • TIRUNELVELI</div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav">
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
              <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>Honey Shop</Link>
              <Link to="/farm" className={`nav-link ${isActive('/farm') ? 'active' : ''}`}>Our Farm</Link>
              <Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}>Gallery</Link>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="search-form-wrap">
              <input
                type="text"
                className="search-input-field"
                placeholder="Search raw honey, dry fruits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-submit-btn" aria-label="Search">
                <Search size={16} />
              </button>
            </form>

            {/* Action Buttons */}
            <div className="header-actions">
              {/* Wishlist */}
              <Link to="/account/wishlist" className="icon-btn" title="Saved Wishlist">
                <Heart size={18} />
                {wishlistCount > 0 && <span className="badge-counter">{wishlistCount}</span>}
              </Link>

              {/* Shopping Cart */}
              <Link to="/cart" className="icon-btn" title="Shopping Cart">
                <ShoppingBag size={18} />
                {cartCount > 0 && <span className="badge-counter">{cartCount}</span>}
              </Link>

              {/* Customer Account */}
              <Link to={customer ? "/account" : "/login"} className="icon-btn" title={customer ? "My Account" : "Login"}>
                <User size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', marginBottom: '12px' }}>
          <input
            type="text"
            className="search-input-field"
            placeholder="Search raw honey, dry fruits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-submit-btn" aria-label="Search">
            <Search size={16} />
          </button>
        </form>

        <div className="mobile-nav-links">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-link">Home</Link>
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="nav-link">Honey Shop</Link>
          <Link to="/farm" onClick={() => setMobileMenuOpen(false)} className="nav-link">Our Farm & Apiaries</Link>
          <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} className="nav-link">Visual Gallery</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link">About Us</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="nav-link">Contact Farm</Link>
        </div>
      </div>
    </header>
  );
}
