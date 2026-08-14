import React, { useEffect, useState } from 'react';
import { ShoppingCart, Save } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getSettings, saveSettings } from '../../services/firebaseService';

export default function EcommerceSettings() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({ currency: '₹', store_status: 'open' });

  useEffect(() => {
    async function load() {
      const data = await getSettings();
      if (data) setSettings(prev => ({ ...prev, ...data }));
    }
    load();
  }, []);

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      addToast('Ecommerce store settings saved to Firestore!', 'success');
    } catch (err) {
      addToast('Error saving settings', 'error');
    }
  };

  return (
    <AdminLayout title="Ecommerce Settings">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', maxWidth: '500px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShoppingCart size={18} color="#C17817" />
          <span>Store Status & Currency</span>
        </h3>

        <div className="form-group">
          <label className="form-label">Currency Symbol</label>
          <input type="text" className="form-input" value={settings.currency || '₹'} readOnly />
        </div>
        <div className="form-group">
          <label className="form-label">Store Status</label>
          <select className="form-select" value={settings.store_status || 'open'} onChange={(e) => setSettings({...settings, store_status: e.target.value})}>
            <option value="open">Open for Customer Orders</option>
            <option value="closed">Temporarily Closed</option>
          </select>
        </div>
        <button onClick={handleSave} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Save size={16} />
          <span>SAVE ECOMMERCE SETTINGS</span>
        </button>
      </div>
    </AdminLayout>
  );
}
