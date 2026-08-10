import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function BannerList() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const res = await fetch('/api/banners/admin/all', {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setBanners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout title="Homepage Banners">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Active Banners</h3>
        <p style={{ color: '#5C4A3A', fontSize: '13px', marginBottom: '20px' }}>
          Manage hero banners and visual promotions displayed on the homepage.
        </p>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Subtitle</th><th>Image</th><th>Status</th></tr>
            </thead>
            <tbody>
              {banners.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.title || 'Hero Banner'}</td>
                  <td>{b.subtitle}</td>
                  <td><img src={b.image} alt="" style={{ width: '60px', height: '40px', objectFit: 'cover' }} /></td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
              ))}
              {banners.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center' }}>No active banners</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
