import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .mobile-hamburger {
          display: none;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        @media (max-width: 900px) {
          .admin-main {
            margin-left: 0;
          }
          .mobile-hamburger {
            display: block;
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
            >
              ☰
            </button>
            <h1 className="admin-page-title">{title || 'Dashboard'}</h1>
          </div>

          <div className="topbar-right">
            <Link to="/" target="_blank" className="view-site-link">
              🌐 View Store ↗
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
