import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminProfile() {
  const { admin } = useAuth();
  const { addToast } = useToast();
  const [name, setName] = useState(admin?.name || 'Kamala Admin');
  const [phone, setPhone] = useState(admin?.phone || '7708510872');

  return (
    <AdminLayout title="Admin Profile & Security">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', maxWidth: '500px' }}>
        <div className="form-group">
          <label className="form-label">Admin Name</label>
          <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" value={admin?.email || 'admin@kamalahoney.com'} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button onClick={() => addToast('Profile updated', 'success')} className="btn btn-primary">UPDATE PROFILE</button>
      </div>
    </AdminLayout>
  );
}
