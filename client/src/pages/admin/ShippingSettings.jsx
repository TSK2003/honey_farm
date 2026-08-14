import React, { useState, useEffect } from 'react';
import { Truck, Save } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';
import { getSettings, saveSettings } from '../../services/firebaseService';

export default function ShippingSettings() {
  const { addToast } = useToast();
  const [shippingCharge, setShippingCharge] = useState(50);
  const [freeThreshold, setFreeThreshold] = useState(500);

  useEffect(() => {
    async function load() {
      const data = await getSettings();
      if (data) {
        if (data.shipping_charge !== undefined) setShippingCharge(data.shipping_charge);
        if (data.free_shipping_threshold !== undefined) setFreeThreshold(data.free_shipping_threshold);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    try {
      await saveSettings({
        shipping_charge: Number(shippingCharge),
        free_shipping_threshold: Number(freeThreshold)
      });
      addToast('Shipping rates saved to Firestore!', 'success');
    } catch (err) {
      addToast('Error saving shipping settings', 'error');
    }
  };

  return (
    <AdminLayout title="Shipping Settings">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', maxWidth: '500px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Truck size={18} color="#C17817" />
          <span>Delivery Rates & Thresholds</span>
        </h3>

        <div className="form-group">
          <label className="form-label">Standard Shipping Rate (₹)</label>
          <input type="number" className="form-input" value={shippingCharge} onChange={(e) => setShippingCharge(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Free Delivery Minimum Order Amount (₹)</label>
          <input type="number" className="form-input" value={freeThreshold} onChange={(e) => setFreeThreshold(e.target.value)} />
        </div>
        <button onClick={handleSave} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Save size={16} />
          <span>SAVE SHIPPING CONFIG</span>
        </button>
      </div>
    </AdminLayout>
  );
}
