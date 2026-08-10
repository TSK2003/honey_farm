import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

export default function ShippingSettings() {
  const { addToast } = useToast();
  const [shippingCharge, setShippingCharge] = useState(50);
  const [freeThreshold, setFreeThreshold] = useState(500);

  return (
    <AdminLayout title="Shipping Settings">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', maxWidth: '500px' }}>
        <div className="form-group">
          <label className="form-label">Standard Shipping Flat Rate (₹)</label>
          <input type="number" className="form-input" value={shippingCharge} onChange={(e) => setShippingCharge(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Free Shipping Minimum Threshold (₹)</label>
          <input type="number" className="form-input" value={freeThreshold} onChange={(e) => setFreeThreshold(e.target.value)} />
        </div>
        <button onClick={() => addToast('Shipping settings saved', 'success')} className="btn btn-primary">SAVE SHIPPING CONFIG</button>
      </div>
    </AdminLayout>
  );
}
