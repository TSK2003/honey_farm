import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutAdmin, admin } = useAuth();

  const isActive = (path) => location.pathname === path;
  const isParentActive = (prefix) => location.pathname.startsWith(prefix);

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
      <style>{`
        .admin-sidebar {
          width: 250px;
          background: #2C1810;
          color: #FBF8F3;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          overflow-y: auto;
          z-index: 2000;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #4A3A2C;
          transition: transform 200ms ease;
        }
        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #4A3A2C;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sidebar-header img {
          height: 38px;
          width: auto;
          object-fit: contain;
          background: #FFFFFF;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .sidebar-title {
          font-size: 14px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.2;
        }
        .sidebar-subtitle {
          font-size: 11px;
          color: #D4A24E;
          letter-spacing: 0.5px;
        }
        .sidebar-nav {
          padding: 16px 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .nav-section-label {
          font-size: 10px;
          font-weight: 700;
          color: #8B7B6B;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 10px;
          margin-bottom: 4px;
        }
        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          font-size: 13px;
          font-weight: 500;
          color: #A69686;
          border-radius: 5px;
          transition: all 150ms ease;
        }
        .sidebar-link:hover {
          background: rgba(212, 162, 78, 0.1);
          color: #FBF8F3;
        }
        .sidebar-link.active {
          background: #C17817;
          color: #FFFFFF;
          font-weight: 600;
        }
        .sidebar-footer {
          padding: 16px 12px;
          border-top: 1px solid #4A3A2C;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .user-info {
          font-size: 12px;
        }
        .user-name { font-weight: 600; color: white; }
        .user-role { color: #8B7B6B; font-size: 11px; }
        @media (max-width: 900px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Header */}
      <div className="sidebar-header">
        <img src="/images/logo.png" alt="Kamala Admin" />
        <div>
          <div className="sidebar-title">KAMALA</div>
          <div className="sidebar-subtitle">ADMIN PANEL</div>
        </div>
      </div>

      {/* Nav Menu */}
      <div className="sidebar-nav">
        {/* Main */}
        <div>
          <div className="sidebar-menu">
            <Link to="/admin" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}>
              📊 Dashboard
            </Link>
          </div>
        </div>

        {/* Catalog */}
        <div>
          <div className="nav-section-label">Catalog</div>
          <div className="sidebar-menu">
            <Link to="/admin/products" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isParentActive('/admin/products') ? 'active' : ''}`}>
              📦 Products
            </Link>
            <Link to="/admin/categories" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/categories') ? 'active' : ''}`}>
              🏷️ Categories
            </Link>
            <Link to="/admin/inventory" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/inventory') ? 'active' : ''}`}>
              🏭 Inventory
            </Link>
          </div>
        </div>

        {/* Sales */}
        <div>
          <div className="nav-section-label">Sales</div>
          <div className="sidebar-menu">
            <Link to="/admin/orders" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isParentActive('/admin/orders') ? 'active' : ''}`}>
              🛍️ Orders
            </Link>
            <Link to="/admin/customers" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isParentActive('/admin/customers') ? 'active' : ''}`}>
              👥 Customers
            </Link>
            <Link to="/admin/coupons" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/coupons') ? 'active' : ''}`}>
              🎟️ Coupons
            </Link>
            <Link to="/admin/reviews" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/reviews') ? 'active' : ''}`}>
              ⭐ Reviews
            </Link>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="nav-section-label">Content</div>
          <div className="sidebar-menu">
            <Link to="/admin/banners" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/banners') ? 'active' : ''}`}>
              🖼️ Banners
            </Link>
            <Link to="/admin/gallery" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/gallery') ? 'active' : ''}`}>
              📸 Gallery
            </Link>
            <Link to="/admin/content/farm" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/content/farm') ? 'active' : ''}`}>
              🐝 Farm Story
            </Link>
            <Link to="/admin/content" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/content') ? 'active' : ''}`}>
              📝 Website Content
            </Link>
          </div>
        </div>

        {/* Communication */}
        <div>
          <div className="nav-section-label">Communication</div>
          <div className="sidebar-menu">
            <Link to="/admin/messages" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/messages') ? 'active' : ''}`}>
              ✉️ Messages
            </Link>
          </div>
        </div>

        {/* Reports */}
        <div>
          <div className="nav-section-label">Reports</div>
          <div className="sidebar-menu">
            <Link to="/admin/reports" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/reports') ? 'active' : ''}`}>
              📈 Business Reports
            </Link>
          </div>
        </div>

        {/* Settings */}
        <div>
          <div className="nav-section-label">Settings</div>
          <div className="sidebar-menu">
            <Link to="/admin/settings/business" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/settings/business') ? 'active' : ''}`}>
              ⚙️ Business Info
            </Link>
            <Link to="/admin/settings/ecommerce" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/settings/ecommerce') ? 'active' : ''}`}>
              🛒 Ecommerce
            </Link>
            <Link to="/admin/settings/shipping" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/settings/shipping') ? 'active' : ''}`}>
              🚚 Shipping
            </Link>
            <Link to="/admin/settings/payment" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/settings/payment') ? 'active' : ''}`}>
              💳 Payment
            </Link>
            <Link to="/admin/profile" onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive('/admin/profile') ? 'active' : ''}`}>
              👤 Admin Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-name">{admin?.name || 'Admin'}</div>
          <div className="user-role">Super Admin</div>
        </div>
        <button onClick={handleLogout} className="btn btn-sm btn-ghost" style={{ color: '#E44E4E' }} title="Logout">
          🚪
        </button>
      </div>
    </aside>
  );
}
