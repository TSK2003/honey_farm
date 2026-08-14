import React, { useState } from 'react';
import { User, Save, Lock } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminProfile() {
  const { admin } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState(admin?.name || 'Honey Bee Admin');
  const [phone, setPhone] = useState(admin?.phone || '7708510872');

  const handleUpdate = (e) => {
    e.preventDefault();
    addToast('Admin profile updated successfully', 'success');
  };

  return (
    <AdminLayout title="Admin Profile & Security">
      <form onSubmit={handleUpdate} style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', maxWidth: '500px', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={18} color="#C17817" />
          <span>Super Admin Credentials</span>
        </h3>

        <div className="form-group">
          <label className="form-label">Admin Name</label>
          <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="form-label">Admin Email Address</label>
          <input type="email" className="form-input" value={admin?.email || 'admin@honeybeefarm.com'} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Save size={16} />
          <span>UPDATE PROFILE</span>
        </button>
      </form>
    </AdminLayout>
  );
}
