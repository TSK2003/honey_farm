import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../context/ToastContext';

export default function FarmContent() {
  const { addToast } = useToast();

  return (
    <AdminLayout title="Farm Story Content">
      <div style={{ background: 'white', padding: '24px', borderRadius: '6px', border: '1px solid #E5E0D8', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Beekeeping & Farm Story</h3>
        <p style={{ color: '#5C4A3A', fontSize: '13px', marginBottom: '16px' }}>
          Manage farm storytelling sections and 4-step beekeeping workflow descriptions.
        </p>
        <button onClick={() => addToast('Farm story saved', 'success')} className="btn btn-primary">SAVE FARM CONTENT</button>
      </div>
    </AdminLayout>
  );
}
