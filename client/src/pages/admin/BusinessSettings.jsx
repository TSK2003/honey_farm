import React, { useEffect, useState } from 'react';
import { Settings, Save } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getSettings, saveSettings } from '../../services/firebaseService';

export default function BusinessSettings() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState({
    business_name: 'Honey Bee Farm',
    business_tagline: '100% Pure Natural Apiary Honey',
    business_phone: '7708510872',
    business_whatsapp: '7708510872',
    business_email: 'contact@honeybeefarm.com',
    business_address: 'Honey Bee Farm Apiaries, Tirunelveli, Tamil Nadu, India',
    business_instagram: 'https://www.instagram.com/honey_bee_farm_tirunelveli'
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
      addToast('Business settings saved to Firestore!', 'success');
    } catch (err) {
      addToast('Error saving settings', 'error');
    }
  };

  return (
    <AdminLayout title="Business Information Settings">
      <form onSubmit={handleSave} style={{ maxWidth: '600px', background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E8DFD3', boxShadow: '0 2px 8px rgba(44, 24, 16, 0.04)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Settings size={18} color="#C17817" />
          <span>Farm & Contact Info</span>
        </h3>

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
          <label className="form-label">Instagram Profile URL</label>
          <input
            type="text"
            className="form-input"
            value={settings.business_instagram}
            onChange={(e) => setSettings({ ...settings, business_instagram: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Save size={16} />
          <span>SAVE BUSINESS SETTINGS</span>
        </button>
      </form>
    </AdminLayout>
  );
}
