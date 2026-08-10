import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getSettings, saveSettings } from '../../services/firebaseService';

export default function BusinessSettings() {
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
      const data = await getSettings();
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await saveSettings(settings);
      addToast('Business settings saved to Firebase!', 'success');
    } catch (err) {
      addToast('Error saving settings', 'error');
    }
  };

  return (
    <AdminLayout title="Business Details Settings">
      <form onSubmit={handleSave} style={{ maxWidth: '600px', background: '#FFFFFF', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8' }}>
        <div className="form-group">
          <label className="form-label">Business Name</label>
          <input
            type="text"
            className="form-input"
            value={settings.business_name}
            onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tagline</label>
          <input
            type="text"
            className="form-input"
            value={settings.business_tagline}
            onChange={(e) => setSettings({ ...settings, business_tagline: e.target.value })}
          />
        </div>

        <div className="grid grid-2" style={{ gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-input"
              value={settings.business_phone}
              onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp Number</label>
            <input
              type="text"
              className="form-input"
              value={settings.business_whatsapp}
              onChange={(e) => setSettings({ ...settings, business_whatsapp: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Business Email</label>
          <input
            type="email"
            className="form-input"
            value={settings.business_email}
            onChange={(e) => setSettings({ ...settings, business_email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Farm Address</label>
          <textarea
            className="form-input"
            rows="3"
            value={settings.business_address}
            onChange={(e) => setSettings({ ...settings, business_address: e.target.value })}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Instagram Link</label>
          <input
            type="text"
            className="form-input"
            value={settings.business_instagram}
            onChange={(e) => setSettings({ ...settings, business_instagram: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary">SAVE SETTINGS</button>
      </form>
    </AdminLayout>
  );
}
