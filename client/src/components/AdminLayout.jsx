import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ExternalLink } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children, title }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { admin } = useAuth();

  return (
    <div className="admin-wrapper">
      <style>{`
        .admin-wrapper {
          display: flex;
          min-height: 100vh;
          background: #F7F2EB;
        }
        .admin-main {
          flex: 1;
          margin-left: 250px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .admin-topbar {
          height: 60px;
          background: #FFFFFF;
          border-bottom: 1px solid #E5E0D8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .admin-page-title {
          font-size: 18px;
          font-weight: 700;
          color: #2C1810;
        }
        .admin-content-area {
          padding: 24px;
          flex: 1;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .view-site-link {
          font-size: 13px;
          color: #C17817;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 4px;
          transition: background 150ms ease;
        }
        .view-site-link:hover {
          background: #FFF8ED;
        }
        .mobile-hamburger {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #2C1810;
          padding: 4px;
        }
        @media (max-width: 900px) {
          .admin-main {
            margin-left: 0;
          }
          .mobile-hamburger {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>

      {/* Sidebar */}
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="mobile-hamburger" 
              onClick={() => setMobileOpen(!mobileOpen)}
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>
            <h1 className="admin-page-title">{title || 'Dashboard'}</h1>
          </div>

          <div className="topbar-right">
            <Link to="/" target="_blank" className="view-site-link">
              <span>View Customer Store</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        <main className="admin-content-area">
          {children}
        </main>
      </div>
    </div>
  );
}
