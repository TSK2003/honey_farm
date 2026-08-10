import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  
  const { cartCount } = useCart();
  const { customer, logoutCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchInput(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E0D8;
          height: 64px;
        }
        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .header-logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .header-logo img {
          height: 44px;
          width: auto;
          object-fit: contain;
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: #2C1810;
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
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #C17817;
          border-radius: 2px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .icon-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 5px;
          color: #2C1810;
          transition: background 150ms ease;
        }
        .icon-btn:hover {
          background: #FBF8F3;
          color: #C17817;
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background: #C17817;
          color: white;
          font-size: 10px;
          font-weight: 700;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .search-form {
          display: flex;
          align-items: center;
          position: relative;
        }
        .search-input {
          width: 200px;
          padding: 6px 12px;
          font-size: 13px;
          border: 1px solid #E5E0D8;
          border-radius: 5px;
          outline: none;
          transition: all 150ms ease;
        }
        .search-input:focus {
          border-color: #C17817;
        }
        .mobile-toggle {
          display: none;
        }
        @media (max-width: 850px) {
          .header-nav { display: none; }
          .mobile-toggle { display: flex; }
          .desktop-search { display: none; }
        }
        .mobile-menu {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E0D8;
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 999;
        }
      `}</style>

      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <img src="/images/logo.png" alt="Kamala Honey Farm" />
          </Link>

          {/* Desktop Nav */}
          <nav className="header-nav">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/shop" className={`nav-link ${isActive('/shop') ? 'active' : ''}`}>Shop</Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
            <Link to="/farm" className={`nav-link ${isActive('/farm') ? 'active' : ''}`}>Our Farm</Link>
            <Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}>Gallery</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          </nav>

          {/* Header Right Actions */}
          <div className="header-actions">
            {/* Search */}
            <div className="desktop-search">
              {showSearchInput ? (
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search honey products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    onBlur={() => !searchQuery && setShowSearchInput(false)}
                  />
                </form>
              ) : (
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowSearchInput(true)}
                  title="Search"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/account/wishlist" className="icon-btn" title="Wishlist">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
              </svg>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="icon-btn" title="Cart">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 01-8 0"></path>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Account / Admin */}
            {customer ? (
              <Link to="/account" className="icon-btn" title="My Account">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-sm btn-outline">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="icon-btn mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search honey products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="nav-link">Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="nav-link">Shop</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="nav-link">About</Link>
            <Link to="/farm" onClick={() => setMobileMenuOpen(false)} className="nav-link">Our Farm</Link>
            <Link to="/gallery" onClick={() => setMobileMenuOpen(false)} className="nav-link">Gallery</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="nav-link">Contact</Link>
            {customer ? (
              <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="nav-link">My Account</Link>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="nav-link">Customer Login</Link>
            )}
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="nav-link" style={{ color: '#8B7B6B', fontSize: '13px' }}>
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
