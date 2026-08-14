import React from 'react';
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

export default function PaymentSettings() {
  return (
    <AdminLayout title="Payment Methods Configuration">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', maxWidth: '540px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CreditCard size={18} color="#C17817" />
          <span>Payment Gateways</span>
        </h3>

        <div style={{ marginBottom: '16px', padding: '16px', background: '#E8F5E9', borderRadius: '6px', border: '1px solid #4A7C59', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <CheckCircle2 size={20} color="#4A7C59" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#2C1810' }}>Cash on Delivery (COD)</strong>
            <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '2px' }}>
              Active and ready for customer checkout across India.
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', background: '#FFF8ED', borderRadius: '6px', border: '1px solid #F0D48A', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <AlertCircle size={20} color="#C17817" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#2C1810' }}>Online Payments (UPI, Cards, NetBanking)</strong>
            <div style={{ fontSize: '12px', color: '#5C4A3A', marginTop: '2px' }}>
              Gateway integration configured as "Coming Soon". Can be activated once Razorpay/PhonePe API keys are linked.
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
