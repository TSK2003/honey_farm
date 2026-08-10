import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function BusinessSettings() {
  const { getAdminToken } = useAuth();
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    business_name: 'Kamala Honey Farm',
    business_tagline: 'Natural Honey Farm',
    business_phone: '7708510872',
    business_whatsapp: '7708510872',
    business_email: 'contact@kamalahoneyfarm.com',
    business_address: 'Tirunelveli, Tamil Nadu, India',
    business_instagram: 'https://www.instagram.com/kamala_honey_farm_tirunelveli'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings?group=business', {
        headers: { 'Authorization': `Bearer ${getAdminToken()}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const map = { ...settings };
        data.forEach(s => { map[s.setting_key] = s.setting_value; });
        setSettings(map);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = Object.keys(settings).map(key => ({
      key,
      value: settings[key],
      group: 'business'
    }));

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: JSON.stringify({ settings: payload })
      });
      if (res.ok) addToast('Business settings saved', 'success');
    } catch (err) {
      addToast('Error saving settings', 'error');
    }
  };

  return (
    <AdminLayout title="Business Settings">
      <form onSubmit={handleSave} style={{ maxWidth: '600px', background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
        <div className="form-group">
          <label className="form-label">Business Name</label>
          <input type="text" className="form-input" value={settings.business_name} onChange={(e) => setSettings({...settings, business_name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Tagline</label>
          <input type="text" className="form-input" value={settings.business_tagline} onChange={(e) => setSettings({...settings, business_tagline: e.target.value})} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input type="text" className="form-input" value={settings.business_phone} onChange={(e) => setSettings({...settings, business_phone: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Instagram Link</label>
          <input type="text" className="form-input" value={settings.business_instagram} onChange={(e) => setSettings({...settings, business_instagram: e.target.value})} required />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea className="form-textarea" rows="3" value={settings.business_address} onChange={(e) => setSettings({...settings, business_address: e.target.value})}></textarea>
        </div>
        <button type="submit" className="btn btn-primary">SAVE BUSINESS INFO</button>
      </form>
    </AdminLayout>
  );
}
