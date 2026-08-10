import React from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function PaymentSettings() {
  return (
    <AdminLayout title="Payment Methods Configuration">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', maxWidth: '500px' }}>
        <div style={{ marginBottom: '16px', padding: '12px', background: '#E8F5E9', borderRadius: '4px', border: '1px solid #4A7C59' }}>
          <strong>✓ Cash on Delivery (COD):</strong> Enabled
        </div>
        <div style={{ padding: '12px', background: '#FFF8ED', borderRadius: '4px', border: '1px solid #F0D48A' }}>
          <strong>ℹ Online Payments (Razorpay/UPI):</strong> Configured as "Coming Soon"
        </div>
      </div>
    </AdminLayout>
  );
}
