import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function EcommerceSettings() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [settings, setSettings] = useState({ currency: '₹', store_status: 'open' });

  return (
    <AdminLayout title="Ecommerce Settings">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', maxWidth: '500px' }}>
        <div className="form-group">
          <label className="form-label">Currency Symbol</label>
          <input type="text" className="form-input" value={settings.currency} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label">Store Status</label>
          <select className="form-select" value={settings.store_status} onChange={(e) => setSettings({...settings, store_status: e.target.value})}>
            <option value="open">Open for Orders</option>
            <option value="closed">Temporarily Closed</option>
          </select>
        </div>
        <button onClick={() => addToast('Ecommerce settings saved', 'success')} className="btn btn-primary">SAVE</button>
      </div>
    </AdminLayout>
  );
}
